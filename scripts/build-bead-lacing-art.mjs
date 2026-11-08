/*
  สร้าง src/features/games/data/beadLacingArt.ts จากพิกัดที่วัดจากภาพจริง (IMG-5: output/img-5/island-tilt.json — มุมเอียงแบบภาพหน้าเกม)
  ใช้: node scripts/build-bead-lacing-art.mjs <path ของ island-wide.json>
  เชือกวาดด้วยโค้ด (Catmull-Rom ผ่านจุด cord) ลูกปัดให้เลือกวางที่ traySlots (ถาดวาดติดภาพเกาะ)
*/
import { readFileSync, writeFileSync } from 'node:fs';
const j = JSON.parse(readFileSync(process.argv[2] ?? 'output/img-5/island-tilt.json', 'utf8'));
const W = j.width, H = j.height, R = H / W, r = n => Math.round(n * 1000) / 1000;
/* เชือกพาดกลางผิวโต๊ะ (เจ้าของโปรเจกต์ 8 พ.ย. 2026: "เชือกอยู่ขอบโต๊ะมากไป") — คำนวณจากมุมผิวโต๊ะ benchTop แบบ bilinear
   u = ตามความยาวโต๊ะ (ซ้าย→ขวา), v = จากขอบหลัง (0) ถึงขอบหน้า (1) · v=0.45 เพราะลูกปัดสูงกว่าเชือก ตัวลูกปัดจึงดูอยู่กลางโต๊ะพอดี */
const [BL, BR, FR, FL] = j.benchTop, V = 0.45;
const onBench = u => { const b = { x: BL.x + (BR.x - BL.x) * u, y: BL.y + (BR.y - BL.y) * u }, f = { x: FL.x + (FR.x - FL.x) * u, y: FL.y + (FR.y - FL.y) * u }; return { x: b.x + (f.x - b.x) * V, y: b.y + (f.y - b.y) * V }; };
const s0 = j.cord[0].scale ?? 1, s1 = j.cord[j.cord.length - 1].scale ?? 1;
const pts = Array.from({ length: 10 }, (_, k) => { const u = 0.17 + 0.71 * k / 9, q = onBench(u); return { x: r(q.x), y: r(q.y), scale: r(s0 + (s1 - s0) * k / 9) }; });
const tipAt = onBench(0.93);
/* ขอบหน้าถาด (วัดจากภาพ: เส้นพื้นถาดด้านหน้า -> แนวหญ้าใต้ผนังถาด) วาดทับลูกปัดในถาด ฐานลูกปัดจึงจมในถาดเหมือนจริง */
const trayFront = [[29,60.6],[32.15,59.6],[76.3,52.6],[79.5,53],[80.5,57.8],[78.5,59.5],[75,59.9],[68,61.1],[62,62],[56,63.1],[50,64.1],[44,65.3],[38,66.2],[34,67.6],[32,67.5],[30.5,66.7],[29,64.7]];
const px = pts.map(p => [p.x * W / 100, p.y * H / 100]);
let d = `M${px[0][0].toFixed(1)} ${px[0][1].toFixed(1)}`;
for (let i = 0; i < px.length - 1; i++) {
  const p0 = px[Math.max(i - 1, 0)], p1 = px[i], p2 = px[i + 1], p3 = px[Math.min(i + 2, px.length - 1)];
  const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
  d += ` C${c1.map(v => v.toFixed(1)).join(' ')} ${c2.map(v => v.toFixed(1)).join(' ')} ${p2.map(v => v.toFixed(1)).join(' ')}`;
}
const cordLength = r(pts.slice(1).reduce((s, p, i) => s + Math.hypot(p.x - pts[i].x, (p.y - pts[i].y) * R), 0));
const art = {
  src: '/games/bead-lacing/island-tilt.webp', width: W, height: H,
  points: pts, tip: { x: r(tipAt.x), y: r(tipAt.y) }, cordPath: d, trayFront,
  cordPx: Math.round(W * 0.0125), cordLength, beadMax: 8.5,
  traySlots: j.traySlots.map(p => ({ x: r(p.x), y: r(p.y), scale: r(p.scale ?? 1) })), traySlotWidth: r((j.traySlotSpacingPct ?? j.trayInnerWidthPct / j.traySlots.length) * 0.95), // ลูกปัดเต็มถาดเท่ากันทุกจอ (เจ้าของโปรเจกต์: บน PC ดูห่างเกินไป)
};
writeFileSync('src/features/games/data/beadLacingArt.ts',
  `// สร้างโดย scripts/build-bead-lacing-art.mjs จากพิกัดที่วัดจากภาพ public/games/bead-lacing/island-tilt.webp (IMG-5 มุมเอียงแบบภาพหน้าเกม, 8 พ.ย. 2026)\n` +
  `// หน่วย % ของภาพ ยกเว้น cordPath/cordPx เป็น px ของภาพ · cordLength = ความยาวเชือกในหน่วย % ความกว้างภาพ\n` +
  `export const LACING_ART = ${JSON.stringify(art)} as const;\n`);
console.log(art.cordLength, art.traySlotWidth);
