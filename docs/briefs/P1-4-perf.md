# P1-4: วัดความเร็วมือถือ (LCP) แล้วเสนอวิธีแก้เรียงตามผล
**model `gpt-6-astra` (medium) · timeout 5400 · worktree `D:/Littleummah-faith` (build แล้ว = main) · port 3170**

อ่านก่อน: `AGENTS.md` ข้อ 1.5, 2, 3 และ `docs/meetings/2026-11-10-fable-hub-review.md` §4.1
รายงานเป็นภาษาไทย · **งานนี้วัดและเสนอเท่านั้น ห้ามแก้ไฟล์ใน `src/`, `public/`, `scripts/`, config** · ห้าม commit

## วัด
- เปิด production build ที่มีอยู่: `npx next start -p 3170` (ถ้า `.next` ไม่มี ให้ `npm run build` ก่อน) ห้ามหยุด server port 3200 หรือ 3000
- Lighthouse มือถือ (throttling มาตรฐาน Slow 4G / Moto G Power ที่ Lighthouse ใช้) ด้วย `npx lighthouse` + Chrome `C:/Program Files/Google/Chrome/Application/chrome.exe` วัดหน้าละ 3 รอบ ใช้ค่ากลาง:
  `/`, `/learn`, `/learn/stories`, `/learn/stories/water-dog`, `/learn/explore`, `/learn/faith-basics`, `/games`, `/learn/games/memory`, `/parents`
- ต่อหน้าบันทึก: LCP, FCP, TBT, CLS, Speed Index, น้ำหนักรวมที่โหลด, LCP element คืออะไร (ภาพไหน ขนาดไฟล์/ขนาดแสดงจริง), JS ที่โหลด (KB), ฟอนต์ที่โหลด
- เป้า: LCP ≤ 2.5s, CLS ≤ 0.1, TBT ≤ 200ms

## วิเคราะห์
- หาสาเหตุหลักของหน้าที่ไม่ผ่าน: ภาพ LCP ใหญ่เกิน/ไม่ได้ `priority`/`sizes` ผิด, ภาพนอกจอโหลดก่อน, JS ก้อนใหญ่ของเกม/IslandOrbit, ฟอนต์ preload เกินจำเป็น (Baloo 2, Noto Sans Thai Looped, Noto Naskh Arabic), เสียงที่ preload
- ตรวจ `next/image` ที่ใช้จริง (`sizes`, `priority`, `quality`) ของภาพ LCP แต่ละหน้า
- ข้อเสนอแต่ละข้อ: ไฟล์/บรรทัดที่ต้องแก้, ผลที่คาด (วินาที LCP หรือ KB), ความเสี่ยง, ขนาดงาน S/M/L
- **ห้ามเสนอเปลี่ยนภาพที่อนุมัติแล้ว** (ดีไซน์/ตัวละคร/ฉาก) — เสนอได้แค่ขนาดไฟล์ ความละเอียดที่ส่ง คุณภาพการบีบอัด และลำดับการโหลด
- ห้ามเสนอเพิ่ม analytics/ระบบติดตามใดๆ (เว็บเด็ก ไม่มีระบบติดตาม)

## ส่งงาน
- `output/p1-4/report.md` (ไทย): ตารางผลต่อหน้า, สาเหตุ, ข้อเสนอเรียงตาม ผลที่ได้ ÷ แรงที่ใช้
- `output/p1-4/lighthouse/*.json` (+ html ถ้าเล็ก)
- ปิด server port 3170 ที่เปิดเองก่อนจบ (ตรวจด้วย `netstat -ano | findstr :3170`)
