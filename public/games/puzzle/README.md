# Puzzle art — 27 กันยายน 2026

ใช้ built-in image_gen ตามสกิล imagegen สร้างภาพและแก้ภาพจริง ตรวจด้วยการเปิดดูภาพทุกผลลัพธ์ที่สำเร็จ รวมภาพวัดและ composite ทั้งสามด่านที่ 1100px และ 390px

## ภาพที่เลือก

ใช้ **เกาะรอบ 2 ถาดใหญ่** ตามคำสั่งล่าสุดของเจ้าของโปรเจกต์/Claude ไม่ย่อถาด ตัวเลข 60–70% เป็นขั้นต่ำ ไม่ใช่เพดาน ต้นฉบับจากเครื่องมืออยู่ที่ `output/puzzle-art/originals/island-round2.png`; สำเนา PNG ขนาดใช้งาน 1100px ที่เลือกอยู่ที่ `island-round2-chosen.png` ในโฟลเดอร์เดียวกัน และตรงกับ `public/games/puzzle/island.png`

รอบ 1 ไม่เลือก: ยอดชิดขอบภาพ โดมหลักยังขาว และพื้นถาดมีลายจาง รอบ 2 แก้โดมเป็นทอง พื้นถาดเรียบและเกาะอยู่ครบ มี transparent margin จริง ไม่มีคน สัตว์ ใบหน้า ตัวอักษร หรือชิ้นจิ๊กซอว์ติดภาพ เก็บต้นฉบับทุกภาพที่สร้างสำเร็จครบ 4 ภาพใน originals

มีคำขอแก้รอบ 3 ให้ย่อถาด แต่ tool call ถูกยกเลิกเมื่อได้รับคำสั่งล่าสุด **ไม่มีภาพรอบ 3 ที่สร้างสำเร็จหรือถูกนำมาใช้** บันทึก prompt ที่ส่งไว้ด้านล่างเพื่อให้ประวัติครบ

## ไฟล์

| ไฟล์ | PNG ขนาด / bytes | WebP ขนาด / bytes |
|---|---|---|
| island | 1100×1100 / 1,766,681 | 1100×1100 / 217,682 |
| picture-1 | 1024×1024 / 2,384,253 | 900×900 / 132,780 |
| picture-2 | 1024×1024 / 2,932,739 | 900×900 / 266,210 |

WebP quality 88, effort 6; island คง alpha จริง; picture เป็นภาพเต็มกรอบทึบ ไม่มีกรอบหรือตารางฝังในภาพ
SHA-256 ของ PNG ใหม่ทั้งสามอยู่ใน `scripts/source-images.json`; ขนาดและ hash ของทั้ง PNG/WebP อยู่ใน `output/puzzle-art/assets.json`
ไม่เปลี่ยน courtyard.png / courtyard.webp เดิมของด่าน 3; ตรวจ hash ก่อน/หลังตรงกันใน protected-verification.json

## ค่าที่วัดจากพิกเซล

หน่วยตำแหน่งเป็น % ของ canvas 1100×1100, x ไปขวา y ลงล่าง ชื่อมุมตามตำแหน่งบนจอ: left/top/right/bottom

| มุม | พื้นถาดด้านใน x, y | ขอบนอกกรอบทอง x, y |
|---|---|---|
| left | 19.35354, 42.84529 | 14.84993, 41.11041 |
| top | 49.30532, 26.93747 | 49.17366, 22.93894 |
| right | 83.76722, 43.36309 | 89.03241, 41.52909 |
| bottom | 54.36887, 64.15488 | 55.02765, 65.86559 |

- island bbox (alpha ≥240): x 3.45455%, y 2.63636%, width 93.36364%, height 95.72727%
- พิกเซล alpha=0: 543,176 พิกเซล เกาะไม่ชนกรอบภาพ
- พื้นเล่นกว้างประมาณ 68.99% ของ bbox เกาะ; quad ขอบนอกกว้าง 79.46% ตามขนาดที่เลือก
- ความหนากรอบที่ฉายบนจอ ตามขอบ left→top, top→right, right→bottom, bottom→left: 39.81 / 41.11 / 18.26 / 10.88px เฉลี่ย 27.51px
- ด้านหลังรวมผนังด้านในที่มองเห็น จึงหนากว่าด้านหน้า ตัวเลขเป็นระยะบนภาพ ไม่ใช่ความหนาจริงในโลก 3D
- วิธี: cream RGB mask → largest 4-connected component (145,115px) → extreme x/y → trimmed least-squares ของขอบสี่ด้าน → intersection; ขอบนอกวัดจาก gold mask ตาม normal ของแต่ละขอบแล้ว fit แยก
- floor edge RMSE 0.29–1.20px; rim edge RMSE 0.44–0.94px เกณฑ์สีและข้อมูล fit ครบใน measurements.json
- มุมเป็นจุดตัดแนวตรงที่ extrapolate ผ่านมุมมน จึงต้อง clip มุมมนด้วย floor mask; ไม่ควรใช้ quad เปล่าแล้วทับกรอบทอง

ตรวจ `output/puzzle-art/measurement-tray.png` ด้วยตาแล้ว: ชมพูคือพื้นถาด ฟ้าคือขอบนอก เส้นตรงตามขอบจริงทั้งสี่ด้าน มุมเส้นตรงยื่นนอกมุมมนเล็กน้อยโดยตั้งใจ มี `tray-floor-mask.png` สำหรับ clipping

## การประกอบและทิศภาพ

**image TL → tray left, TR → top, BR → right, BL → bottom** ดังนั้นด้านบนของภาพตรงขอบถาดด้านหลังซ้ายจาก left ไป top ตามบรีฟ

`scripts/preview-puzzle-art.mjs` คำนวณ homography 8 coefficients จากมุมวัดจริง ใช้ inverse mapping + bilinear sampling และ clip ด้วย floor mask
ใช้ WebP ที่เสิร์ฟจริง; ไม่แก้ภาพต้นฉบับเพื่อทำ preview
ความคลาดเคลื่อนการ map มุมเชิงตัวเลข < 0.000001px (ไม่ใช่ความแม่นยำของการตรวจขอบภาพ)

- preview-level1.png: ภาพครบ 100%, ตาราง 2×2
- preview-level2.png: สามช่อง 100% สลับสามช่อง 35%, ตาราง 3×2
- preview-level3.png: courtyard เดิมจางทั้งหมด 35%, ตาราง 3×3
- มี preview-level1-390.png ถึง preview-level3-390.png เพิ่มสำหรับดูขนาดเล็ก

ทั้งหมดเป็น **composite ไม่ใช่ screenshot** ไม่มีการอ้างผล DOM หรือผลการแตะจริง
ตรวจแล้วภาพไม่บังกรอบทอง ไม่ล้นถาด และทิศภาพถูกต้อง ด่าน 1 แยกจันทร์/ดาว/ต้นอินทผลัม/อาคารได้ชัด
ด่าน 2 มีต้นอินทผลัม/ซุ้ม/โคม/แปลงต้นไม้/น้ำพุ/แจกันครบหกช่อง

## ข้อสังเกตส่งต่อ Claude

ที่ความกว้าง 390px ภาพด่าน 2 และ 3 โดยเฉพาะส่วนจาง 35% มีรายละเอียดเล็กและอ่านยากกว่าด่าน 1 ตามผลของ perspective
เสนอแสดงภาพตัวอย่างหน้าตรงขนาดใหญ่แยกข้างเกมหรือปุ่มดูภาพตัวอย่าง และแสดงชิ้นที่กำลังลากขนาดใหญ่ขึ้น โดยคงมุมกล้องเกาะเดิม
ยังต้องตรวจ tap target และการลากในเบราว์เซอร์/อุปกรณ์จริงโดย Claude ตามขอบเขตบรีฟ ไม่ใช่งานที่ composite ยืนยันได้

## รันซ้ำ

```sh
node scripts/prepare-puzzle-art.mjs
node scripts/measure-puzzle-art.mjs
node scripts/preview-puzzle-art.mjs
```

prepare แปลงเฉพาะสามภาพใหม่ ไม่ใช้ optimize-images ทั้งโฟลเดอร์ เพราะจะเขียนทับ courtyard และใช้ขนาด/quality คนละค่า
ไม่มีการแก้ src/ โดย Codex และไม่มี commit; ระหว่างทำงานมี src/ เปลี่ยนจากงานอื่น จึงไม่ได้ย้อนคืน

## Prompt จริงทั้งหมด

### Island round 1 — input public/games/hub/puzzle.png

Use case: precise-object-edit. Edit target: the supplied user's own puzzle floating island. Produce one square premium colorful polished 3D game island, actual transparent RGBA background. Preserve the reference oblique elevated corner-view camera EXACTLY (not frontal), turquoise transparent water, white marble cliffs with gold Islamic curved inlay, hanging cyan crystals, green shrubs, white rocks, left date palm, front-left marble staircase, upper-left lighting and luxurious materials. Replace ALL puzzle-shaped platforms and loose pieces with ONE large EMPTY recessed square tray: in screen projection a tilted diamond with four straight edges, slightly rounded corners, thick polished gold rim and uniformly plain cream-white floor, no pattern, no seams, no tabs, no sockets. Tray width about 65–70 percent of island width, occupying most upper surface. Move a smaller white mosque with GOLD dome to the far BACK/top of island BEHIND the tray; no mosque, foliage, rocks, stairs or shadows may obstruct any tray floor or rim. All four inner and outer tray edges clearly visible. Palm remains left outside tray. Keep a strip of turquoise water front/right. NO puzzle pieces anywhere. Whole island and dangling crystals fully inside square canvas with small transparent margin. No humans, animals, birds, faces, text, numerals, Arabic letters, arrows, logos, watermarks, music symbols, religious persons, or copied third-party/BabyBus assets. Generate true transparency, not black/white/checkerboard background.

### Island round 2 — input originals/island-round1.png — SELECTED

Use case: precise-object-edit. Edit this generated puzzle island with only these corrections: (1) Fit the COMPLETE island including highest crescent and lowest crystals inside canvas with at least 3 percent genuine transparent margin on ALL sides; no clipping. (2) Main mosque dome must be polished GOLD, not white. (3) Tray recessed floor must be completely uniform smooth matte ivory cream-white, no marble veins, mottling, patterns, seams or puzzle lines, minimal soft lighting gradient only. Keep the same oblique elevated corner-view camera, tilted diamond square tray, gold rim, turquoise water, white marble gold-inlaid cliff, palm left, stairs front-left, plants and rocks outside tray, mosque behind tray without overlap, upper-left light, premium 3D style. Tray remains large approximately 65–70 percent island width; four straight inner and outer edges unobstructed, tiny corner rounding. No puzzle pieces anywhere. True alpha transparency. No humans, animals, birds, faces, text, numerals, Arabic letters, arrows, logos, watermarks, music symbols, religious persons, or copied third-party/BabyBus assets.

### Picture 1 round 1 — input public/games/puzzle/courtyard.webp (style reference)

Use case: stylized-concept. Asset: square 1024x1024 full-bleed illustration for a toddler 2x2 jigsaw. Reference image courtyard is STYLE/material/light only, create a new simpler continuous scene. Premium colorful polished 3D toy illustration, blue turquoise white gold, soft upper-left sunlight. Four extremely clear large focal objects wholly legible in their respective quarters: upper LEFT a large shiny GOLD CRESCENT floating in pale blue gradient sky; upper RIGHT one large shiny GOLD STAR with fluffy WHITE CLOUD; lower LEFT a short lush GREEN DATE PALM, crown centered low enough to belong to lower-left quarter, trunk on grass; lower RIGHT a simple WHITE BUILDING with a large TURQUOISE BLUE DOME and GOLD trim, arched turquoise door, standing on white marble and grass. One unified continuous garden and sky scene, not a collage. Simplified large rounded forms readable to age three, uncluttered. No image border/frame, no grid, no dividing lines, no jigsaw tabs/cuts. Fill the square edge to edge, opaque image. No humans, animals, birds, faces, text, numerals, Arabic letters, arrows, logos, watermarks, music symbols, religious persons, or copied third-party/BabyBus assets.

### Picture 2 round 1 — input public/games/puzzle/courtyard.webp (style reference)

Use case: stylized-concept. Asset: 1024x1024 square full-bleed picture for 3 columns by 2 rows children's jigsaw. Input courtyard is user's own STYLE reference only. Create one continuous premium colorful polished 3D OASIS GARDEN scene, upper-left sunlight, turquoise blue white gold palette, clear blue sky, rounded toy-like forms. Design SIX distinct focal regions without drawing any dividing lines: upper-left lush green DATE PALM crown with curved trunk; upper-center tall white marble ISLAMIC POINTED ARCH with gold edging and turquoise inset framing the sky; upper-right a large ornate GOLD HANGING LANTERN suspended from a right date palm, its crown also visible. Lower-left a lush layered garden planter with white rocks and large green leaves; lower-center a prominent WHITE MARBLE FOUNTAIN with GOLD rim spilling clear turquoise water into broad basin; lower-right a cluster of turquoise/gold ceramic garden pots by the right palm's base with small white flowers and marble walkway. Fountain centered; arch behind it; date palms both left and right; hanging golden lantern clearly readable. Each of the six rectangular regions contains a large distinctive object, never empty sky or empty paving. Unified depth and setting, not six panels, no collage. Full opaque edge-to-edge image, no frame, border, grid, cut lines, seams or puzzle shapes. No humans, animals, birds, faces, text, numerals, Arabic letters, arrows, logos, watermarks, music symbols, religious persons, or copied third-party/BabyBus assets.

### Island round 3 — aborted, no output, NOT USED

Use case: precise-object-edit. Make ONE targeted correction to this island: scale the entire gold-rimmed empty tray uniformly to 89 percent of its current size about its center. It currently spans about 79 percent of island width; the corrected OUTER gold rim should span about 70 percent of island width. Fill newly exposed space with the same turquoise water. Keep EVERYTHING ELSE unchanged: exact oblique elevated corner-view camera, island outline and position, mosque behind with gold dome, palm left, front-left stairs, rocks foliage, cliffs and hanging crystals, upper-left light, premium 3D materials, complete object inside canvas and genuine transparent margins. Keep tray square in its plane, tilted diamond on screen, slightly rounded corners, thick gold rim, perfectly uniform blank ivory-cream recessed floor, all four edges unoccluded. No floor patterns, no marble veins, no puzzle pieces, no grid or seams. No humans, animals, birds, faces, text, numerals, Arabic letters, arrows, logos, watermarks, music symbols, religious persons, or copied third-party/BabyBus assets. Actual alpha transparency.


## Round 2 ? Waiting-piece trays (27 September 2026)

Generated with built-in image generation; island.png supplied as material/color/light reference. Selected tray-1row-round5.png and tray-2row-round2.png. All seven generated originals retained in output/puzzle-art/originals/. PNGs resized proportionally with transparent padding; no painted or procedural replacement artwork. WebP quality 88, effort 6, alpha retained.

Visual QA: inspected both final measurement composites on pale blue. Smooth empty ivory floor, rounded gold rim, white marble fascia with gold arches, three turquoise pendants, complete object, frontal near-orthographic view and matching upper-left light. No forbidden subjects or embedded text. Camera elevation cannot be numerically recovered from a generated raster; appearance reviewed visually.

| File | Size | Bytes |
|---|---|---|
| public/games/puzzle/tray-1row.png | 1400 ? 560 | 728007 |
| public/games/puzzle/tray-1row.webp | 1400 ? 560 | 54786 |
| public/games/puzzle/tray-2row.png | 1400 ? 820 | 1075588 |
| public/games/puzzle/tray-2row.webp | 1400 ? 820 | 78346 |

Measurements below are percent of the FULL image canvas. Pink = fitted floor quadrilateral; blue = largest axis-aligned rectangle fully contained in the measured cream floor mask. Rounded corners mean fitted quad corners are virtual; place the piece grid using innerRect, with optional additional UI padding. Largest rectangle computed from all mask pixels using histogram/stack, not estimated by eye.

### tray1row

Floor ratio 3.962:1; minimum floor width 89.72%; rear narrowing -0.010%.

```json
{
  "bbox": {
    "x": 2.642857142857143,
    "y": 5.357142857142857,
    "width": 94.85714285714286,
    "height": 85.71428571428571
  },
  "trayFloor": {
    "tl": {
      "x": 5.196511276307881,
      "y": 11.428571428571429
    },
    "tr": {
      "x": 94.92260941159883,
      "y": 11.428571428571429
    },
    "br": {
      "x": 94.92557418828639,
      "y": 68.03571428571429
    },
    "bl": {
      "x": 5.208394885344758,
      "y": 68.03571428571429
    }
  },
  "innerRect": {
    "x": 6.357142857142857,
    "y": 11.785714285714285,
    "width": 87.57142857142857,
    "height": 56.42857142857143
  },
  "innerRectPixels": {
    "x": 89,
    "y": 66,
    "width": 1226,
    "height": 316
  }
}
```

### tray2row

Floor ratio 2.353:1; minimum floor width 89.28%; rear narrowing 0.313%.

```json
{
  "bbox": {
    "x": 2.4285714285714284,
    "y": 5,
    "width": 95.21428571428572,
    "height": 87.07317073170732
  },
  "trayFloor": {
    "tl": {
      "x": 5.392193518979793,
      "y": 9.876295746368887
    },
    "tr": {
      "x": 94.67046598982873,
      "y": 9.881195803510709
    },
    "br": {
      "x": 94.80611337881484,
      "y": 74.7560975609756
    },
    "bl": {
      "x": 5.247339495388699,
      "y": 74.7560975609756
    }
  },
  "innerRect": {
    "x": 6.214285714285714,
    "y": 10.487804878048781,
    "width": 87.71428571428571,
    "height": 64.26829268292683
  },
  "innerRectPixels": {
    "x": 87,
    "y": 86,
    "width": 1228,
    "height": 527
  }
}
```

Reproduce:

```sh
node scripts/prepare-puzzle-art.mjs --trays
node scripts/measure-puzzle-trays.mjs
```

SHA-256 values registered in scripts/source-images.json. tray-protected-verification.json confirms island, picture-1, picture-2 and courtyard PNG/WebP unchanged by preparation. No src/ edits or commit. Integration and browser layout remain for Claude; these overlays are asset QA composites, not browser screenshots.

### Prompt history (verbatim)

Rounds 1?3 of the one-row tray rejected for taper and shallow floor; round 4 corrected side geometry but measured 4.507:1. Round 5 measured 3.962:1 and was selected. Two-row round 1 measured 2.542:1; round 2 measured 2.353:1 and was selected.

#### tray-1row-round1

Use case: stylized-concept. Create ONE isolated empty floating waiting-pieces tray for a premium 3D children's puzzle game. Reference image is MATERIAL, COLORS and UPPER-LEFT LIGHTING ONLY, do not reproduce island or diamond camera. Transparent alpha background. Wide 1400x560 canvas. Front-facing camera looking down approximately 35 degrees, front and rear edges horizontal, near orthographic perspective, back floor width 98% of front floor width. Broad rounded rectangular smooth uniform ivory cream marble EMPTY floor, no veins or patterns, projected floor about 1220 pixels wide and 305 pixels tall (4:1 on-screen), occupies at least 82% canvas width. Thick rounded polished rich gold rim same as reference. Thin white marble vertical front fascia with restrained gold Islamic arch inlay. Three SMALL turquoise crystal pendants beneath fascia, keep them short. Entire tray within canvas with narrow transparent margins. Floor entirely empty. Bright premium colorful 3D render, turquoise white gold palette. No humans animals birds faces religious persons text numbers Arabic letters arrows logos watermarks music symbols puzzle pieces or third-party artwork. Do not add buildings plants or objects on floor.

#### tray-1row-round2

Use case: precise-object-edit. Correct this tray geometry only, preserve gold rim white marble fascia gold arches and three small turquoise pendants, upper-left light. 1400x560 transparent canvas. Empty cream floor must be 1210 pixels wide by 302 pixels high on screen, ratio 4:1. Rear floor edge 1200 pixels wide and front floor edge 1220 pixels wide: side edges almost VERTICAL, only 10px horizontal displacement each. Current rear edge is too narrow and floor too shallow. Make floor taller and reduce fascia/pendant height as necessary to fit, no clipping. Floor at x90..1310 y55..357 approximately; complete object inside canvas. Flat horizontal front/back edges, tiny rounded corners. Uniform unpatterned cream floor. No humans animals birds faces religious persons text numbers Arabic letters arrows logos watermarks music symbols puzzle pieces or copied third-party artwork. Real transparent alpha background.

#### tray-1row-round3

Use case: stylized-concept. Create isolated premium 3D game tray on genuine transparent background, wide canvas 1400x560. Reference island ONLY for polished gold cream marble turquoise materials and upper-left lighting. RECTANGULAR FRONT VIEW ORTHOGRAPHIC platform, absolutely parallel vertical left and right edges of floor, horizontal front/back edges. NOT trapezoidal or diamond. Projected empty floor rectangular x=90 to1310 y=45 to350, width1220 height305, ratio4:1. Rounded gold rim surrounds uniform smooth ivory cream floor, no veins no texture. Camera elevated frontal 35 degrees with orthographic projection; physically deeper tray to achieve specified screen ratio. Small slim white marble front fascia with gold arch inlay below front rim, three short turquoise crystal pendants. Object fully inside frame, narrow margins. Floor at least82% of full width. No shadows or decorations on floor. Premium colorful 3D same gold as reference. No humans animals birds faces religious persons text numbers Arabic letters arrows logos watermarks music symbols puzzle pieces or copied third-party artwork.

#### tray-1row-round4

Use case: precise-object-edit. Edit reference tray. Make a straight rectangular tray viewed from ABOVE with shallow front thickness visible. Keep gold rim, plain cream empty floor, white fascia with gold arch inlay and 3 tiny turquoise pendants. REMOVE perspective taper completely: LEFT AND RIGHT RIMS VERTICAL ON SCREEN, parallel to image sides. Increase floor HEIGHT by 40 percent. Floor projected width-to-height 4:1 exactly. Entire floor width at least 84% image width. No posts or other decorations. Wide 1400x560 transparent canvas, entire object contained. Preserve upper-left lighting materials colors. No humans animals birds faces religious persons text numbers Arabic letters arrows logos watermarks music symbols puzzle pieces or third-party artwork. Actual alpha transparency.

#### tray-1row-round5

Use case: precise-object-edit. SINGLE GEOMETRIC CORRECTION to this exact tray: increase the cream floor's vertical screen height by 13 percent, from400 to452 reference pixels, keeping width1785 unchanged, so floor ratio becomes approximately4:1. Move top rim UP52 pixels into existing transparent margin, keep bottom rim fascia pendants fixed. Preserve all other design colors materials upper-left lighting gold arches three turquoise crystals, straight vertical sides horizontal ends. Full object inside wide transparent1400x560 canvas. Empty smooth uniform cream floor without patterns. No humans animals birds faces religious persons text numbers Arabic letters arrows logos watermarks music symbols puzzle pieces or third-party artwork. Actual alpha transparency.

#### tray-2row-round1

Use case: precise-object-edit. Create the TWO ROW companion of this tray, same exact design, materials, rim thickness, gold arches, 3 turquoise pendants and upper-left lighting. Canvas1400x820. Extend EMPTY cream floor VERTICALLY so its on-screen width:height is 2.3:1, floor width1250 height544 approximately. Keep floor left/right edges parallel almost vertical, horizontal front/back edges, very small perspective 0-3% taper. Full object within canvas transparent margins. Recessed plain uniform cream white marble floor, no pattern. Front fascia white marble gold arch inlay and three short turquoise pendants BELOW floor. Preserve premium 3D bevel and visible shallow frontal thickness. Floor width at least82% of canvas. No humans animals birds faces religious persons text numbers Arabic letters arrows logos watermarks music symbols puzzle pieces or third-party artwork. True alpha transparency.

#### tray-2row-round2

Use case: precise-object-edit. SINGLE GEOMETRIC CORRECTION to this exact tray: increase empty cream floor vertical screen height by 10.5 percent keeping floor width unchanged. Target screen floor ratio2.3:1 instead of current2.54:1. Move top rim upward into transparent margin; retain bottom rim fascia three turquoise pendants. Preserve design colors materials gold arches upper-left lighting straight near-vertical side edges and horizontal front/back.1400x820 transparent canvas entire object contained. Smooth uniform empty ivory cream floor no patterns. No humans animals birds faces religious persons text numbers Arabic letters arrows logos watermarks music symbols puzzle pieces or third-party artwork. Actual alpha transparency.
