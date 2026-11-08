import { Baloo_2, Noto_Sans_Thai_Looped } from "next/font/google";
// D2: เปลี่ยนตระกูลอาหรับที่บรรทัดนี้ (ตัวเลือกต้องรองรับน้ำหนัก 400/600/700)
import { Noto_Naskh_Arabic as ArabicFont } from "next/font/google";

/* ใช้ร่วมกันระหว่าง [lang]/layout.tsx และ global-not-found.tsx (หน้า 404 ไม่ผ่าน layout) */

/*
  ฟอนต์ display ฝั่งละติน — Baloo 2 ตัวอ้วนมน ตรงกับอารมณ์ของ mockup
  ไม่มีชุดอักษรไทย จึงให้ตกไปใช้ฟอนต์ไทยด้านล่างอัตโนมัติเมื่อเจอตัวไทย
*/
export const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  display: "swap",
});

/*
  ฟอนต์ไทย — เลือกแบบ "มีหัว" (looped) เพราะเป็นรูปอักษรที่เด็กไทยหัดอ่านตอนต้น
  ฟอนต์ไทยไม่มีหัวอย่าง Kanit/Prompt อ่านยากกว่าสำหรับเด็กเล็ก
  ตัวนี้มีชุดละตินด้วย จึงใช้เป็นฟอนต์เนื้อความได้ทั้งสองภาษา
*/
export const thai = Noto_Sans_Thai_Looped({
  variable: "--font-thai",
  weight: ["400", "600", "700", "800", "900"],
  subsets: ["thai", "latin"],
  display: "swap",
});

/* Naskh สำหรับอักษรเดี่ยวและข้อความมีฮะเราะกาต — ไม่เปลี่ยนฟอนต์ไทย/ละติน */
export const arabic = ArabicFont({
  variable: "--font-arabic-source",
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
  display: "swap",
  adjustFontFallback: true,
});

/** className ของ <html> ทุกหน้า รวม global-not-found */
export const fontClasses = `${baloo.variable} ${thai.variable} ${arabic.variable}`;
