import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ให้มือถือ/แท็บเล็ตในวง Wi-Fi บ้านเปิด dev server ผ่าน IP ของคอมได้ (มีผลเฉพาะ npm run dev)
  // ถ้าไม่ใส่ Next บล็อกสคริปต์ของ dev server หน้าเว็บโหลดแต่ภาพ เกมกดไม่ได้และไม่มีเสียง
  allowedDevOrigins: ["192.168.1.105"],
  // หน้า 404 ระดับ routing (src/app/global-not-found.tsx) — root layout อยู่ใต้ [lang] จึงไม่มี layout ให้ 404 ทั่วไป
  // คู่มือ Next: file-conventions/not-found (experimental)
  experimental: { globalNotFound: true },
};

export default nextConfig;
