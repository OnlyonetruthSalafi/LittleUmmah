import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ให้มือถือ/แท็บเล็ตในวง Wi-Fi บ้านเปิด dev server ผ่าน IP ของคอมได้ (มีผลเฉพาะ npm run dev)
  // ถ้าไม่ใส่ Next บล็อกสคริปต์ของ dev server หน้าเว็บโหลดแต่ภาพ เกมกดไม่ได้และไม่มีเสียง
  allowedDevOrigins: ["192.168.1.105"],
};

export default nextConfig;
