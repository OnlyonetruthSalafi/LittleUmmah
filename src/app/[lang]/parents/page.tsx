import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

import { PageShell } from "@/components/layout/PageShell";
import { BackLink } from "@/components/ui/BackLink";
import { ArabicText } from "@/components/ui/ArabicText";
import type { Locale } from "@/i18n/config";
import { dict, type Dict } from "@/i18n/dict";
import { LocaleLink as Link } from "@/i18n/LocaleProvider";

import { ClearProgress } from "./ClearProgress";
import { PHOTO, SAHABA, SECTIONS, UI, ULAMA, type Evidence, type Section } from "./content";

export async function generateMetadata({ params }: PageProps<"/[lang]/parents">): Promise<Metadata> {
  const { lang } = await params;
  const { t } = dict(lang as Locale);
  return pageMetadata(lang as Locale, "/parents", t.header.parents, t.seo.parentsDescription, "welcome");
}

/*
  หน้าผู้ปกครอง — ผู้อ่านเป็นผู้ใหญ่ ปุ่มจึงใช้เกณฑ์ 48px (ข้อ 2) ไม่ใช่ 64px
  เนื้อหาทุกภาษาอยู่ใน ./content.ts (บทความยาวและตัวบทศาสนา ไม่อยู่ใน dictionary กลาง)
*/
function EvidenceList({ items, d }: { items: Evidence[]; d: Dict }) {
  return (
    <ol className="mt-3 space-y-4">
      {items.map((item) => (
        <li key={item.arabic} className="rounded-card-sm bg-sky-pale p-4">
          <blockquote>
            <p lang="ar" dir="rtl" className="text-ink text-xl leading-loose font-semibold">
              {item.arabic}
            </p>
            <p className="mt-2 leading-relaxed">“<ArabicText text={d.pick(item.tr)} />”</p>
          </blockquote>
          <p className="text-ink-soft mt-2 text-sm">
            {d.pick(UI.source)} <ArabicText text={d.pick(item.source)} /> <ShamelaLink href={item.href} d={d} />
          </p>
        </li>
      ))}
    </ol>
  );
}

function ShamelaLink({ href, d }: { href: string; d: Dict }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-brand-blue inline-flex min-h-12 items-center font-semibold underline underline-offset-4"
    >
      {d.pick(UI.openShamela)}
      <span className="sr-only">{d.pick(UI.newTab)}</span>
    </a>
  );
}

function FatwaSection({ d }: { d: Dict }) {
  return (
    <section className="mt-8" aria-labelledby="fatwa-heading">
      <h2 id="fatwa-heading" className="font-display text-brand-blue text-xl font-bold sm:text-2xl">
        {d.pick(UI.fatwaHeading)}
      </h2>
      <p className="mt-2 leading-relaxed">{d.pick(UI.fatwaIntro)}</p>

      <h3 className="font-display mt-6 text-lg font-bold">{d.pick(UI.fromSahaba)}</h3>
      <EvidenceList items={SAHABA} d={d} />

      <h3 className="font-display mt-6 text-lg font-bold">{d.pick(UI.fromUlama)}</h3>
      <EvidenceList items={ULAMA} d={d} />

      <p className="mt-4 leading-relaxed">
        <strong>{d.pick(UI.note)}</strong> {d.pick(UI.albaniNote)}{" "}
        <ShamelaLink href="https://shamela.ws/book/145204/7139" d={d} /> {d.pick(UI.albaniFollow)}
      </p>

      <h3 className="font-display mt-6 text-lg font-bold">{d.pick(UI.photoHeading)}</h3>
      <p className="mt-2 leading-relaxed">{d.pick(UI.photoIntro)}</p>
      <EvidenceList items={PHOTO} d={d} />
      <p className="mt-4 leading-relaxed">
        <strong>{d.pick(UI.note)}</strong> {d.pick(UI.lajnahNote)}{" "}
        <ShamelaLink href="https://shamela.ws/book/8381/858" d={d} /> {d.pick(UI.lajnahFollow)}
      </p>
    </section>
  );
}

function renderSection(section: Section, d: Dict) {
  return (
    <section key={section.title.th} className="mt-8">
      <h2 className="font-display text-brand-blue text-xl font-bold sm:text-2xl">{d.pick(section.title)}</h2>
      {section.body.map((line) => (
        <p key={line.th} className="mt-2 leading-relaxed">
          {d.pick(line)}
        </p>
      ))}
    </section>
  );
}

// ปุ่มฝั่งผู้ปกครอง ใช้ชุดปุ่มเดียวกับทั้งเว็บ (.ui-pill ใน controls.css)
const PARENT_LINK = "ui-pill";

export default async function ParentsPage({ params }: PageProps<"/[lang]/parents">) {
  const { lang } = await params;
  const d = dict(lang as Locale);
  const titleSub = d.pickSub(UI.title);
  return (
    <PageShell>
      <BackLink />
      <article className="scene-copy shadow-soft rounded-card mx-auto mt-6 max-w-3xl p-6 sm:p-10">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
          {d.pick(UI.title)}
          {titleSub && (
            <span lang="en" className="text-ink-soft block text-lg font-semibold">
              {titleSub}
            </span>
          )}
        </h1>

        {SECTIONS.slice(0, 2).map((s) => renderSection(s, d))}
        {/* หลักฐานวางต่อจาก "แนวทางเนื้อหา" ทันที ผู้ปกครองที่สงสัยเรื่องภาพจะเจอคำตอบตรงนั้น */}
        <FatwaSection d={d} />
        {SECTIONS.slice(2, 4).map((s) => renderSection(s, d))}
        {/* ปุ่มล้างข้อมูลอยู่ใต้หัวข้อ "ข้อมูลส่วนตัว" ทันที */}
        <ClearProgress />
        {SECTIONS.slice(4).map((s) => renderSection(s, d))}

        <section className="mt-8">
          <h2 className="font-display text-brand-blue text-xl font-bold sm:text-2xl">{d.pick(UI.ages)}</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link href="/kids" className={PARENT_LINK}>
              {d.pick(UI.kids)}
            </Link>
            <Link href="/juniors" className={PARENT_LINK}>
              {d.pick(UI.juniors)}
            </Link>
          </div>
        </section>
      </article>
    </PageShell>
  );
}
