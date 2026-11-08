import sharp from 'sharp';
import {readFile,writeFile,stat} from 'node:fs/promises';
const dir='output/logo-1';
const m=JSON.parse(await readFile(`${dir}/shots-fix1/measurements.json`,'utf8'));
const luminance=rgb=>rgb.map(x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4;}).reduce((s,x,i)=>s+x*[.2126,.7152,.0722][i],0);
const ratio=(a,b)=>{a=luminance(a);b=luminance(b);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);};
const colors=[{phrase:'อุมมะฮ์ตัวน้อยในวันนี้',hex:'#1760ab',rgb:[23,96,171]},{phrase:'คือ',hex:'#946000',rgb:[148,96,0]},{phrase:'ผู้ใหญ่ในวันหน้า',hex:'#087568',rgb:[8,117,104]}];
const contrast=[];
for(const row of m.filter(x=>x.route==='/')) {
 const stem=`${row.width}x${row.height}`;
 const a=await sharp(`${dir}/shots-fix1/${stem}.png`).removeAlpha().raw().toBuffer({resolveWithObject:true});
 const b=await sharp(`${dir}/shots-fix1/${stem}-backing.png`).removeAlpha().raw().toBuffer();
 for(const color of colors) {
  let count=0,min=Infinity;
  for(let y=Math.max(0,Math.floor(row.tagline.y));y<Math.min(a.info.height,Math.ceil(row.tagline.bottom));y++)for(let x=Math.floor(row.tagline.x);x<Math.ceil(row.tagline.right);x++) {
   const i=(y*a.info.width+x)*3;
   if(color.rgb.every((c,j)=>Math.abs(a.data[i+j]-c)<=2)) {
    const bg=[...b.subarray(i,i+3)];
    // Exclude unchanged background pixels which happen to share a foreground color.
    if(bg.every((c,j)=>Math.abs(c-a.data[i+j])<=2))continue;
    count++;min=Math.min(min,ratio(color.rgb,bg));
   }
  }
  if(!count||min<4.5)throw Error(`${stem} ${color.hex}: contrast ${min}, samples ${count}`);
  contrast.push({viewport:stem,hex:color.hex,count,minimum:min});
 }
}
await writeFile(`${dir}/contrast-fix1.json`,JSON.stringify({colors:colors.map(c=>({...c,whiteRatio:ratio(c.rgb,[255,255,255])})),screenshots:contrast},null,2));
const alpha=JSON.parse(await readFile(`${dir}/options-fix1/alpha-scan.json`,'utf8'));
const fileSize=(await stat('public/brand/logo-book.webp')).size;
let report=`# LOGO-1 fix 1 — แบบ B หนังสือเปิด\n\nเลือกตราหนังสือ option 2: หน้ากระดาษโค้งชัดเจน จันทร์อยู่ด้านซ้าย ดาวอยู่ด้านขวา เข้ากับริบบิ้นและเตี้ยกว่าแบบเดิม ไม่มีอาคาร ตัวอักษร คน หรือสัตว์ในตราภาพใหม่\n\nใช้แบบ B ใหม่ทุกหน้า ไม่มี variant/switch เหลือใน runtime; ลบ LogoOption, logo-options.css, BrandMarkIcon และภาพ logo-a/b/c ใน public/brand พร้อม manifest เก่า เหลือ logo-book.png (ต้นฉบับ pipeline) และ logo-book.webp (${fileSize.toLocaleString()} bytes) เท่านั้น หลักฐานงานเดิมใน output/logo-1/compare และ options เก็บเป็นประวัติสำหรับภาพเทียบ ไม่ถูกโหลดโดยเว็บไซต์\n\n## ขนาดจริงรวมคำโปรย (CSS px)\n\n|จอ|B เดิม|B ใหม่|เตี้ยลง|ขนาดฟอนต์คำโปรย|\n|---|---|---|---|---|\n`;
for(const x of m.filter(x=>x.route==='/'))report+=`|${x.width}×${x.height}|${x.logo.width.toFixed(1)}×${x.oldHeight.toFixed(2)}|${x.logo.width.toFixed(1)}×${x.logo.height.toFixed(2)}|${(x.oldHeight-x.logo.height).toFixed(2)}px|${x.fontSize.toFixed(2)}px|\n`;
report+=`\nคำโปรยเป็น SVG text จริง ใช้ Noto Sans Thai Looped น้ำหนัก 900 (น้ำหนักสูงสุดที่ next/font รองรับ) หนึ่งบรรทัด ไม่ตัดกลางวลี; ขอบขาว 5 SVG units + เงานูนเลื่อนลง 2 units แบบ paint-order stroke fill ไม่มี blur/filter ในโลโก้และลิงก์ครอบ ชื่ออังกฤษยังเป็น Baloo 2 ตัวจริง มี sr-only ชื่อและคำโปรย ลิงก์กลับหน้าแรกคง accessible label เดิม\n\n## Contrast ของคำโปรย\n\n|วลี|สี|เทียบขาว|ต่ำสุดจากภาพจริงทุกจอ|\n|---|---|---|---|\n`;
for(const c of colors)report+=`|${c.phrase}|${c.hex}|${ratio(c.rgb,[255,255,255]).toFixed(2)}:1|${Math.min(...contrast.filter(x=>x.hex===c.hex).map(x=>x.minimum)).toFixed(2)}:1|\n`;
report+=`\nวิธีวัด: WCAG sRGB luminance เทียบสี fill กับขอบขาว #fff ตรวจซ้ำจาก screenshot ปกติและภาพ backing ที่ซ่อนเฉพาะชั้นสี คงชั้นขอบขาว/เงา/ฉากไว้ เลือกพิกเซลแกนตัวอักษรใกล้สีจริงไม่เกิน 2/255 ไม่ใช้พิกเซล anti-alias เป็นสีตัวอักษร รายละเอียดทุกจอพร้อมจำนวน samples: contrast-fix1.json เงาน้ำเงิน #174677 เป็นชั้นตกแต่งใต้ขอบขาว ไม่ใช่สีข้อความหลัก\n\n## ภาพและ alpha\n\nสร้าง 2 ตัวเลือกด้วย built-in image_gen; prompts เต็มอยู่ options-fix1/prompts.json ภาพต้นฉบับ PNG, ภาพ defringe PNG/WebP, ภาพทดลองประกอบริบบิ้นทุกขนาด และภาพตรวจขอบบนพื้นน้ำเงิน/เทอร์ควอยซ์อยู่ options-fix1/ เลือก option 2 เพราะหน้าหนังสือเด่นกว่าและความสูงกะทัดรัดกว่า option 1\n\nเตรียมด้วย scripts/prepare-logo-art.mjs: ตัด alpha ต่ำกว่า 180, remap 180–249, ตั้ง >=250 เป็น opaque ป้องกันพื้นหลังทะลุเนื้อภาพ; trim และเติมขอบโปร่งใส 8px จากนั้นผ่าน scripts/optimize-images.mjs public/brand และบันทึก SHA256 ใน scripts/source-images.json\n\n|ตัวเลือก|WebP|โปร่งใส|ขอบกึ่งโปร่งใส|opaque|พิกเซลไม่โปร่งใสที่กรอบภาพ|\n|---|---|---|---|---|---|\n`;
for(const a of alpha)report+=`|${a.option}|${a.width}×${a.height}|${a.transparent}|${a.partial}|${a.opaque}|${a.borderNonzero}|\n`;
report+=`\nตรวจภาพจริง edges-1/2.png บนพื้นเข้มและเทอร์ควอยซ์แล้ว ไม่เห็นกรอบพื้นติดหรือ halo ฟุ้ง เหลือ highlight สีครีม/ขาวที่ขอบกระดาษตามวัตถุ (ตัวตรวจ whiteFringe เป็น heuristic นับขอบสว่าง ไม่ใช่ข้อสรุปว่ามี matte) ไม่มี text, Arabic, building, dome, minaret, human หรือ animal ในภาพทั้งสอง\n\n## Browser / validation\n\n- ${m.length} กรณี: /, /kids, /games, /parents, /learn/moral และ /en × 4 จอ\n- overflow: ${m.filter(x=>x.overflow).length}; โลโก้ทับปุ่ม: ${m.filter(x=>x.overlap).length}; nested focusable: ${m.filter(x=>x.focusable).length}\n- Focus ring 4px #12356b offset 3px เห็นชัดทุกจอ; ไม่มี motion วน; ไม่เปลี่ยนปุ่มเดิม\n- ภาพครบใน shots-fix1/ รวม *-focus.png และ comparison-*.png (B เดิม | B ใหม่)\n- ขนาด/สี/ฟอนต์/ตำแหน่ง DOM: shots-fix1/measurements.json\n- npm run verify: PASS, exit 0 — typecheck, ESLint, tests 139/139, production build (verify-fix1.log)\n- ตรวจ diff ของงานรอบนี้แล้ว ไม่แก้พฤติกรรมเกมหรือเนื้อหาศาสนา ไม่ commit/reset/unstage\n\n## ไฟล์งาน\n\nsrc/components/ui/Logo.tsx, logo.css; src/app/fonts.ts (เพิ่ม 900), globals.css (ลบ CSS โลโก้เดิมที่ไม่ใช้); ลบ src/components/icons/BrandMarkIcon.tsx และไฟล์ variant; public/brand/logo-book.png, logo-book.webp; scripts/source-images.json, prepare-logo-art.mjs, check-logo-browser.mjs, report-logo.mjs\n\nเครื่องมือสร้างภาพ: built-in image_gen (ไม่ใช้ CLI fallback); คำสั่งรันซ้ำ: node scripts/prepare-logo-art.mjs → node scripts/optimize-images.mjs public/brand → node scripts/check-logo-browser.mjs → node scripts/report-logo.mjs\n`;
await writeFile(`${dir}/report-fix1.md`,report);
console.log(colors.map(c=>({hex:c.hex,contrast:ratio(c.rgb,[255,255,255])})), 'Browser cases:',m.length);
