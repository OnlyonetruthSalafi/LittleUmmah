import Image from "next/image";

import { SparkleIcon } from "@/components/icons/SparkleIcon";
import { StickerArcTitle } from "@/components/landing/StickerArcTitle";

/*
  เจ้าของโปรเจกต์เลือกหัวเรื่องอังกฤษโค้งตาม mockup และคำแปลไทยเล็กลงด้านล่าง
  SVG textPath จัดตัวอักษรตามเส้นโค้งคงที่ ไม่ใช้ animation หรือภาพตัวอักษร
  ข้อความใน h1 ให้ screen reader อ่านครั้งเดียว ส่วน SVG เป็นภาพตกแต่ง
  ไม่มีปุ่ม "เริ่มสำรวจเลย" แล้ว เพราะการ์ดเลือกช่วงวัยอยู่ถัดลงไปในหน้าจอแรกอยู่แล้ว
  ปุ่มนั้นกลายเป็นขั้นตอนซ้ำที่ทำให้เด็กต้องกดสองทีกว่าจะถึงเนื้อหา
*/
export function Hero() {

  /* ไม่มี padding ล่าง: ระยะก่อนคำโค้ง "Obey" ย้ายไปอยู่ที่ ObeyArc (pt-5 / sm:pt-7) ช่องไฟจึงเท่าเดิม */
  return (
    <section className="relative mx-auto w-full max-w-3xl px-4 pt-4 text-center sm:px-6 sm:pt-8">
      <div
        aria-hidden="true"
        className="hero-glow pointer-events-none absolute inset-0 -z-10 scale-x-125 scale-y-150"
      />
      <h1 lang="en" className="font-display font-extrabold">
        <span className="sr-only">Learn, Play, Grow</span>
        <StickerArcTitle
          words={["Learn,", "Play,", "Grow"]}
          arc="M 30 150 Q 380 20 730 150"
          fontSize={92}
        />
      </h1>

      {/*
        หุ่นยนต์นำทาง (ท่า Faith ชูนิ้วชี้) ชี้ไปที่ข้อความ ตามข้อ 1.2
        นิ้วชี้อยู่ฝั่งขวาของภาพ จึงวางหุ่นยนต์ซ้าย ข้อความขวา
        ภาพ alt="" เพราะเป็นของตกแต่ง ข้อความจริงอยู่ข้างๆ
        กรอบรูปขนาดคงที่กัน layout ขยับ, ไม่มี animation วนตามข้อ 2.1

        ไม่มีกรอบคำพูดแล้ว (เจ้าของโปรเจกต์ให้เน้นตัวข้อความแทน)
        - หัวข้อ: สามคำใช้สีเดียวกับ Learn / Play / Grow ด้านบน ให้สองภาษาจับคู่กันด้วยสี
          ใช้ title-sticker (ขอบขาว+เงา เฉพาะจอ sm ขึ้นไป เพราะจอเล็กขอบขาวทำสระไทยแตก)
          สีแบรนด์ทั้งสาม ≥ 4.6:1 บน sky-pale และตัวใหญ่ใช้เกณฑ์ 3:1
        - ประกายดาวขนาบหัวข้อ และเส้นทองคั่น เป็นของตกแต่ง aria-hidden
        - ข้อความรองมีเงาขาวชิดตัวอักษรแบบเดียวกับชื่อเกาะ อ่านชัดบนฉากโดยไม่ต้องมีกรอบทึบ
      */}
      <div className="mx-auto mt-3 flex max-w-2xl items-center justify-center gap-2 sm:mt-4 sm:gap-4">
        <Image
          src="/Character/faith.webp"
          alt=""
          width={400}
          height={400}
          sizes="(max-width: 639px) 96px, 144px"
          className="logo-mark-glow size-24 shrink-0 object-contain sm:size-36"
        />

        <div className="min-w-0 flex-1 text-left">
          <p className="font-display title-sticker flex flex-wrap items-center gap-x-2 text-2xl leading-snug font-extrabold sm:text-4xl">
            <SparkleIcon className="logo-mark-glow text-sun size-5 shrink-0 sm:size-7" />
            <span className="text-brand-blue">เรียนรู้</span>
            <span className="text-brand-amber">เล่นสนุก</span>
            <span className="text-brand-green">เติบโต</span>
            <SparkleIcon className="logo-mark-glow text-sun size-4 shrink-0 sm:size-6" />
          </p>

          <span
            aria-hidden="true"
            className="via-sun mt-1.5 block h-0.5 w-28 rounded-full bg-gradient-to-r from-transparent to-transparent sm:mt-2 sm:w-44"
          />

          {/* ภาษาไทยไม่มีช่องว่างระหว่างคำ เบราว์เซอร์จึงตัดกลางคำได้ ("คุณพ่อคุณ / แม่")
              ห่อแต่ละวลีด้วย whitespace-nowrap ให้ขึ้นบรรทัดใหม่เฉพาะช่องว่างระหว่างวลี */}
          <p className="island-caption text-ink mt-1.5 text-base font-semibold text-pretty sm:mt-2 sm:text-xl">
            <span className="whitespace-nowrap">รู้จักความรัก</span>{" "}
            <span className="whitespace-nowrap">เชื่อฟัง</span>{" "}
            <span className="whitespace-nowrap">ไว้วางใจ</span>{" "}
            <span className="whitespace-nowrap">คุณพ่อคุณแม่</span>{" "}
            <span className="whitespace-nowrap">และเปี่ยมไปด้วยศรัทธา</span>{" "}
            <span className="whitespace-nowrap">ด้วยอิสลาม</span>
          </p>
        </div>
      </div>
    </section>
  );
}
