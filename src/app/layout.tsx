import type { Metadata, Viewport } from "next";
import { Baloo_2, Noto_Sans_Thai_Looped } from "next/font/google";
import "./globals.css";

/*
  ฟอนต์ display ฝั่งละติน — Baloo 2 ตัวอ้วนมน ตรงกับอารมณ์ของ mockup
  ไม่มีชุดอักษรไทย จึงให้ตกไปใช้ฟอนต์ไทยด้านล่างอัตโนมัติเมื่อเจอตัวไทย
*/
const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  display: "swap",
});

/*
  ฟอนต์ไทย — เลือกแบบ "มีหัว" (looped) เพราะเป็นรูปอักษรที่เด็กไทยหัดอ่านตอนต้น
  ฟอนต์ไทยไม่มีหัวอย่าง Kanit/Prompt อ่านยากกว่าสำหรับเด็กเล็ก
  ตัวนี้มีชุดละตินด้วย จึงใช้เป็นฟอนต์เนื้อความได้ทั้งสองภาษา
*/
const thai = Noto_Sans_Thai_Looped({
  variable: "--font-thai",
  weight: ["400", "600", "700", "800"],
  subsets: ["thai", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Little Ummah — เรียนรู้ เล่นสนุก เติบโต",
    template: "%s | Little Ummah",
  },
  description:
    "เว็บไซต์เรียนรู้อิสลามสำหรับเด็ก เรียนรู้ศรัทธา สร้างมารยาทที่ดี และเติบโตเป็นคนดีของโลกใบนี้ สำหรับเด็กวัย 3-6 ปี และ 7 ปีขึ้นไป",
};

export const viewport: Viewport = {
  themeColor: "#4fa8e8",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      className={`${baloo.variable} ${thai.variable} h-full antialiased`}
    >
      <body className="font-body bg-sky-pale text-ink flex min-h-full flex-col">
        {children}
      </body>
    </html>
  );
}
