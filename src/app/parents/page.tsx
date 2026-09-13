import type { Metadata } from "next";
import Link from "next/link";

import { PageShell } from "@/components/layout/PageShell";
import { BackLink } from "@/components/ui/BackLink";

export const metadata: Metadata = { title: "สำหรับผู้ปกครอง" };

/*
  หน้าผู้ปกครอง — ผู้อ่านเป็นผู้ใหญ่ ปุ่มจึงใช้เกณฑ์ 48px (ข้อ 2) ไม่ใช่ 64px
  ข้อความอธิบายเฉพาะสิ่งที่เว็บทำจริงตอนนี้ ห้ามเขียนสัญญาสิ่งที่ยังไม่มี
*/
const SECTIONS = [
  {
    title: "Little Ummah คืออะไร",
    body: [
      "เว็บไซต์เรียนรู้อิสลามสำหรับเด็ก แบ่งเป็นหกเกาะ: ภาษาอาหรับเบื้องต้น มารยาทและศีลธรรม เรื่องเล่า สำรวจโลก เกม และศิลปะ",
      "ทุกเกาะมีเนื้อหาแยกสองช่วงวัย คือ 3-6 ปี (เรียนรู้ผ่านการเล่น ประโยคสั้น) และ 7 ปีขึ้นไป (อ่านเองได้ มีรายละเอียดมากขึ้น)",
    ],
  },
  {
    title: "แนวทางเนื้อหา",
    body: [
      "ไม่มีภาพใบหน้าของคนหรือสัตว์ ตัวละครนำทางเป็นหุ่นยนต์ และภาพประกอบเป็นสิ่งของหรือธรรมชาติ",
      "ไม่มีเสียงดนตรีหรือเพลงบรรเลง เสียงในเว็บเป็นเสียงอ่านออกเสียงเท่านั้น",
      "เรื่องเล่าใช้เนื้อหาจากอัลกุรอาน และไม่วาดภาพศาสดาหรือเศาะหาบะฮ์",
    ],
  },
  {
    title: "เสียงอ่าน",
    body: [
      "เด็กที่ยังอ่านไม่ออกกดปุ่ม “ฟัง” หรือแตะเกาะเพื่อฟังเสียงอ่านได้ ปิดเสียงได้ที่ปุ่ม “เสียง” มุมบนขวา",
      "ตอนนี้ใช้เสียงสังเคราะห์ภาษาไทยของเครื่อง ถ้าไม่ได้ยินเสียง ให้ตรวจว่าอุปกรณ์ติดตั้งเสียงภาษาไทยไว้แล้ว",
      "คำภาษาอาหรับแสดงคำอ่านภาษาไทยกำกับไว้ เพราะเสียงสังเคราะห์อ่านอักษรอาหรับไม่ได้ ควรฝึกออกเสียงไปพร้อมกับลูก",
    ],
  },
  {
    title: "ข้อมูลส่วนตัว",
    body: [
      "เว็บไม่มีการสมัครสมาชิกและไม่เก็บข้อมูลของเด็ก สิ่งเดียวที่จำไว้คือการตั้งค่าเปิด/ปิดเสียง ซึ่งเก็บในเบราว์เซอร์ของเครื่องนี้เท่านั้น",
    ],
  },
  {
    title: "คำแนะนำ",
    body: [
      "นั่งเรียนไปพร้อมกับลูก ถามคำถามและชวนคุยต่อจากเนื้อหาในแต่ละการ์ด",
      "กิจกรรมในเกาะศิลปะทำบนกระดาษจริงได้ ช่วยพักสายตาจากหน้าจอ",
    ],
  },
];

const PARENT_LINK =
  "scene-copy text-ink shadow-soft hover:shadow-float inline-flex min-h-12 items-center rounded-full px-5 font-semibold transition-[transform,box-shadow] duration-200 ease-out motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98] motion-safe:active:duration-75";

export default function ParentsPage() {
  return (
    <PageShell>
      <BackLink />
      <article className="scene-copy shadow-soft rounded-card mx-auto mt-6 max-w-3xl p-6 sm:p-10">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
          สำหรับผู้ปกครอง
          <span lang="en" className="text-ink-soft block text-lg font-semibold">
            For parents
          </span>
        </h1>

        {SECTIONS.map((section) => (
          <section key={section.title} className="mt-8">
            <h2 className="font-display text-brand-blue text-xl font-bold sm:text-2xl">{section.title}</h2>
            {section.body.map((line) => (
              <p key={line} className="mt-2 leading-relaxed">
                {line}
              </p>
            ))}
          </section>
        ))}

        <section className="mt-8">
          <h2 className="font-display text-brand-blue text-xl font-bold sm:text-2xl">ไปยังช่วงวัย</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link href="/kids" className={PARENT_LINK}>
              วัย 3-6 ปี
            </Link>
            <Link href="/juniors" className={PARENT_LINK}>
              วัย 7 ปีขึ้นไป
            </Link>
          </div>
        </section>
      </article>
    </PageShell>
  );
}
