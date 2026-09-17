> **17 ก.ย. 2026 — เจ้าของโปรเจกต์เลือกเกาะรอบ 1** (เหมือนภาพตัวอย่างมากกว่า)
> `island.png` ตอนนี้คือ `output/sequence-art/originals/island-before-round2.png` ส่วนรอบ 2 เก็บที่ `originals/island-round2.png`
> `output/sequence-art/measurements.json` และ `scripts/measure-sequence-art.mjs` ยังเป็นของรอบ 2 (บังคับลานหน้ากว้าง จึงรันกับรอบ 1 ไม่ผ่าน)
> ค่าที่ใช้กับรอบ 1 บันทึกในคอมเมนต์ของ `src/features/games/data/sequenceArt.ts`

# Sequence — รอบ 2 (17 ก.ย. 2026)

แก้ด้วย built-in imagegen แบบ image edit เริ่มจาก public/games/sequence/island.png เดิม และแก้ต่อเนื่อง 4 ครั้งจนได้ลานกว้างตามบรีฟ ไม่ใช้ CLI/API fallback ภาพก่อนแก้เก็บใน originals/island-before-round2.png; ภาพที่เลือกคือ originals/island-round2.png

ขยายลานเทอร์ควอยซ์ด้านหน้า ย้ายน้ำตกไปริมขวา ลดหน้าผา และย่อศาลาพร้อมขยับของประดับไปขอบหลัง คงวัสดุ แสงจากซ้ายบน และมุมมองเฉียง ลานมีทรงกว้างขึ้นตามพื้นที่เกมที่ร้องขอ ไม่มีแท่นหรือบล็อกติดในภาพเกาะ ไม่มีคน สัตว์ ใบหน้า ข้อความ ตัวเลข ลูกศร โลโก้ ลายน้ำ หรือสัญลักษณ์ดนตรี

## ไฟล์และขนาด

| ไฟล์ | PNG ขนาด / bytes | WebP ขนาด / bytes |
|---|---|---|
| island | 1100×1100 / 1811174 | 1100×1100 / 163900 |
| pad | 512×512 / 225511 | 512×512 / 21320 |
| block | 512×512 / 393157 | 320×320 / 20302 |

เปลี่ยนเฉพาะ island.png และ island.webp; pad/block PNG และ WebP คงเดิม ใช้ค่าแปลง WebP เหมือน optimize-images.mjs (quality 88, effort 6) ผ่านสคริปต์ที่ทำเฉพาะ island เพื่อไม่เขียนทับ pad/block อัปเดต SHA-256 เฉพาะ island ใน scripts/source-images.json PNG/WebP มี alpha จริง

## ค่าที่วัด

- Island opaque bbox (x,y,width,height): 1.091, 1, 98, 95%
- Surface bbox: 3, 22.818, 93.909, 56.273%
- Pad base/top-front anchor: {"x":50,"y":66.406}%; top height 49.023%
- Block base: {"x":34.473,"y":94.336}%; top-front {"x":34.473,"y":25.195}%; top height 24.609%; stack step 69.141%

- clearCourtyard: x 12–88%, y 36–72%; 332289/332289 pixels (100.0000%) อยู่ใน mask
- waitingCourtyard: x 12–88%, y 55–72%; 157356/157356 pixels (100.0000%) อยู่ใน mask

| y % | ขอบซ้าย % | ขอบขวา % |
|---|---|---|
| 35 | 10.273 | 89.364 |
| 40 | 9.182 | 90.727 |
| 45 | 7.455 | 91.909 |
| 50 | 6.818 | 93.545 |
| 55 | 5.091 | 94.364 |
| 60 | 4.636 | 94.818 |
| 65 | 3.182 | 96.545 |
| 70 | 3.727 | 96.273 |
| 75 | 7.182 | 92.909 |

วิธีวัด: alpha ≥240, R 25–130, G≥178, B≥155, G/B .90–1.24, G−R≥65 แล้วเลือก largest 4-connected component ปรับ G/B ต่ำสุดจาก .96 เป็น .90 ตามพิกเซลลานใหม่ซึ่งอมฟ้ามากขึ้น ตรวจ mask เทียบภาพแล้ว แยก rowsEvery5Percent ครบ y35–75 และตรวจทุกพิกเซลในกรอบที่บรีฟกำหนด ไม่ได้ใช้ bbox เป็นหลักฐานแทนพื้นที่จริง ค่าจุดฐาน pad/block วัดด้วยวิธีเดิม

## ภาพตรวจและส่งต่อ

- preview-waiting-768.png: 4 แท่นและของรอเรียง 4 ชิ้น กล่อง sprite ครอบ x14–86% กว้างชิ้นละ14% (154px บน1100px) จุดฐานหน้าบล็อก y64% ทั้ง4ชิ้น
- preview-towers-768.png: 4 แท่นและหอคอย1–4ชั้น
- preview-sizes-768.png: 3 แท่นและบล็อก3ขนาด

มีทุกแบบที่1100px โปร่งใส และ768/390px พื้นอ่อน เป็น Sharp composite จาก WebP จริง ไม่ใช่ browser screenshot แท่นทุกตำแหน่งและพิกเซลทึบของบล็อก waiting อยู่บน mask 100% รายละเอียดใน preview-layouts.json ตรวจภาพทั้งสามแบบแล้ว

ไฟล์ measurements.json, surface-mask.png และ measurement-*.png เป็นหลักฐานการวัด รูปทรงจากสีเป็นค่าประมาณและอาจรวมขอบ bevel จึงควรเว้นขอบเมื่อใช้งานจริง

ไม่แก้ src/ ไม่ commit ไม่รัน build เพราะงานนี้เป็น asset และสคริปต์ประกอบภาพ ต้องให้ Claude เชื่อม layout และตรวจเบราว์เซอร์จริงต่อ ที่ความกว้างภาพ390px บล็อก14% เท่ากับ54.6px จึงยังไม่ยืนยัน tap target64px ของเกมจริง

## สร้างซ้ำรอบ 2

```powershell
node scripts/prepare-sequence-round2.mjs
node scripts/measure-sequence-art.mjs
node scripts/preview-sequence-art.mjs
```

อย่ารัน prepare-sequence-art.mjs ของรอบแรกเพื่อสร้างรอบนี้ เพราะอ้างภาพเก่า สคริปต์รอบ2ใช้ originals/island-round2.png ที่เก็บใน output/sequence-art และไม่แตะ pad/block

## Prompt จริงรอบ 2

### Edit 1

Use case: precise-object-edit. Edit target: supplied existing project island PNG. EDIT THIS ISLAND, preserve its premium colorful polished 3D materials, oblique front three-quarter camera looking down 35–40 degrees and upper-left lighting. Keep the same recognizable cream/gold blue-domed pavilion at rear left, but clear all decoration below y=36% inside x=12–88%. Required major geometry change: expand the flat turquoise top toward the viewer into a very wide deep open courtyard. The ENTIRE rectangle x=12–88%, y=36–72% of the full square image must be continuous unobstructed flat turquoise walking surface, especially the foreground rectangle x=12–88%, y=55–72%. Make island broad with nearly straight left/right sides across this area, front edge BELOW y=74%. This is functional game space, absolutely no plants, rocks, ornaments, stream or waterfall in that rectangle. Keep the same camera, do not make it top-down. Compress cream cliff and dangling blue crystals into bottom y=76–96% to make room for the much deeper top. Move water to a SMALL narrow waterfall on extreme RIGHT side x=94–98%, never crossing courtyard. Move foreground shrubs/rocks to extreme external edges or remove them; keep foliage only along rear and far outside edges. Pavilion remains recognizable rear-left, all of its stairs end above y=36%. Keep entire island inside square frame with small transparent margins. Output 1100x1100 if supported, genuine transparent alpha background. No platforms, gold pads, blocks or cubes baked into island. No humans, animals, faces, text, numerals, arrows, logos, watermarks or music symbols. Do not copy third-party assets.

### Edit 2

Use case: precise-object-edit. Edit this supplied island draft, retaining same island style, camera, turquoise material, lighting, pavilion design, transparent background and small far-right waterfall. Single correction: make the ENTIRE rectangle x12–88%, y36–72% pure empty flat turquoise courtyard. Currently pavilion stairs and bushes intrude at y36–43%, and front corners approach y72%. Move pavilion and ALL rear plants/rocks upward so their lowest pixels are ABOVE y34%, reducing pavilion slightly if necessary. Remove left and right side plants wherever they intrude inside x12–88%. Extend front turquoise corners so surface at y72% still spans x10–90%; make front edge approximately y78%. Keep cream cliffs and crystals below this, shorten their height if necessary. Preserve original oblique 35–40 degree front camera, no top-down view. No objects at all on central courtyard. No pads or cubes. Full island visible, square 1100x1100 target, genuine transparent alpha. No humans, animals, faces, text, numerals, arrows, logos, watermarks or music symbols. Do not copy third-party assets.

### Edit 3

Use case: precise-object-edit. Edit supplied existing island. Preserve exact premium 3D render style, 3/4 front camera, upper-left light, turquoise textured flat surface, same pavilion, cream cliff, gold trim and cyan crystals, transparent alpha. Correct the usable ground geometry: make island top a WIDE ROUNDED RECTANGULAR tabletop in perspective, NOT an oval. Front left and front right corners project toward viewer, making broad nearly horizontal front edge across image x10% to90% at y80%. Side edges stay outside x10% and90% between y36% and76%. This creates a continuous empty turquoise rectangle covering x12–88% and y36–72% with margin. NO ornaments inside this rectangle. Reduce and move pavilion with bushes to upper-left area above y30%; put ALL rear foliage and stones above y32%, even those at back right. Keep small waterfall outside x94%, on far right edge only. Cream cliff and crystals underneath can be short in bottom 15%. Keep whole island inside image. No gold pads or toy blocks. Do not change perspective to overhead. Actual transparent background, square canvas, target1100x1100. No humans, animals, faces, text, numerals, arrows, logos, watermarks or music symbols. No third-party artwork.

### Edit 4

Precise object edit of this image. Keep same beautiful 3D floating island, same camera and lighting and transparent alpha. Enlarge the EMPTY TURQUOISE FLOOR dramatically vertically. The floor needs to fill MOST of image height, from one third down all the way to FOUR FIFTHS down. Move the entire back border of plants, stones and little pavilion UP by about 15% image height; pavilion crescent near top edge. Move the FRONT EDGE DOWN by about 13% image height; shorten cliff and crystals beneath so still in frame. The giant flat empty turquoise floor must occupy the full central rectangle (12%,36%) to (88%,72%) without anything on it. Its broad straight front edge should be at 80% image height, NOT 68%. Rear bushes must END above 34% image height, NOT 42%. Keep floor left and right edges outside 10% and90%. Keep tiny waterfall only on far right outside 94%. Preserve all materials and art direction. No pads, no cubes, no humans, animals, faces, text, numerals, arrows, logos, watermarks or music symbols, no third-party art. Genuine transparent background, square composition 1100x1100 target.


## Prompt จริงทั้งหมด

### island

Use case: precise-object-edit. Input image is the user's own sequence game island reference; preserve its premium colorful polished 3D style and exact oblique front camera looking down 35–40 degrees, upper-left lighting. Create one isolated floating island, square composition, genuine transparent alpha background. Preserve cream rock sides, turquoise top, blue crystal pendants underneath, small blue-domed cream-and-gold pavilion at rear left and waterfall at front right. REMOVE ALL three cubes AND ALL gold stepping platforms. Replace their occupied area with continuous flat broad empty turquoise courtyard. Keep foliage and decorative stones only at extreme outer edges, leaving a wide unobstructed diagonal from front left to rear right for four separate platforms, plus a broad empty foreground strip for four waiting objects. Enlarge usable flat courtyard if needed while retaining same camera, style and silhouette. Entire island visible with small transparent margins. No humans, animals, faces, text, numerals, arrows, logos, watermarks or music symbols. Do not copy third-party assets. No gold pads or cubes anywhere.

### pad

Use case: stylized-concept. Input image: user's own sequence island, reference for exact gold stepping-stone shape, perspective, material and lighting. Generate ONE isolated golden platform only, no island, no cube. A thick rounded-square gold stepping stone like one of the separate pads under cubes in the reference, broad smooth light-gold top with uniform softly rounded rim and darker golden short solid side wall. Oblique front 3/4 camera looking down 35–40 degrees, matching the island ground plane. Top reads as a broad foreshortened rounded square, not a circular coin. Upper-left soft light, polished premium colorful 3D children's toy game material, subtle contact shading contained on object. Entire object visible, tightly framed with a tiny margin on square canvas; genuine transparent alpha background, no floor or ground shadow. No humans, animals, faces, text, numerals, arrows, logos, watermarks or music symbols. Do not copy third-party assets.

### block

Use case: stylized-concept. Input image: user's own sequence game island reference for toy cube material, proportions, gold inset and camera. Generate ONE isolated bright royal-blue toy cube, not an island or platform. Chunky rounded corners, premium glossy blue plastic, large blank white/very pale blue inset panel with thick rounded gold frame on its front. Camera matching reference island: oblique front view looking down 35–40 degrees, front panel prominent, top visible, a little right side visible. Keep vertical edges vertical (orthographic). The bottom must be flat and horizontal with only small rounded corners so identical copies stack neatly as a vertical tower; top is a flat planar blue surface with rounded perimeter, not domed. Upper-left lighting, saturated premium 3D children's educational game. Single cube centered and tightly fitted in square canvas with very small transparent margin. Genuine transparent alpha background; no platform, floor or external cast shadow. No humans, animals, faces, text, numerals, arrows, logos, watermarks or music symbols. Do not copy third-party assets.

## ผลตรวจรอบ 2

- ตรวจภาพ waiting / towers / sizes และภาพ mask แล้ว; requiredRegions ทั้งสองกรอบและ sprite coverage ผ่าน 100%
- node --check ผ่านสคริปต์ prepare-sequence-round2, measure-sequence-art และ preview-sequence-art; git diff --check ผ่าน
- SHA-256 ของ pad.png, pad.webp, block.png, block.webp เหมือนก่อนเริ่มทุกไฟล์
- Codex ไม่ได้เขียนไฟล์ใน src/ แต่ snapshot พบ src/features/games/sequence.css เปลี่ยนจากภายนอกระหว่างทำงาน จึงไม่อ้างว่าทั้งโฟลเดอร์เหมือนเดิม และไม่ได้ย้อนคืนการแก้นั้น รายละเอียดใน protected-verification-round2.json
- ไม่มี commit; งานภาพรอบ 2 ครบตามบรีฟ ส่วนการต่อพิกัดและ browser/mobile QA เป็นงานส่งต่อ Claude
