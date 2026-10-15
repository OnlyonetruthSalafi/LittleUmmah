// ใช้: node scripts/html-compare.mjs <ต้นแบบ> <ใหม่> — เทียบ HTML ที่มองเห็นได้ (ตัด script, useId, ชื่อ class ฟอนต์, ตัวคั่น React) ใช้ยืนยันว่าหน้าไทยไม่เปลี่ยน
import fs from "node:fs";
import path from "node:path";

const [a, b] = process.argv.slice(2);
const walk = (d) =>
  fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
// script bodies (RSC payload) and React useId values (depend on tree depth) are not visible output
const visible = (s) =>
  s
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "")
    .replace(/_R_[a-zA-Z0-9]+_/g, "_R_")
    // React text-node separators: "เสียง<!-- -->เปิด" renders the same as "เสียงเปิด"
    .replace(/<!-- -->/g, "")
    // next/font class hash depends on the file that defines the font (moved to app/fonts.ts)
    .replace(/_[0-9a-f]{6,8}-module__[A-Za-z0-9]+__variable/g, "-module__variable")
    .split("\n")
    .filter((l) => l.trim())
    .join("\n");
const ra = walk(a).map((f) => path.relative(a, f));
const rb = new Set(walk(b).map((f) => path.relative(b, f)));
let bad = 0;
for (const r of ra) {
  if (!rb.has(r)) { console.log("MISSING", r); bad++; continue; }
  const x = visible(fs.readFileSync(path.join(a, r), "utf8")).split("\n");
  const y = visible(fs.readFileSync(path.join(b, r), "utf8")).split("\n");
  if (x.join("\n") === y.join("\n")) continue;
  bad++;
  console.log("DIFF", r);
  let shown = 0;
  for (let i = 0; i < Math.max(x.length, y.length) && shown < 4; i++) {
    if (x[i] !== y[i]) { console.log("  -", (x[i] ?? "").slice(0, 200)); console.log("  +", (y[i] ?? "").slice(0, 200)); shown++; }
  }
}
for (const r of rb) if (!ra.includes(r)) console.log("EXTRA", r);
console.log(bad ? `${bad} page(s) differ` : `all ${ra.length} pages identical (visible HTML)`);
