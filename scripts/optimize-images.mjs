/*
  แปลงภาพต้นฉบับที่วาดมาให้เป็นไฟล์ WebP ที่พร้อมเสิร์ฟจริง

  ต้นฉบับเป็น PNG ใบละ 1-2MB ซึ่งใหญ่เกินจะเก็บลง git และไม่จำเป็น
  เพราะภาพแสดงจริงเล็กกว่านั้นมาก WebP ยังคมบนจอความละเอียดสูงแต่เล็กลงราวสิบเท่า

  ต้นฉบับ .png ถูก .gitignore ไว้ ไฟล์ที่ commit จริงคือ .webp
  รันซ้ำได้ทุกครั้งที่มีภาพใหม่:  node scripts/optimize-images.mjs
*/
import { createHash } from "node:crypto";
import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

/* เกาะแสดงกว้างสุดราว 230px จึงพอที่ 900px สำหรับจอ 3x
   ส่วนพื้นหลังกินเต็มความกว้างจอ จึงต้องใหญ่กว่า */
const JOBS = [
  { dir: "public/islands", width: 900, quality: 86 },
  { dir: "public/BG", width: 1920, quality: 80 },
];


/*
  ลบดวงตาและจมูกของแมวในภาพพื้นหลังออก ตามข้อกำหนดข้อ 1.1 ใน AGENTS.md
  เด็กสองคนในภาพหันหลังอยู่แล้วจึงผ่าน ส่วนแมวหันหน้าเข้าหาคนดู

  วิธี: วางแผ่นสีขนแมวทับตำแหน่งตาและจมูกแล้วเบลอขอบเล็กน้อยให้กลืนกับขนรอบข้าง
  ค่าสีมาจากการสุ่มอ่านพิกเซลรอบดวงตาในภาพต้นฉบับจริง
  พิกัดอ้างอิงกับภาพต้นฉบับขนาด 1672x941 ถ้าเปลี่ยนภาพพื้นหลังต้องหาพิกัดใหม่
*/
const CAT_FACE_PATCH = {
  /*
    ผูกกับ sha256 ของไฟล์ต้นฉบับ ไม่ใช่ชื่อไฟล์
    ถ้าเช็คด้วยชื่อ ไฟล์ที่ตั้งชื่อต่างไปแม้แต่ตัวพิมพ์เล็ก-ใหญ่จะหลุดการลบหน้าแมวไปเงียบๆ
    และภาพคนละใบที่บังเอิญขนาดเท่ากันก็จะโดนทาสีทับผิดตำแหน่ง
  */
  sha256: "661ac3751c360cdcce2080a4a2e9853a019a3d907a8ba4ef06db993fafde8764",
  sourceWidth: 1672,
  sourceHeight: 941,
  svg: `<svg xmlns='http://www.w3.org/2000/svg' width='1672' height='941'>
    <defs>
      <filter id='soft' x='-60%' y='-60%' width='220%' height='220%'>
        <feGaussianBlur stdDeviation='1.1'/>
      </filter>
      <linearGradient id='fur' x1='0' y1='0' x2='0.3' y2='1'>
        <stop offset='0%' stop-color='#fdfaf5'/>
        <stop offset='60%' stop-color='#f8ece8'/>
        <stop offset='100%' stop-color='#f0dcd4'/>
      </linearGradient>
    </defs>
    <g filter='url(#soft)'>
      <ellipse cx='539.5' cy='784.5' rx='5.2' ry='5.6' fill='url(#fur)'/>
      <ellipse cx='545.2' cy='787.4' rx='3.6' ry='3.0' fill='#fbeef0'/>
    </g>
  </svg>`,
};

/*
  บันทึก sha256 ของภาพต้นฉบับทุกใบลง manifest ที่ commit จริง
  ต้นฉบับ .png ไม่ได้อยู่ใน git เพราะใหญ่มาก คนที่ clone ไปทำต่อจึงต้องขอไฟล์จากเจ้าของ
  manifest นี้ทำให้ตรวจได้ว่าไฟล์ที่ได้มาเป็นชุดเดียวกับที่ใช้สร้าง .webp ที่อยู่ใน repo หรือไม่
*/
const manifest = {};

let before = 0;
let after = 0;

for (const job of JOBS) {
  let files;
  try {
    files = (await readdir(job.dir)).filter((f) => /\.png$/i.test(f));
  } catch {
    console.log(`ข้าม ${job.dir} (ไม่มีโฟลเดอร์)`);
    continue;
  }
  if (files.length === 0) continue;

  console.log(`\n${job.dir}`);
  for (const file of files.sort()) {
    const src = path.join(job.dir, file);
    const out = path.join(job.dir, file.replace(/\.png$/i, "").toLowerCase() + ".webp");

    const srcSize = (await stat(src)).size;

    const bytes = await readFile(src);
    const digest = createHash("sha256").update(bytes).digest("hex");
    manifest[src.replaceAll("\\", "/")] = digest;

    let pipeline = sharp(bytes);
    const isBackgroundDir = job.dir === "public/BG";
    const isPatchTarget = digest === CAT_FACE_PATCH.sha256;

    /*
      ทุกไฟล์ในโฟลเดอร์พื้นหลังต้องเป็นภาพที่ผ่านการลบหน้าแมวแล้วเท่านั้น
      ถ้ามีภาพพื้นหลังใบใหม่เข้ามา ต้องหยุดให้คนตรวจก่อน ไม่ใช่ปล่อยผ่านเงียบๆ
    */
    if (isBackgroundDir && !isPatchTarget) {
      throw new Error(
        `${src} ไม่ตรงกับภาพพื้นหลังที่ตรวจแล้ว (sha256 ${digest.slice(0, 12)}...)
` +
          `ถ้าเป็นภาพใหม่ ต้องตรวจว่ามีใบหน้ามนุษย์หรือสัตว์หรือไม่ หาพิกัดที่ต้องลบใหม่ แล้วอัปเดต CAT_FACE_PATCH ก่อน`,
      );
    }

    if (isPatchTarget) {
      const meta = await pipeline.metadata();
      if (
        meta.width !== CAT_FACE_PATCH.sourceWidth ||
        meta.height !== CAT_FACE_PATCH.sourceHeight
      ) {
        throw new Error(
          `${file} ขนาดเปลี่ยนเป็น ${meta.width}x${meta.height} — พิกัดที่ใช้ลบหน้าแมวไม่ตรงแล้ว`,
        );
      }
      pipeline = sharp(
        await sharp(bytes)
          .composite([{ input: Buffer.from(CAT_FACE_PATCH.svg), top: 0, left: 0 }])
          .png()
          .toBuffer(),
      );
      console.log("    (ลบตาและจมูกแมวออกแล้ว)");
    }

    await pipeline
      .resize(job.width, null, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: job.quality, effort: 6 })
      .toFile(out);
    const outSize = (await stat(out)).size;

    before += srcSize;
    after += outSize;
    console.log(
      `  ${file.padEnd(14)} ${(srcSize / 1024).toFixed(0).padStart(5)}KB -> ${(outSize / 1024).toFixed(0).padStart(4)}KB  ${path.basename(out)}`,
    );
  }
}

await writeFile(
  "scripts/source-images.json",
  JSON.stringify(manifest, null, 2) + "\n",
  "utf8",
);

console.log(
  `\nรวม ${(before / 1024 / 1024).toFixed(1)}MB -> ${(after / 1024 / 1024).toFixed(2)}MB (เหลือ ${((after / before) * 100).toFixed(0)}%)`,
);
console.log("บันทึก sha256 ของต้นฉบับไว้ที่ scripts/source-images.json");
