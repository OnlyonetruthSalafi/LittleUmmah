import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    // Static App Router pages contain inline bootstrap scripts; games use inline
    // styles for scene coordinates. All fonts, images and audio are self-hosted.
    const csp = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self'",
      "media-src 'self'",
      "connect-src 'self'",
      "object-src 'none'",
      "frame-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      // WebKit ignores frame-ancestors in report-only mode; X-Frame-Options
      // below enforces SAMEORIGIN. Reserve a reporting group for a future
      // collector; without Reporting-Endpoints, reports stay in the console.
      "report-to csp",
    ].join('; ');
    return [{
      source: '/:path*',
      headers: [
        { key: 'Content-Security-Policy-Report-Only', value: csp },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), fullscreen=(self)' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      ],
    }];
  },
  // ให้มือถือ/แท็บเล็ตในวง Wi-Fi บ้านเปิด dev server ผ่าน IP ของคอมได้ (มีผลเฉพาะ npm run dev)
  // ถ้าไม่ใส่ Next บล็อกสคริปต์ของ dev server หน้าเว็บโหลดแต่ภาพ เกมกดไม่ได้และไม่มีเสียง
  allowedDevOrigins: ["192.168.1.105"],
  // หน้า 404 ระดับ routing (src/app/global-not-found.tsx) — root layout อยู่ใต้ [lang] จึงไม่มี layout ให้ 404 ทั่วไป
  // คู่มือ Next: file-conventions/not-found (experimental)
  experimental: { globalNotFound: true },
};

export default nextConfig;
