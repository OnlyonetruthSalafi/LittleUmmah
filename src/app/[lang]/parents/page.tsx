import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

import { PageShell } from "@/components/layout/PageShell";
import { BackLink } from "@/components/ui/BackLink";
import type { Locale } from "@/i18n/config";
import { dict, type Dict } from "@/i18n/dict";
import { LocaleLink as Link } from "@/i18n/LocaleProvider";

import { LS } from "@/features/learning-stars/content";
import { SECTIONS, UI, type Section } from "./content";

export async function generateMetadata({ params }: PageProps<"/[lang]/parents">): Promise<Metadata> {
  const { lang } = await params;
  const { t } = dict(lang as Locale);
  return pageMetadata(lang as Locale, "/parents", t.header.parents, t.seo.parentsDescription, "welcome");
}

/*
  หน้าผู้ปกครอง — ผู้อ่านเป็นผู้ใหญ่ ปุ่มจึงใช้เกณฑ์ 48px (ข้อ 2) ไม่ใช่ 64px
  เนื้อหาทุกภาษาอยู่ใน ./content.ts (บทความยาวและตัวบทศาสนา ไม่อยู่ใน dictionary กลาง)
*/
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

        <nav className="mt-6 flex flex-wrap gap-4" aria-label={d.pick(UI.title)}><Link href="/parents/settings" className="ui-pill">{d.pick(LS.settings)}</Link><Link href="/parents/evidence" className="ui-pill">{d.pick(LS.evidence)}</Link></nav>
        {SECTIONS.slice(0, 2).map((s) => renderSection(s, d))}
        {/* หลักฐานวางต่อจาก "แนวทางเนื้อหา" ทันที ผู้ปกครองที่สงสัยเรื่องภาพจะเจอคำตอบตรงนั้น */}
        <Link href="/parents/evidence" className="ui-pill mt-4">{d.pick(LS.allEvidence)}</Link>
        {SECTIONS.slice(2, 4).map((s) => renderSection(s, d))}
        {/* ปุ่มล้างข้อมูลอยู่ใต้หัวข้อ "ข้อมูลส่วนตัว" ทันที */}

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
