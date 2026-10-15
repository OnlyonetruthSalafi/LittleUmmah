// ใช้: node scripts/html-snapshot.mjs <โฟลเดอร์> — เก็บ HTML ของหน้าไทยที่ prerender แล้ว (หลัง npm run build) ตัด hash ของ build ออก
import fs from "node:fs";
import path from "node:path";

const out = process.argv[2];
fs.rmSync(out, { recursive: true, force: true });
const root = ".next/server/app";
const walk = (d) =>
  fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const buildId = fs.readFileSync(".next/BUILD_ID", "utf8").trim();
let n = 0;
for (const f of walk(root).filter((f) => f.endsWith(".html"))) {
  let rel = path.relative(root, f).split(path.sep).join("/");
  if (rel === "th.html") rel = "index.html";
  rel = rel.replace(/^th\//, ""); // after the [lang] move, Thai pages live under th/
  if (rel.startsWith("en/") || rel === "en.html") continue;
  let s = fs.readFileSync(f, "utf8");
  s = s.split(buildId).join("BUILD");
  s = s.replace(/\/_next\/static\/[^"'\s)\\]+/g, "/_next/static/X");
  s = s.replace(/></g, ">\n<");
  const dst = path.join(out, rel);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.writeFileSync(dst, s);
  n++;
}
console.log("snapshot ->", out, n, "pages");
