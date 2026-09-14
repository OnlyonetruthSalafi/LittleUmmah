"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";

import { LessonIcon } from "@/components/icons/LessonIcon";
import { useSound } from "@/components/sound/SoundProvider";
import { AGE_GROUPS } from "@/lib/games";

import { SHELF_TALL, SHELF_WIDE, type ShelfArt, type ShelfBook } from "../shelf";
import "../bookshelf.css";

/*
  ตู้หนังสือของเกาะเรื่องเล่า

  - ภาพตู้สองแบบ: กว้าง (2 ชั้น x 4 เล่ม) สำหรับจอ ≥ 640px และสูง (4 ชั้น x 2 เล่ม) สำหรับมือถือ
    ช่องที่กดได้คือทั้งช่องบนชั้น ไม่ใช่แค่ตัวหนังสือ จึงได้ ≥ 64px แม้หนังสือบนมือถือจะเล็ก
  - กดหนังสือที่มีนิทาน: หนังสือถูกดึงออกจากชั้น หันเข้าหาจอ แล้วลอยมาขยายกลางจอ
    ขนาดปลายทางเท่าปกหนังสือในหน้านิทาน แล้วจึงเปลี่ยนหน้า (?play=1 ให้เริ่มเล่นเอง)
  - ปิดการเคลื่อนไหว: ไปหน้านิทานทันที ไม่ลอย
  - เมื่อหนังสือลอยเสร็จ เปลี่ยนหน้าด้วย timer เป็นหลัก ไม่รอ event ของ animation อย่างเดียว
    ถ้า animation ถูกขัดจังหวะ event จะไม่มาเลย แล้วเด็กจะค้างอยู่ที่ตู้
*/

const FLY_MS = 950;
const TINTS = ["#0f7c93", "#1e5fbf", "#b7791f", "#15803d", "#7c3aed", "#0e7490", "#c2410c", "#be185d"];

type Flying = { book: ShelfBook; tint: string; from: DOMRect };

function BookFace({ book, tint }: { book: ShelfBook; tint: string }) {
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
          เร็วๆ นี้
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

function Shelf({
  art,
  rows,
  variant,
  onOpen,
  onPick,
  flyingId,
}: {
  art: ShelfArt;
  rows: { books: ShelfBook[]; offset: number; ageLabel?: { th: string; en: string } }[];
  variant: "wide" | "tall";
  onOpen: (e: MouseEvent<HTMLAnchorElement>, book: ShelfBook, tint: string) => void;
  onPick: (book: ShelfBook) => void;
  flyingId?: string;
}) {
  return (
    <div className="bs-shelf" data-variant={variant} style={{ aspectRatio: `${art.width} / ${art.height}` }}>
      <Image src={art.src} alt="" fill priority sizes="(max-width: 639px) 100vw, 1100px" className="bs-art" />

      <div
        className="bs-plaque"
        style={{ left: `${art.plaque.l}%`, right: `${art.plaque.r}%`, top: `${art.plaque.t}%`, bottom: `${art.plaque.b}%` }}
      >
        <span className="bs-plaque-th">เรื่องเล่า</span>
        <span className="bs-plaque-en" lang="en">
          Stories
        </span>
      </div>

      {rows.map((row, r) => (
        <div
          key={r}
          className="bs-row"
          style={{
            left: `${art.l}%`,
            right: `${art.r}%`,
            top: `${art.rows[r].t}%`,
            height: `${art.rows[r].b - art.rows[r].t}%`,
            gridTemplateColumns: `repeat(${row.books.length}, minmax(0, 1fr))`,
          }}
        >
          {row.books.map((book, i) => {
            const tint = TINTS[(row.offset + i) % TINTS.length];
            const label = (
              <span className="sr-only">
                {book.titleTh} {book.href ? "" : "(เร็วๆ นี้)"}
              </span>
            );
            return book.href ? (
              <Link
                key={book.id}
                href={book.href}
                className="bs-cell"
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
                key={book.id}
                type="button"
                className="bs-cell"
                aria-disabled="true"
                onClick={() => onPick(book)}
                onPointerEnter={() => onPick(book)}
                onFocus={() => onPick(book)}
              >
                <BookFace book={book} tint={tint} />
                {label}
              </button>
            );
          })}
          {row.ageLabel && (
            <span className="bs-tag">
              {row.ageLabel.th}
              <span lang="en"> · {row.ageLabel.en}</span>
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export function Bookshelf({ kids, juniors, introTh, introEn }: { kids: ShelfBook[]; juniors: ShelfBook[]; introTh: string; introEn: string }) {
  const router = useRouter();
  const { speak } = useSound();
  const [picked, setPicked] = useState<ShelfBook | null>(null);
  const [flying, setFlying] = useState<Flying | null>(null);

  const age = (id: "kids" | "juniors") => {
    const g = AGE_GROUPS.find((a) => a.id === id);
    return g ? { th: g.nameTh, en: g.nameEn } : undefined;
  };

  useEffect(() => {
    for (const b of [...kids, ...juniors]) if (b.href) router.prefetch(b.href);
  }, [kids, juniors, router]);

  const open = (e: MouseEvent<HTMLAnchorElement>, book: ShelfBook, tint: string) => {
    // ปุ่มพิเศษ (เปิดแท็บใหม่) ปล่อยให้เบราว์เซอร์จัดการเอง
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    if (flying || !book.href) return;
    const href = `${book.href}?play=1`;
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
    speak(book.href ? book.titleTh : `${book.titleTh} เร็วๆ นี้`);
  };

  const shown = picked ?? kids.find((b) => b.href) ?? kids[0];

  return (
    <section aria-label="ตู้หนังสือนิทาน" className="bs-stage">
      <div className="bs-glow" aria-hidden="true" />

      <Shelf
        art={SHELF_WIDE}
        variant="wide"
        rows={[
          { books: kids, offset: 0, ageLabel: age("kids") },
          { books: juniors, offset: 4, ageLabel: age("juniors") },
        ]}
        onOpen={open}
        onPick={pick}
        flyingId={flying?.book.id}
      />
      <Shelf
        art={SHELF_TALL}
        variant="tall"
        rows={[
          { books: kids.slice(0, 2), offset: 0, ageLabel: age("kids") },
          { books: kids.slice(2), offset: 2 },
          { books: juniors.slice(0, 2), offset: 4, ageLabel: age("juniors") },
          { books: juniors.slice(2), offset: 6 },
        ]}
        onOpen={open}
        onPick={pick}
        flyingId={flying?.book.id}
      />

      {/* ป้ายชื่อเรื่องใต้ตู้: หนังสือบนชั้นเล็กเกินจะใส่ชื่อ จึงแสดงชื่อเล่มที่ชี้/แตะอยู่ที่นี่ */}
      <div className="scene-copy shadow-soft rounded-card mx-auto mt-6 flex max-w-3xl items-center gap-4 p-4 sm:p-5">
        <Image src="/Character/read.webp" alt="" width={96} height={96} className="size-16 shrink-0 object-contain sm:size-24" />
        <div className="min-w-0" aria-live="polite">
          <p className="font-display text-xl font-extrabold sm:text-2xl">
            {shown.titleTh}
            <span lang="en" className="text-ink-soft block text-sm font-semibold sm:text-base">
              {shown.titleEn}
            </span>
          </p>
          <p className="mt-1">
            {shown.href ? "แตะที่หนังสือ แล้วมาฟังนิทานกันนะ" : "เรื่องนี้กำลังจะมาเร็วๆ นี้นะ"}
            <span lang="en" className="text-ink-soft block text-sm">
              {shown.href ? "Tap the book to open the story!" : "Coming soon!"}
            </span>
          </p>
          {!picked && (
            <p className="text-ink-soft mt-2 text-sm">
              {introTh} <span lang="en">{introEn}</span>
            </p>
          )}
        </div>
      </div>

      {flying && <FlyingBook flying={flying} onDone={() => router.push(`${flying.book.href}?play=1`)} />}
    </section>
  );
}
