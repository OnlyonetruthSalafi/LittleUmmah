import { ArabicText } from "@/components/ui/ArabicText";
import type { Text } from "@/i18n/config";
import type { Dict } from "@/i18n/dict";
import type { Evidence } from "@/content/evidence";
import {
  FAITH_EVIDENCE,
  STORY_EVIDENCE,
  type EvidenceGroup,
} from "@/content/evidenceUsage";
import { UI } from "./content";

/*
  ที่มาของนิทานและบทเรียน — อ่านจากทะเบียนกลาง src/content/evidence.ts (roadmap 10.1 ข้อ 3 ขั้น 2)
  แสดงสถานะตามจริง: ตรวจแล้ว (ใคร วันไหน ตรวจอย่างไร) หรือ รอตรวจ — ห้ามเขียนว่าตรวจแล้วถ้า verified เป็น null
*/
const T = {
  heading: {
    th: "ที่มาของนิทานและบทเรียน",
    en: "Sources of the stories and lessons",
  },
  intro: {
    th: "นิทานและบทเรียนศาสนาในเว็บนี้เล่าจากอัลกุรอานและหะดีษเศาะฮีห์เท่านั้น ความหมายอายะฮ์ใช้คำแปลของสมาคมนักเรียนเก่าอาหรับฯ ฉบับศูนย์กษัตริย์ฟะฮัด รายการข้างล่างบอกที่มาของแต่ละเรื่อง และบอกตามจริงว่ารายการไหนตรวจกับต้นฉบับแล้ว รายการไหนยังรอตรวจ",
    en: "The religious stories and lessons on this website are told only from the Qur'an and authentic hadith. The verse meanings use Saheeh International in English and the King Fahd Complex translation in Thai. The list below gives the sources of each story and says honestly which entries have been checked against the original and which are still waiting.",
  },
  reviewer: {
    th: "ผู้ตรวจตอนนี้คือ Claude (AI) ซึ่งเทียบกับต้นฉบับใน Shamela และ quran.com ผู้รู้ที่เป็นคนจะตรวจทานอีกครั้งในช่วงเปิดทดสอบ",
    en: "The checks so far were done by Claude (an AI) against the originals on Shamela and quran.com. A human scholar will review them again during the test period.",
  },
  stories: { th: "นิทาน", en: "Stories" },
  faith: {
    th: "เรียนรู้อิสลามพื้นฐานสำหรับเด็ก",
    en: "Islamic Basics for Kids",
  },
  checked: { th: "ตรวจแล้ว", en: "Checked" },
  pending: { th: "รอตรวจ", en: "Waiting to be checked" },
  count: {
    th: "ตรวจแล้ว {done} จาก {all} รายการ",
    en: "{done} of {all} checked",
  },
  open: { th: "เปิดต้นฉบับ", en: "Open the original" },
  howQuran: {
    th: "เทียบความหมายภาษาไทยในนิทานกับคำแปลฉบับศูนย์กษัตริย์ฟะฮัดแล้ว",
    en: "The Thai meaning in the story was compared with the King Fahd Complex Thai translation (quran.com id 51); the English text has not been checked yet",
  },
  howRef: {
    th: "เทียบเลขอ้างอิงกับหน้าต้นฉบับใน Shamela แล้ว",
    en: "The reference number was matched to the original page on Shamela",
  },
} satisfies Record<string, Text>;

function fmtDate(iso: string, d: Dict) {
  return new Intl.DateTimeFormat(
    d.locale === "th" ? "th-TH-u-ca-gregory" : "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    },
  ).format(new Date(iso + "T00:00:00Z"));
}

function Item({ e, d }: { e: Evidence; d: Dict }) {
  return (
    <li className="border-sky-pale border-t py-3 first:border-t-0">
      <p className="font-semibold">
        <ArabicText text={e.ref} />
        {e.grade && (
          <span className="text-ink-soft font-normal">
            {" "}
            · <ArabicText text={e.grade} />
          </span>
        )}
      </p>
      {e.verified ? (
        <p className="mt-1 text-sm">
          <span aria-hidden="true">✓ </span>
          <strong>{d.pick(T.checked)}</strong> {fmtDate(e.verified.date, d)} —{" "}
          {d.pick(e.kind === "quran" ? T.howQuran : T.howRef)}
        </p>
      ) : (
        <p className="text-ink-soft mt-1 text-sm">
          <span aria-hidden="true">○ </span>
          {d.pick(T.pending)}
        </p>
      )}
      {e.url && (
        <a
          href={e.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-blue inline-flex min-h-12 items-center text-sm font-semibold underline underline-offset-4"
        >
          {d.pick(T.open)}
          <span className="sr-only">{d.pick(UI.newTab)}</span>
        </a>
      )}
    </li>
  );
}

function Group({ g, d }: { g: EvidenceGroup; d: Dict }) {
  const done = g.items.filter((e) => e.verified).length;
  return (
    <details className="rounded-card-sm bg-sky-pale group">
      <summary className="flex min-h-12 cursor-pointer list-none items-center gap-x-3 px-4 py-2 [&::-webkit-details-marker]:hidden">
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="h-5 w-5 shrink-0 text-brand-blue motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-open:rotate-90"
        >
          <path
            d="M7 4l6 6-6 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="flex flex-wrap items-baseline gap-x-3">
          <span className="font-semibold">{d.pick(g.title)}</span>
          <span className="text-ink-soft text-sm">
            {d
              .pick(T.count)
              .replace("{done}", String(done))
              .replace("{all}", String(g.items.length))}
          </span>
        </span>
      </summary>
      <ul className="bg-white/60 rounded-b-card-sm px-4">
        {g.items.map((e) => (
          <Item key={e.id} e={e} d={d} />
        ))}
      </ul>
    </details>
  );
}

export function SourceRegistry({ d }: { d: Dict }) {
  return (
    <section className="mt-10" aria-labelledby="sources-heading">
      <h2
        id="sources-heading"
        className="font-display text-brand-blue text-xl font-bold sm:text-2xl"
      >
        {d.pick(T.heading)}
      </h2>
      <p className="mt-2 leading-relaxed">{d.pick(T.intro)}</p>
      <p className="text-ink-soft mt-2 text-sm leading-relaxed">
        {d.pick(T.reviewer)}
      </p>

      <h3 className="font-display mt-6 text-lg font-bold">
        {d.pick(T.stories)}
      </h3>
      <div className="mt-3 space-y-2">
        {STORY_EVIDENCE.map((g) => (
          <Group key={g.key} g={g} d={d} />
        ))}
      </div>

      <h3 className="font-display mt-6 text-lg font-bold">{d.pick(T.faith)}</h3>
      <div className="mt-3 space-y-2">
        {FAITH_EVIDENCE.map((g) => (
          <Group key={g.key} g={g} d={d} />
        ))}
      </div>
    </section>
  );
}
