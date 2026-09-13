/*
  เตรียมภาพเกมความจำที่เจ้าของโปรเจกต์วาดมา (public/games/memorygame/*.png)
  ให้พร้อมใช้จริงที่ public/games/memory/*.webp

  ทำไมต้องหมุน: ภาพการ์ดหน้าต่างๆ ถูกเรนเดอร์เอียงราว 22–24 องศา
  ส่วนหลังการ์ด (backcard) เรนเดอร์ตรง ถ้าใช้ตามที่ได้มา เวลาพลิกการ์ด
  หน้ากับหลังจะไม่อยู่ในแนวเดียวกัน และตารางการ์ดจะดูเอียงไม่เป็นระเบียบ
  ค่ามุมด้านล่างได้จากการหามุมที่ทำให้กรอบสี่เหลี่ยมของภาพเล็กที่สุด (minimum-area bounding box)

  รันซ้ำได้:  node scripts/prepare-memory-art.mjs
*/
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'public/games/memorygame';
const OUT = 'public/games/memory';

/* การ์ดทุกใบถูกบีบลงผืนผ้าใบขนาดเดียวกัน หน้ากับหลังจึงซ้อนทับกันพอดีตอนพลิก
   1.08 คือสัดส่วนกว้าง:สูงของการ์ดหลังจากจัดให้ตรงแล้ว (ผลจากมุมกล้องแบบ isometric) */
const CARD_W = 384;
const CARD_H = 356;

const TILES = [
  // การ์ดหลัง
  { src: 'backcard.png', out: 'card-back', rotate: 0, card: true },
  // หน้าการ์ดทั้งแปด — rotate คือองศาที่ต้องหมุนให้ตรงแนวเดียวกับ backcard
  { src: 'crestmoon.png', out: 'face-crescent', rotate: -22, card: true },
  { src: 'starob.png', out: 'face-star', rotate: -20, card: true },
  { src: 'masjid.png', out: 'face-masjid', rotate: -24, card: true },
  { src: 'dome.png', out: 'face-arch', rotate: -22, card: true },
  { src: 'tasbeh.png', out: 'face-tasbih', rotate: -23.5, card: true },
  { src: 'gem.png', out: 'face-gem', rotate: -23.5, card: true },
  { src: 'tree.png', out: 'face-palm', rotate: -22.5, card: true },
  { src: 'light.png', out: 'face-lantern', rotate: -4, card: true },
  // กระดานเกาะ ไม่หมุน
  { src: 'islandMain.png', out: 'island', rotate: 0, width: 1100 },
  // หมายเหตุ: ต้นฉบับยังมีดาว จันทร์เสี้ยว และโคมไฟแบบเดี่ยว (ไม่ได้อยู่บนการ์ด)
  // ยังไม่ได้ใช้ในเกม จึงยังไม่แปลง เพื่อไม่ให้มีไฟล์ที่ไม่มีใครเรียกอยู่ใน public/
  // ถ้าจะใช้เป็นดาวรางวัลหรือของประดับลอย เพิ่มบรรทัดกลับเข้ามาได้เลย
];

await mkdir(OUT, { recursive: true });

/* รวม sha256 ของต้นฉบับเข้ากับ manifest เดิม ต้นฉบับ .png ไม่ได้อยู่ใน git (ใหญ่เกินไป)
   manifest จึงเป็นหลักฐานว่า .webp ที่ commit สร้างมาจากไฟล์ชุดไหน — ระบบเดียวกับ optimize-images.mjs */
const manifestPath = 'scripts/source-images.json';
let manifest = {};
try { manifest = JSON.parse(await readFile(manifestPath, 'utf8')); } catch { /* ยังไม่มีก็สร้างใหม่ */ }

let before = 0, after = 0;
for (const tile of TILES) {
  const src = path.join(SRC, tile.src);
  const bytes = await readFile(src);
  before += bytes.length;
  manifest[src.replaceAll('\\', '/')] = createHash('sha256').update(bytes).digest('hex');

  let pipeline = sharp(bytes);
  if (tile.rotate) {
    // พื้นหลังโปร่งใส ไม่ใช่ดำ ไม่งั้นจะได้ขอบดำรอบภาพหลังหมุน
    pipeline = sharp(await pipeline.rotate(tile.rotate, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer());
  }
  // ตัดขอบโปร่งใสออกก่อน ทุกใบจึงเริ่มจากขนาดเนื้อภาพจริง ไม่ใช่ขนาดผืนผ้าใบเดิม
  pipeline = sharp(await pipeline.trim({ threshold: 8 }).png().toBuffer());

  if (tile.card) {
    pipeline = pipeline
      .resize(CARD_W, CARD_H, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } });
  } else {
    pipeline = pipeline.resize(tile.width, null, { fit: 'inside', withoutEnlargement: true });
  }

  const out = path.join(OUT, `${tile.out}.webp`);
  const info = await pipeline.webp({ quality: 88, effort: 6 }).toFile(out);
  after += info.size;
  console.log(`  ${tile.out.padEnd(14)} ${String(tile.rotate).padStart(6)}°  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(1)}KB`);
}

await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log(`\nรวม ${(before / 1024 / 1024).toFixed(1)}MB -> ${(after / 1024).toFixed(0)}KB`);
console.log(`บันทึก sha256 ของต้นฉบับไว้ที่ ${manifestPath}`);
