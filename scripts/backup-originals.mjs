/*
  สำรองไฟล์ที่ไม่อยู่ใน git ไปไว้นอกเครื่อง (roadmap 10.1 ข้อ 8, รีวิว Fable 10 พ.ย. 2026)

  ไฟล์เหล่านี้หายแล้วสร้างคืนไม่ได้ เพราะ git ไม่ได้เก็บไว้:
    - ภาพต้นฉบับ PNG ใน public/ ที่ .gitignore กันไว้ (webp ใน git สร้างจากไฟล์พวกนี้)
    - output/                ภาพต้นฉบับจาก Codex, เทคเสียง, รายงาน
    - scripts/voice-assets/  คลิปมาตรฐาน salam / ท่านนบี ﷺ
    - .env.local             คีย์ ElevenLabs — ปลายทางต้องเป็นที่ส่วนตัว ห้ามแชร์

  วิธีใช้ (รันจากโฟลเดอร์โปรเจกต์)
    node scripts/backup-originals.mjs <ปลายทาง>            คัดลอกเฉพาะไฟล์ใหม่/ขนาดเปลี่ยน
    node scripts/backup-originals.mjs <ปลายทาง> --verify   ตรวจว่าปลายทางครบและ sha256 ตรง (ทดสอบกู้)
    เพิ่ม --no-output ถ้าไม่อยากสำรอง output/ (ใหญ่หลาย GB)

  ปลายทางควรเป็นไดรฟ์ภายนอกหรือโฟลเดอร์ที่ซิงก์ขึ้นคลาวด์ส่วนตัว เช่น E:/LittleUmmah-backup
*/

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const dest = args.find(arg => !arg.startsWith("--"));
const verify = args.includes("--verify");
const withOutput = !args.includes("--no-output");
if (!dest) {
  console.error("ใส่ปลายทาง เช่น node scripts/backup-originals.mjs E:/LittleUmmah-backup");
  process.exit(1);
}

const root = process.cwd();
if (path.resolve(dest).startsWith(root + path.sep)) throw new Error("ปลายทางต้องอยู่นอกโฟลเดอร์โปรเจกต์");

const ignoredPublic = execFileSync("git", ["ls-files", "-o", "-i", "--exclude-standard", "--", "public"], { encoding: "utf8" })
  .split("\n").filter(Boolean);

const walk = dir => !fs.existsSync(dir) ? [] : fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(full) : [path.relative(root, full).replaceAll("\\", "/")];
});

const files = [
  ...ignoredPublic,
  ...walk(path.join(root, "scripts", "voice-assets")),
  ...(fs.existsSync(".env.local") ? [".env.local"] : []),
  ...(withOutput ? walk(path.join(root, "output")) : []),
];

const sha = file => createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const manifestPath = path.join(dest, "manifest.json");

if (verify) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const bad = [];
  for (const [rel, hash] of Object.entries(manifest.sha256)) {
    const target = path.join(dest, rel);
    if (!fs.existsSync(target)) bad.push(`หาย: ${rel}`);
    else if (sha(target) !== hash) bad.push(`ไม่ตรง: ${rel}`);
  }
  const missingSize = Object.entries(manifest.size).filter(([rel, size]) => fs.statSync(path.join(dest, rel), { throwIfNoEntry: false })?.size !== size);
  console.log(`ตรวจ sha256 ${Object.keys(manifest.sha256).length} ไฟล์, ขนาด ${Object.keys(manifest.size).length} ไฟล์`);
  if (bad.length || missingSize.length) {
    [...bad, ...missingSize.map(([rel]) => `ขนาดไม่ตรง/หาย: ${rel}`)].slice(0, 50).forEach(line => console.log("  " + line));
    process.exit(1);
  }
  console.log("ครบและตรงทุกไฟล์ — กู้คืนได้");
  process.exit(0);
}

let copied = 0;
let bytes = 0;
const manifest = { createdAt: new Date().toISOString(), sha256: {}, size: {} };
for (const rel of files) {
  const from = path.join(root, rel);
  const to = path.join(dest, rel);
  const stat = fs.statSync(from);
  if (fs.statSync(to, { throwIfNoEntry: false })?.size !== stat.size) {
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
    copied++;
    bytes += stat.size;
  }
  // output/ ใหญ่มาก ตรวจแค่ขนาด; ไฟล์ที่เหลือตรวจ sha256 เต็ม
  if (rel.startsWith("output/")) manifest.size[rel] = stat.size;
  else manifest.sha256[rel] = sha(from);
}
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 1));
console.log(`ทั้งหมด ${files.length} ไฟล์ (public ${ignoredPublic.length}) · คัดลอกใหม่ ${copied} ไฟล์ ${(bytes / 1e6).toFixed(1)} MB → ${dest}`);
console.log("ทดสอบกู้: node scripts/backup-originals.mjs " + dest + " --verify");
