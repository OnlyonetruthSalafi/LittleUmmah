"use client";

import Image from "next/image";
import { LocaleLink as Link, useLocalePath, useDict } from "@/i18n/LocaleProvider";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useId, useRef, useState, type CSSProperties, type MouseEvent } from "react";

import { LessonIcon } from "@/components/icons/LessonIcon";
import { useSound } from "@/components/sound/SoundProvider";
import { fmt } from "@/i18n/dict";
import { AGE_GROUPS } from "@/lib/games";

import { SHELF_TALL, SHELF_WIDE, type ShelfArt, type ShelfBook } from "../shelf";
import "../bookshelf.css";

/*
  ตู้หนังสือของเกาะเรื่องเล่า

  - ตู้เดียว แบ่งสองโซนตามช่วงวัย (เจ้าของโปรเจกต์สั่ง 7 ต.ค. 2026 ให้กลับเป็นตู้เดียวแต่แยกให้ชัดกว่าเดิม)
    แต่ละโซนมีป้ายแผ่นไม้ช่วงวัย + สัญลักษณ์รูปทรง (วงกลม = 3-6 ปี, ข้าวหลามตัด = 7+) + สีผนังหลังตู้ (ทอง/น้ำเงิน)
    ไม่มีกรอบเส้นรอบโซน — เจ้าของโปรเจกต์ดูแล้วว่าทำให้ตู้ดูแปลก (7 ต.ค. 2026)
    จึงไม่สื่อด้วยสีอย่างเดียว
    - จอกว้าง (≥ 640px) ภาพตู้กว้าง 2 ชั้น: ชั้นละหนึ่งวัย ป้ายเป็นแผ่นตั้งบนชั้นเป็นช่องแรกของแถว
      (ถ้าวางป้ายเหนือแถว ช่องหนังสือที่ 640px จะเหลือไม่ถึง 64px)
    - จอแคบ ภาพตู้สูง 4 ชั้น: สองชั้นต่อหนึ่งวัย ป้ายวางบนไม้คาน/ไม้ชั้นเหนือโซน
    ช่องที่กดได้คือทั้งช่องบนชั้น ไม่ใช่แค่ตัวหนังสือ จึงได้ ≥ 64px แม้หนังสือบนมือถือจะเล็ก
  - screen reader: แต่ละวัยเป็น section ที่มีหัวข้อ h2 คือป้ายช่วงวัย อ่านวัย 3-6 ปีครบก่อนวัย 7+
    ตู้จอกว้างกับตู้จอแคบสลับกันด้วย display:none จึงไม่ถูกอ่านซ้ำ
  - ไม่มีกล่องข้อความใต้ตู้ (เจ้าของโปรเจกต์สั่งลบ 7 ต.ค. 2026) ชี้/แตะหนังสือแล้วหุ่นอ่านชื่อเรื่องให้ฟัง
    screen reader อ่านชื่อเรื่องจากข้อความ sr-only ในแต่ละเล่ม
  - กดหนังสือที่มีนิทาน: หนังสือถูกดึงออกจากชั้น หันเข้าหาจอ แล้วลอยมาขยายกลางจอ
    ขนาดปลายทางเท่าปกหนังสือในหน้านิทาน แล้วจึงเปลี่ยนหน้า (?play=1 ให้เริ่มเล่นเอง)
  - ปิดการเคลื่อนไหว: ไปหน้านิทานทันที ไม่ลอย
  - เมื่อหนังสือลอยเสร็จ เปลี่ยนหน้าด้วย timer เป็นหลัก ไม่รอ event ของ animation อย่างเดียว
    ถ้า animation ถูกขัดจังหวะ event จะไม่มาเลย แล้วเด็กจะค้างอยู่ที่ตู้
*/

const FLY_MS = 950;
const TINTS = ["#0f7c93", "#1e5fbf", "#b7791f", "#15803d", "#7c3aed", "#0e7490", "#c2410c", "#be185d"];

type AgeId = "kids" | "juniors";
type Zone = { id: AgeId; books: ShelfBook[]; offset: number };
type Flying = { book: ShelfBook; tint: string; from: DOMRect };
type OpenFn = (e: MouseEvent<HTMLAnchorElement>, book: ShelfBook, tint: string) => void;

function ageLabel(id: AgeId) {
  const g = AGE_GROUPS.find((a) => a.id === id);
  return g ? { th: g.name.th, en: g.name.en } : { th: id, en: id };
}

function BookFace({ book, tint }: { book: ShelfBook; tint: string }) {
  const { t } = useDict();
  return (
    <span className="bs-book" style={{ "--tint": tint } as CSSProperties}>
      <span className="bs-cover">
        {book.cover ? (
          <Image src={book.cover} alt="" fill sizes="(max-width: 639px) 120px, 200px" className="object-cover" />
        ) : (
          <span className="bs-cover-art">
            <LessonIcon name={book.icon} className="bs-cover-icon" />
          </span>
        )}
      </span>
      {!book.href && (
        <span className="bs-soon" aria-hidden="true">
          {t.stories.shelf.soon}
        </span>
      )}
    </span>
  );
}

function FlyingBook({ flying, onDone }: { flying: Flying; onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { from } = flying;
    // ปลายทาง = ขนาดปกตอนหนังสือปิดในหน้านิทาน (สูตรเดียวกับ .sb-book ใน story.css) กลางจอ
    const bookW = Math.min(innerWidth - 32, 1100, Math.max(300, (innerHeight - 330) * 1.5));
    const toW = bookW / 2;
    const toH = (bookW * 2) / 3;
    const s = toW / from.width;
    const dx = (innerWidth - toW) / 2 - from.left;
    const dy = (innerHeight - toH) / 2 - from.top;
    const anim = el.animate(
      [
        { transform: "translate(0, 0) scale(1) rotateY(-14deg)" },
        // ดึงออกจากชั้น: ยกขึ้น ขยายนิด หันสันเข้าหาจอ
        { offset: 0.3, transform: `translate(${dx * 0.08}px, ${dy * 0.08 - from.height * 0.35}px) scale(${1 + (s - 1) * 0.12}) rotateY(-32deg)` },
        { transform: `translate(${dx}px, ${dy}px) scale(${s}) rotateY(0deg)` },
      ],
      { duration: FLY_MS, easing: "cubic-bezier(0.35, 0.1, 0.2, 1)", fill: "forwards" },
    );
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      onDone();
    };
    void anim.finished.then(finish, () => {});
    const timer = setTimeout(finish, FLY_MS + 150);
    return () => clearTimeout(timer);
  }, [flying, onDone]);

  const { from } = flying;
  return (
    <div className="bs-overlay" aria-hidden="true">
      <div className="bs-dim" />
      <div
        ref={ref}
        className="bs-fly"
        style={{ left: from.left, top: from.top, width: from.width, height: from.height }}
      >
        <BookFace book={flying.book} tint={flying.tint} />
      </div>
    </div>
  );
}

/** ป้ายช่วงวัย: สัญลักษณ์รูปทรง + ชื่อวัยไทยนำ อังกฤษรอง */
function AgeSign({ id, headingId, className, style }: { id: AgeId; headingId: string; className: string; style?: CSSProperties }) {
  const { pick, pickSub } = useDict();
  const label = ageLabel(id);
  return (
    <h3 id={headingId} className={className} data-zone={id} style={style}>
      <span className="bs-mark" aria-hidden="true" />
      <span className="bs-sign-text">
        <span className="bs-sign-th">{pick(label)}</span>
        {pickSub(label) && <span className="bs-sign-en" lang="en">
          {pickSub(label)}
        </span>}
      </span>
    </h3>
  );
}

/*
  จุดขึ้นบรรทัดใหม่ของป้ายชื่อ — ตัวตัดคำของเบราว์เซอร์ตัดชื่อนบีผิด (เช่น "นบีอิ|บรอฮี|มกับ")
  จึงให้ขึ้นบรรทัดได้เฉพาะหน้าคำที่กำหนด (ไม่ตัดหน้าคำแรกของชื่อ และไม่แยก "เจ้า|ของ")
  ชื่อหนังสือใหม่ที่ยาวแต่ไม่มีคำเหล่านี้ ให้เพิ่มคำในรายการ
*/
const BREAK_BEFORE = /(?<=.)(?=กับ|(?<!เจ้า)ของ|ใน|บน|ข้าม|ผู้|เจ้า|สอง|ลำ|นบี|ที่|จาก|ให้|ร้อง|สำหรับ|ตัดสิน)/;
function labelParts(title: string) {
  return title.split(BREAK_BEFORE);
}

/** ตู้กว้าง: ช่องป้ายวัยกว้างตามจำนวนเล่ม แถวที่มีเกิน 5 เล่มป้ายจะได้ไม่บีบจน "3-6" ตกบรรทัด */
function signFr(books: number) {
  return Math.max(1.45, (1.45 * books) / 5);
}

function BookCell({
  book,
  tint,
  flyingId,
  onOpen,
  onPick,
}: {
  book: ShelfBook;
  tint: string;
  flyingId?: string;
  onOpen: OpenFn;
  onPick: (book: ShelfBook) => void;
}) {
  const { locale, t, pick } = useDict();
  // ป้ายชื่อเป็นสติ๊กเกอร์เหนือเล่ม — คนที่ปิดเสียงก็รู้ว่าเล่มไหนเรื่องอะไร (อนุมัติ 15 ต.ค. 2026, ย้ายเหนือเล่ม 9 พ.ย. 2026)
  // ป้ายนี้เป็นชื่อที่ screen reader อ่านด้วย "เร็วๆ นี้" อ่านเฉพาะ screen reader
  const label = (
    <span className="bs-label">
      {(locale === "th" ? labelParts(pick(book.title)) : [pick(book.title)]).map((part, i) => (
        <Fragment key={i}>
          {i > 0 && <wbr />}
          <span className="whitespace-nowrap">{part}</span>
        </Fragment>
      ))}
      {!book.href && <span className="sr-only">{t.stories.shelf.soonSuffix}</span>}
    </span>
  );
  return book.href ? (
    <Link
      href={book.href}
      className="bs-cell"
      style={{ "--tint": tint } as CSSProperties}
      data-flying={flyingId === book.id || undefined}
      onClick={(e) => onOpen(e, book, tint)}
      onPointerEnter={() => onPick(book)}
      onFocus={() => onPick(book)}
    >
      <BookFace book={book} tint={tint} />
      {label}
    </Link>
  ) : (
    <button
      type="button"
      className="bs-cell"
      style={{ "--tint": tint } as CSSProperties}
      aria-disabled="true"
      onClick={() => onPick(book)}
      onPointerEnter={() => onPick(book)}
      onFocus={() => onPick(book)}
    >
      <BookFace book={book} tint={tint} />
      {label}
    </button>
  );
}

function Shelf({
  art,
  variant,
  title,
  zones,
  onOpen,
  onPick,
  flyingId,
}: {
  art: ShelfArt;
  title: { th: string; en?: string };
  variant: "wide" | "tall";
  zones: Zone[];
  onOpen: OpenFn;
  onPick: (book: ShelfBook) => void;
  flyingId?: string;
}) {
  const uid = useId();
  const crop = art.crop ?? { l: 0, r: 0 };
  const keep = 100 - crop.l - crop.r;
  // แถวต่อโซน: ตู้กว้าง 1 แถว/วัย, ตู้สูง 2 แถว/วัย
  const rowsPerZone = art.rows.length / zones.length;
  const pos = (r: number) => ({
    left: `${art.l}%`,
    right: `${art.r}%`,
    top: `${art.rows[r].t}%`,
    height: `${art.rows[r].b - art.rows[r].t}%`,
  });

  return (
    <div
      className="bs-shelf"
      data-variant={variant}
      style={{ aspectRatio: `${(art.width * keep) / 100} / ${art.height}` }}
    >
      {/* ภาพเต็มวางใน canvas ที่กว้างกว่ากรอบ แล้วกรอบตัดส่วนข้างออก พิกัดทุกตัวจึงยังเป็น % ของภาพเต็ม */}
      <div className="bs-canvas" style={{ width: `${(100 * 100) / keep}%`, left: `${(-crop.l * 100) / keep}%` }}>
        {/* lazy + fetchPriority แทน preload: ตู้ที่ถูก display:none จะไม่โหลด (ตามเอกสาร next/image เรื่อง art direction) */}
        <Image src={art.src} alt="" fill fetchPriority="high" sizes="(max-width: 639px) 130vw, 1100px" className="bs-art" />

        {/* ป้ายชื่อตู้เป็นหัวข้อ h2 (ป้ายช่วงวัยเป็น h3) ตู้กว้าง/ตู้แคบสลับกันด้วย display:none จึงไม่ถูกอ่านซ้ำ */}
        <h2
          className="bs-plaque"
          style={{ left: `${art.plaque.l}%`, right: `${art.plaque.r}%`, top: `${art.plaque.t}%`, bottom: `${art.plaque.b}%` }}
        >
          <span className="bs-plaque-th">{title.th}</span>
          {title.en && <span className="bs-plaque-en" lang="en">
            {title.en}
          </span>}
        </h2>

        {/* ผนังหลังตู้ย้อมสีตามช่วงวัย (ทองอุ่น = 3-6 ปี, น้ำเงิน = 7+) อยู่ใต้หนังสือและป้าย */}
        {art.walls.map((wall, r) => (
          <div
            key={r}
            className="bs-wall"
            data-zone={zones[Math.floor(r / rowsPerZone)]?.id}
            aria-hidden="true"
            style={{ left: `${art.l}%`, right: `${art.r}%`, top: `${wall.t}%`, height: `${wall.b - wall.t}%` }}
          />
        ))}

        {zones.map((zone, z) => {
          const headingId = `${uid}-${zone.id}`;
          const first = z * rowsPerZone;

          if (variant === "wide") {
            return (
              <section
                key={zone.id}
                aria-labelledby={headingId}
                className="bs-row"
                data-zone={zone.id}
                style={{ ...pos(first), gridTemplateColumns: `${signFr(zone.books.length)}fr repeat(${zone.books.length}, minmax(0, 1fr))` }}
              >
                <AgeSign id={zone.id} headingId={headingId} className="bs-sign" />
                {zone.books.map((book, i) => (
                  <BookCell
                    key={book.id}
                    book={book}
                    tint={TINTS[(zone.offset + i) % TINTS.length]}
                    flyingId={flyingId}
                    onOpen={onOpen}
                    onPick={onPick}
                  />
                ))}
              </section>
            );
          }

          const perRow = Math.ceil(zone.books.length / rowsPerZone);
          return (
            <section key={zone.id} aria-labelledby={headingId}>
              <AgeSign
                id={zone.id}
                headingId={headingId}
                className="bs-sign bs-sign-bar"
                style={{ top: `${art.zoneTags?.[z] ?? art.rows[first].t}%` }}
              />
              {Array.from({ length: rowsPerZone }, (_, k) => {
                const books = zone.books.slice(k * perRow, (k + 1) * perRow);
                return (
                  <div
                    key={k}
                    className="bs-row"
                    style={{ ...pos(first + k), gridTemplateColumns: `repeat(${perRow}, minmax(0, 1fr))` }}
                  >
                    {books.map((book, i) => (
                      <BookCell
                        key={book.id}
                        book={book}
                        tint={TINTS[(zone.offset + k * perRow + i) % TINTS.length]}
                        flyingId={flyingId}
                        onOpen={onOpen}
                        onPick={onPick}
                      />
                    ))}
                  </div>
                );
              })}
            </section>
          );
        })}
      </div>
    </div>
  );
}

/*
  ใช้ได้หลายตู้บนหน้าเดียว (เรื่องจริงจากอัลกุรอาน / เรื่องจริงจากหะดีษ — เจ้าของโปรเจกต์สั่งแยกตู้ 9 พ.ย. 2026)
  shelf = ชื่อตู้ใน dict (t.stories.shelf.title / hadithTitle)
*/
export function Bookshelf({ kids, juniors, shelf = "quran" }: { kids: ShelfBook[]; juniors: ShelfBook[]; shelf?: "quran" | "hadith" }) {
  const { t, sub, pick: pickText } = useDict();
  const key = shelf === "hadith" ? "hadithTitle" : "title";
  const title = { th: t.stories.shelf[key], en: sub?.stories.shelf[key] };
  const router = useRouter();
  const toLocale = useLocalePath();
  const { speak } = useSound();
  const [picked, setPicked] = useState<ShelfBook | null>(null);
  const [flying, setFlying] = useState<Flying | null>(null);

  const zones: Zone[] = [
    { id: "kids", books: kids, offset: 0 },
    { id: "juniors", books: juniors, offset: 4 },
  ];

  useEffect(() => {
    for (const b of [...kids, ...juniors]) if (b.href) router.prefetch(toLocale(b.href));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- toLocale เปลี่ยนเมื่อเปลี่ยนภาษาเท่านั้น ซึ่งโหลดหน้าใหม่ทั้งหน้าอยู่แล้ว
  }, [kids, juniors, router]);

  const open: OpenFn = (e, book, tint) => {
    // ปุ่มพิเศษ (เปิดแท็บใหม่) ปล่อยให้เบราว์เซอร์จัดการเอง
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    if (flying || !book.href) return;
    const href = toLocale(`${book.href}?play=1`);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push(href);
      return;
    }
    const face = e.currentTarget.querySelector(".bs-book");
    if (!face) return router.push(href);
    setFlying({ book, tint, from: face.getBoundingClientRect() });
  };

  const pick = (book: ShelfBook) => {
    if (picked?.id === book.id) return;
    setPicked(book);
    speak(book.href ? pickText(book.title) : fmt(t.stories.shelf.soonSpeech, { title: pickText(book.title) }));
  };


  return (
    <section
      aria-label={`${t.stories.shelf.label} ${title.th}`}
      className="bs-stage"
      data-shelf={shelf}
      // ชั้นที่มีเกิน 5 เล่ม ช่องในตู้กว้างแคบกว่า 64px จนทับกันบนจอ 640–779px จึงใช้ตู้สูงนานกว่า (bookshelf.css)
      data-crowded={Math.max(kids.length, juniors.length) > 5 || undefined}
    >
      <div className="bs-glow" aria-hidden="true" />

      <Shelf art={SHELF_WIDE} variant="wide" title={title} zones={zones} onOpen={open} onPick={pick} flyingId={flying?.book.id} />
      <Shelf art={SHELF_TALL} variant="tall" title={title} zones={zones} onOpen={open} onPick={pick} flyingId={flying?.book.id} />

      {flying && <FlyingBook flying={flying} onDone={() => router.push(toLocale(`${flying.book.href}?play=1`))} />}
    </section>
  );
}
