# P0-2 — คำสั่งตรวจเดียว `npm run verify` + ไฟล์ CI (ยังไม่ push)

อ่าน `AGENTS.md` ทั้งไฟล์ก่อน (โดยเฉพาะข้อ 3 และ 5) คุณทำงานใน worktree `D:/Littleummah-ci` (branch `codex/p0-2-ci` แตกจาก main)
`node_modules` ติดตั้งไว้แล้ว ถ้าขาดอะไรให้รายงาน อย่าเปลี่ยน dependency

## ขอบเขต
- ทำ:
  1. เพิ่ม script ใน `package.json`: `"verify": "npm run typecheck && npm run lint && npm test && npm run build"`
     (ใช้ script เดิมที่มีอยู่ ไม่ต้องเขียนใหม่)
  2. สร้าง `.github/workflows/ci.yml` — GitHub Actions รัน `npm ci` แล้ว `npm run verify`
     - trigger: `push` ทุก branch และ `pull_request` · runner `ubuntu-latest` · Node เวอร์ชันตาม `engines`/`.nvmrc` ถ้ามี ถ้าไม่มีใช้ 22
     - `actions/setup-node` แบบ cache npm · `concurrency` ยกเลิกรอบเก่าของ branch เดียวกัน · `timeout-minutes: 20`
     - ไม่มี secret ไม่มี deploy ไม่มีขั้นที่เขียนกลับ repo · permissions `contents: read`
  3. รัน `npm run verify` จริงในเครื่อง
- ไม่ทำ: แก้โค้ดเว็บ, แก้ test, แก้ config lint/ts เพื่อให้ผ่าน, ซ่อมสคริปต์ตรวจเบราว์เซอร์ (`scripts/check-*.mjs` เป็นงาน P0-3)

## ถ้า verify ไม่ผ่านบน main
**ห้ามแก้ให้ผ่านเอง** ให้รายงานว่าขั้นไหนพัง ไฟล์:บรรทัด และสาเหตุที่คิดว่าเป็น
ยกเว้นปัญหาที่เกิดจากสภาพแวดล้อม CI เท่านั้น (เช่น build บน Linux ต้องการตัวแปรอะไร) ให้แก้ใน `ci.yml`
ข้อควรระวังที่ต้องเช็ก: build บน Linux แยกตัวพิมพ์เล็ก/ใหญ่ของชื่อไฟล์ — import ที่ตัวพิมพ์ไม่ตรงกับชื่อไฟล์จริงจะผ่านบน Windows แต่พังบน CI
ให้สแกนหา import แบบนี้ (เทียบ path ใน import กับชื่อไฟล์จริง) แล้วรายงาน ห้ามแก้

## ไฟล์ที่แก้ได้
- `package.json` (เฉพาะ `scripts`) · `.github/workflows/ci.yml` (ใหม่)

## ห้าม
- commit / push / reset / ลบไฟล์ · แตะ worktree อื่น · เพิ่ม dependency

## ส่ง (ข้อความตอบสุดท้าย)
```
## P0-2 รายงาน
- สถานะ: เสร็จ / เสร็จบางส่วน / ติด
- ไฟล์ที่แก้: …
- ผล npm run verify: typecheck ✅/❌ · lint · test (ผ่าน x/y) · build — ถ้า ❌ แปะ error 20 บรรทัดสุดท้าย
- import ตัวพิมพ์ไม่ตรง: (รายการ หรือ "ไม่พบ")
- จุดที่ Claude ควรดู: (ไม่เกิน 5)
- คำถาม: …
```

## เวลา
40 นาที
