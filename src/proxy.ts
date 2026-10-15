import { NextResponse, type NextRequest } from "next/server";

/*
  เลือกภาษาจาก URL (คู่มือ Next: guides/internationalization + file-conventions/proxy)

  - ไทยเป็นภาษาหลัก URL ไม่มี prefix: /learn/moral -> rewrite ภายในไปที่ /th/learn/moral (ผู้ใช้ไม่เห็น /th)
  - /th/... ที่พิมพ์เข้ามาตรงๆ -> redirect ไป URL ไม่มี prefix ให้มีที่อยู่เดียวต่อหน้า
  - /en/... ผ่านไปตรงๆ
  - เลือกภาษาให้อัตโนมัติเฉพาะหน้าแรก "/" และเฉพาะเมื่อเบราว์เซอร์ไม่มีภาษาไทยในรายการเลย
    ลิงก์หน้าด้านในที่พ่อแม่ส่งต่อกันใน LINE จะไม่ถูกเด้งไปภาษาอื่น ถ้าเคยเลือกภาษาเอง (คุกกี้ lu-lang) ใช้ตามนั้น
    ปิดไว้ (AUTO_SELECT = false) จนกว่าเนื้อหาอังกฤษครบ — เปิดเมื่อเจ้าของโปรเจกต์อนุมัติ

  ต้องรันบนเซิร์ฟเวอร์ที่รองรับ Next proxy (Vercel) ถ้าไม่มี proxy หน้าไทยทั้งหมดจะ 404
*/
const AUTO_SELECT = false;
export const LANG_COOKIE = "lu-lang";

function prefersEnglish(request: NextRequest): boolean {
  const chosen = request.cookies.get(LANG_COOKIE)?.value;
  if (chosen) return chosen === "en";
  const accept = request.headers.get("accept-language");
  if (!accept) return false; // บอทค้นหาและเครื่องที่ไม่ส่งภาษา = ไทย
  const langs = accept.split(",").map((part) => part.split(";")[0].trim().toLowerCase());
  return !langs.some((l) => l === "th" || l.startsWith("th-"));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/en" || pathname.startsWith("/en/")) return NextResponse.next();

  if (pathname === "/th" || pathname.startsWith("/th/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  if (AUTO_SELECT && pathname === "/" && prefersEnglish(request)) {
    const url = request.nextUrl.clone();
    url.pathname = "/en";
    return NextResponse.redirect(url, 307);
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/th" : `/th${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // ข้าม _next, API และไฟล์ใน public (มีนามสกุล เช่น .webp .mp3 .ico)
  matcher: ["/((?!_next/|api/|.*\\.[a-zA-Z0-9]+$).*)"],
};
