import type { Text } from '@/i18n/config';

/*
  รูประบายสี: สิ่งของและพืชเท่านั้น ไม่มีคนหรือสัตว์เลยแม้ใบหน้าว่าง และไม่มีใบหน้าบนดวงจันทร์ ดวงอาทิตย์ หรือสิ่งของ (ข้อ 1.1)
  ทุกรูปใช้ viewBox 400×300 วาดตามลำดับใน regions ชิ้นแรกคือพื้นหลัง
  SVG paths ใช้เป็นเส้นรูปและหน้ากาก canvas ระบายสีด้วยพู่กันใน paint.ts
*/
export type ArtRegion = { id: string; d: string; label: Text; thin?: boolean };
// example: สีของภาพตัวอย่าง (id ของ ART_COLORS) ชิ้นที่ไม่ระบุคือปล่อยเป็นสีกระดาษ เช่น ก้อนเมฆ
export type ArtPicture = { id: string; title: Text; difficulty?: 'easy' | 'detailed'; regions: ArtRegion[]; example: Record<string, ArtColorId>; lines?: string };
export const ART_DIFFICULTY = {
  easy: { th: 'ง่าย', en: 'Easy' },
  detailed: { th: 'ละเอียด', en: 'Detailed' },
} satisfies Record<string, Text>;
export type ArtColorId = 'red' | 'orange' | 'yellow' | 'green' | 'turquoise' | 'blue' | 'purple' | 'pink';
export type ArtColor = { id: ArtColorId; value: string; label: Text; shape: 'diamond' | 'hexagon' | 'triangle' | 'square' | 'circle' | 'drop' | 'star' | 'heart' };

const BACKGROUND = 'M0 0H400V300H0Z';
const alternate = (prefix: string, count: number, first: ArtColorId, second: ArtColorId) =>
  Object.fromEntries(Array.from({ length: count }, (_, i) => [`${prefix}-${i + 1}`, i % 2 ? second : first])) as Record<string, ArtColorId>;
const r = (id: string, th: string, en: string, d: string, thin = false): ArtRegion => ({ id, d, label: { th, en }, thin });

// ดาวแปดแฉกจากสี่เหลี่ยมสองรูปซ้อนกัน (ลายเรขาคณิต) จุดยอดคำนวณจากรัศมี ไม่ได้กะด้วยตา
const polar = (cx: number, cy: number, radius: number, degrees: number) => {
  const a = (degrees * Math.PI) / 180;
  return `${(cx + radius * Math.cos(a)).toFixed(1)} ${(cy + radius * Math.sin(a)).toFixed(1)}`;
};
const OUTER = 124, INNER = OUTER * Math.cos(Math.PI / 4) / Math.cos(Math.PI / 8);
const tips = Array.from({ length: 8 }, (_, i) => r(`tip-${i + 1}`, `แฉกที่ ${i + 1}`, `Point ${i + 1}`,
  `M${polar(200, 150, INNER, i * 45 - 22.5)}L${polar(200, 150, OUTER, i * 45)}L${polar(200, 150, INNER, i * 45 + 22.5)}Z`));
const octagon = `M${Array.from({ length: 8 }, (_, i) => polar(200, 150, INNER, i * 45 - 22.5)).join('L')}Z`;

export const ART_PICTURES: ArtPicture[] = [
  {
    id: 'boat', title: { th: 'เรือใบ', en: 'Sailboat' },
    example: { sky: 'turquoise', sun: 'yellow', sea: 'blue', hull: 'red', 'sail-left': 'pink', 'sail-right': 'yellow', mast: 'orange', flag: 'green' },
    regions: [
      r('sky', 'ท้องฟ้า', 'Sky', BACKGROUND),
      r('sun', 'ดวงอาทิตย์', 'Sun', 'M336 60a30 30 0 1 1-60 0a30 30 0 1 1 60 0Z'),
      r('cloud', 'ก้อนเมฆ', 'Cloud', 'M44 92c-14 0-22-18-6-26c2-18 28-22 36-8c16-6 32 6 26 20c10 8 4 20-8 20Z'),
      r('sea', 'ทะเล', 'Sea', 'M0 216c34-14 66-14 100 0s66 14 100 0s66-14 100 0s66 14 100 0V300H0Z'),
      r('hull', 'ลำเรือ', 'Hull', 'M96 196H304C296 232 270 248 244 248H156C130 248 104 232 96 196Z'),
      r('sail-left', 'ใบเรือซ้าย', 'Left sail', 'M192 42V180H98C128 142 166 92 192 42Z'),
      r('sail-right', 'ใบเรือขวา', 'Right sail', 'M208 60C242 94 276 136 296 180H208Z'),
      r('mast', 'เสากระโดง', 'Mast', 'M194 26H206V196H194Z', true),
      r('flag', 'ธง', 'Flag', 'M206 26L244 38L206 50Z'),
    ],
  },
  {
    id: 'lantern', title: { th: 'โคมไฟ', en: 'Lantern' },
    example: { wall: 'purple', ring: 'yellow', dome: 'blue', band: 'orange', 'pane-left': 'turquoise', 'pane-middle': 'yellow', 'pane-right': 'turquoise', flame: 'orange', base: 'orange', foot: 'blue' },
    regions: [
      r('wall', 'พื้นหลัง', 'Background', BACKGROUND),
      r('ring', 'ห่วงแขวน', 'Ring', 'M200 10a18 18 0 1 1-.1 0ZM200 22a6 6 0 1 0 .1 0Z'),
      r('dome', 'หลังคาโคม', 'Lantern top', 'M120 104C130 66 164 44 200 44S270 66 280 104Z'),
      r('band', 'แถบบน', 'Top band', 'M104 104H296V128H104Z'),
      r('pane-left', 'กระจกซ้าย', 'Left glass', 'M122 128H168V232H122Z'),
      r('pane-middle', 'กระจกกลาง', 'Middle glass', 'M168 128H232V232H168Z'),
      r('pane-right', 'กระจกขวา', 'Right glass', 'M232 128H278V232H232Z'),
      r('flame', 'เปลวไฟ', 'Flame', 'M200 150C222 180 226 206 200 218C174 206 178 180 200 150Z'),
      r('base', 'ฐานโคม', 'Base', 'M104 232H296V254H104Z'),
      r('foot', 'ก้นโคม', 'Bottom', 'M140 254H260C252 280 228 290 200 290S148 280 140 254Z'),
    ],
  },
  {
    id: 'moon', title: { th: 'จันทร์เสี้ยวกับดาว', en: 'Moon and stars' },
    example: { night: 'blue', moon: 'yellow', 'star-big': 'orange', 'star-small': 'yellow', 'star-low': 'yellow' },
    regions: [
      r('night', 'ท้องฟ้ายามค่ำ', 'Night sky', BACKGROUND),
      r('moon', 'จันทร์เสี้ยว', 'Crescent moon', 'M230 40A112 112 0 1 0 230 260A130 130 0 0 1 230 40Z'),
      r('star-big', 'ดาวดวงใหญ่', 'Big star', 'M284 98l16 34l37 5l-27 26l7 37l-33-18l-33 18l7-37l-27-26l37-5Z'),
      r('star-small', 'ดาวดวงเล็ก', 'Small star', 'M340 34l8 17l18 3l-13 13l3 18l-16-9l-16 9l3-18l-13-13l18-3Z'),
      r('star-low', 'ดาวอีกดวง', 'Another star', 'M348 214l7 15l16 2l-12 11l3 16l-14-8l-14 8l3-16l-12-11l16-2Z'),
      r('cloud', 'ก้อนเมฆ', 'Cloud', 'M238 292c-16 0-22-20-6-26c4-16 28-18 36-6c18-6 32 10 26 22c6 2 6 10 0 10Z'),
    ],
  },
  {
    id: 'palm', title: { th: 'ต้นอินทผลัม', en: 'Date palm' },
    example: { sky: 'turquoise', sun: 'orange', dune: 'yellow', trunk: 'orange', 'frond-left-low': 'green', 'frond-right-low': 'green', 'frond-left': 'green', 'frond-right': 'green', 'frond-top': 'green', 'dates-left': 'red', 'dates-right': 'red' },
    regions: [
      r('sky', 'ท้องฟ้า', 'Sky', BACKGROUND),
      r('sun', 'ดวงอาทิตย์', 'Sun', 'M92 70a34 34 0 1 1-68 0a34 34 0 1 1 68 0Z'),
      r('dune', 'เนินทราย', 'Sand dune', 'M0 236C70 204 150 208 212 228S340 246 400 216V300H0Z'),
      r('trunk', 'ลำต้น', 'Trunk', 'M186 112H216C218 160 226 206 238 244H174C186 206 188 160 186 112Z'),
      r('frond-left-low', 'ใบล่างซ้าย', 'Lower left leaf', 'M198 112C160 104 110 122 84 172C126 146 168 136 198 112Z'),
      r('frond-right-low', 'ใบล่างขวา', 'Lower right leaf', 'M204 112C242 104 292 122 318 172C276 146 234 136 204 112Z'),
      r('frond-left', 'ใบซ้าย', 'Left leaf', 'M200 110C168 72 116 62 70 86C118 88 164 96 200 110Z'),
      r('frond-right', 'ใบขวา', 'Right leaf', 'M202 110C234 72 286 62 332 86C284 88 238 96 202 110Z'),
      r('frond-top', 'ใบบน', 'Top leaf', 'M201 110C176 76 182 38 214 16C210 52 216 82 201 110Z'),
      r('dates-left', 'ลูกอินทผลัมซ้าย', 'Left dates', 'M186 118c-16 0-24 14-18 28c6 12 22 12 26-2c4-12 2-22-8-26Z'),
      r('dates-right', 'ลูกอินทผลัมขวา', 'Right dates', 'M216 118c16 0 24 14 18 28c-6 12-22 12-26-2c-4-12-2-22 8-26Z'),
    ],
  },
  {
    id: 'flower', title: { th: 'กระถางดอกไม้', en: 'Flower pot' },
    example: { wall: 'turquoise', table: 'yellow', stem: 'green', 'leaf-left': 'green', 'leaf-right': 'green', ...alternate('petal', 6, 'pink', 'red'), center: 'yellow', 'pot-rim': 'red', pot: 'orange' },
    regions: [
      r('wall', 'พื้นหลัง', 'Background', BACKGROUND),
      r('table', 'โต๊ะ', 'Table', 'M0 262H400V300H0Z'),
      r('stem', 'ก้านดอก', 'Stem', 'M193 120H207V204H193Z', true),
      r('leaf-left', 'ใบซ้าย', 'Left leaf', 'M196 196C166 160 122 162 96 182C124 208 168 214 196 196Z'),
      r('leaf-right', 'ใบขวา', 'Right leaf', 'M204 196C234 160 278 162 304 182C276 208 232 214 204 196Z'),
      ...[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const a = (angle * Math.PI) / 180, cx = 200 + 46 * Math.sin(a), cy = 84 - 46 * Math.cos(a);
        return r(`petal-${i + 1}`, `กลีบที่ ${i + 1}`, `Petal ${i + 1}`, `M${cx - 30} ${cy}a30 30 0 1 1 60 0a30 30 0 1 1-60 0Z`);
      }),
      r('center', 'กลางดอก', 'Flower centre', 'M174 84a26 26 0 1 1 52 0a26 26 0 1 1-52 0Z'),
      r('pot-rim', 'ขอบกระถาง', 'Pot rim', 'M132 204H268V226H132Z'),
      r('pot', 'กระถาง', 'Pot', 'M144 226H256L242 280H158Z'),
    ],
  },
  {
    id: 'pattern', title: { th: 'ลายดาวแปดแฉก', en: 'Eight-point star' },
    example: { tile: 'turquoise', 'corner-1': 'blue', 'corner-2': 'blue', 'corner-3': 'blue', 'corner-4': 'blue', ...alternate('tip', 8, 'yellow', 'orange'), middle: 'purple' },
    regions: [
      r('tile', 'พื้นลาย', 'Background', BACKGROUND),
      r('corner-1', 'มุมซ้ายบน', 'Top left corner', 'M0 0H96L0 84Z'),
      r('corner-2', 'มุมขวาบน', 'Top right corner', 'M400 0H304L400 84Z'),
      r('corner-3', 'มุมซ้ายล่าง', 'Bottom left corner', 'M0 300H96L0 216Z'),
      r('corner-4', 'มุมขวาล่าง', 'Bottom right corner', 'M400 300H304L400 216Z'),
      ...tips,
      r('middle', 'กลางดาว', 'Star centre', octagon),
    ],
  },
  {
    id: 'house', title: { th: 'บ้านหลังคาโดม', en: 'Domed house' },
    example: { sky: 'turquoise', ground: 'green', tower: 'orange', 'tower-top': 'blue', dome: 'blue', wall: 'yellow', door: 'purple', 'window-left': 'turquoise', 'window-right': 'turquoise' },
    regions: [
      r('sky', 'ท้องฟ้า', 'Sky', BACKGROUND),
      r('ground', 'พื้นดิน', 'Ground', 'M0 256H400V300H0Z'),
      r('tower', 'หอคอย', 'Tower', 'M318 96H346V256H318Z'),
      r('tower-top', 'ยอดหอคอย', 'Tower top', 'M308 96C312 72 322 58 332 46C342 58 352 72 356 96Z'),
      r('dome', 'โดม', 'Dome', 'M112 136C114 84 154 56 200 56S286 84 288 136Z'),
      r('wall', 'ผนัง', 'Wall', 'M92 136H308V256H92Z'),
      r('door', 'ประตู', 'Door', 'M170 256V198C170 176 186 164 200 164S230 176 230 198V256Z'),
      r('window-left', 'หน้าต่างซ้าย', 'Left window', 'M116 216V184C116 170 126 162 134 162S152 170 152 184V216Z'),
      r('window-right', 'หน้าต่างขวา', 'Right window', 'M248 216V184C248 170 258 162 266 162S284 170 284 184V216Z'),
    ],
  },
  {
    id: 'pot', title: { th: 'กาน้ำชา', en: 'Teapot' },
    example: { wall: 'yellow', table: 'orange', handle: 'blue', spout: 'blue', body: 'turquoise', stripe: 'pink', lid: 'blue', knob: 'red' },
    regions: [
      r('wall', 'พื้นหลัง', 'Background', BACKGROUND),
      r('table', 'โต๊ะ', 'Table', 'M0 258H400V300H0Z'),
      r('handle', 'หูจับ', 'Handle', 'M276 118C330 104 352 150 334 190C324 212 300 224 276 226V200C306 198 318 176 312 156C308 142 296 138 276 144Z'),
      r('spout', 'พวยกา', 'Spout', 'M128 160C112 150 96 122 66 112L54 128C84 144 92 186 124 216Z'),
      r('body', 'ตัวกา', 'Pot body', 'M112 180C112 130 150 104 200 104S288 130 288 180S250 256 200 256S112 230 112 180Z'),
      r('stripe', 'ลายกลาง', 'Middle stripe', 'M114 164H286C288 174 288 186 286 196H114C112 186 112 174 114 164Z'),
      r('lid', 'ฝากา', 'Lid', 'M142 112C158 80 242 80 258 112C226 102 174 102 142 112Z'),
      r('knob', 'จุกฝา', 'Lid knob', 'M180 70a20 20 0 1 1 40 0a20 20 0 0 1-40 0Z'),
    ],
  },
  // C-1: counts exclude the background; large pieces first, then smaller details.
  {
    id: 'umbrella', title: { th: 'ร่ม', en: 'Umbrella' }, difficulty: 'easy',
    example: { background: 'turquoise', shaft: 'orange', handle: 'purple', left: 'yellow', middle: 'pink', right: 'blue' },
    regions: [
      r('background', 'พื้นหลัง', 'Background', BACKGROUND),
      r('shaft', 'ก้านร่ม', 'Umbrella shaft', 'M194 38H206V234H194Z', true),
      r('handle', 'ด้ามจับ', 'Handle', 'M194 228H206V244C206 280 150 280 150 244H166C166 260 194 260 194 244Z'),
      r('left', 'ผ้าร่มซ้าย', 'Left canopy', 'M200 48C126 48 70 94 48 164Q94 140 140 164C142 114 162 70 200 48Z'),
      r('middle', 'ผ้าร่มกลาง', 'Middle canopy', 'M200 48C162 70 142 114 140 164Q200 138 260 164C258 114 238 70 200 48Z'),
      r('right', 'ผ้าร่มขวา', 'Right canopy', 'M200 48C238 70 258 114 260 164Q306 140 352 164C330 94 274 48 200 48Z'),
    ],
  },
  {
    id: 'ball', title: { th: 'ลูกบอล', en: 'Ball' }, difficulty: 'easy',
    example: { background: 'turquoise', ...alternate('panel', 6, 'yellow', 'red') },
    regions: [
      r('background', 'พื้นหลัง', 'Background', BACKGROUND),
      ...Array.from({ length: 6 }, (_, i) => r(`panel-${i + 1}`, `แถบที่ ${i + 1}`, `Panel ${i + 1}`,
        `M200 150L${polar(200, 150, 116, i * 60 - 90)}A116 116 0 0 1 ${polar(200, 150, 116, (i + 1) * 60 - 90)}Z`)),
    ],
  },
  {
    id: 'seedling', title: { th: 'กระถางต้นอ่อน', en: 'Seedling pot' }, difficulty: 'easy',
    example: { background: 'turquoise', stem: 'green', left: 'green', right: 'green', pot: 'orange', rim: 'yellow', saucer: 'purple' },
    regions: [
      r('background', 'พื้นหลัง', 'Background', BACKGROUND),
      r('stem', 'ลำต้น', 'Stem', 'M193 92H207V192H193Z', true),
      r('left', 'ใบซ้าย', 'Left leaf', 'M200 142C132 148 98 116 100 60C158 58 196 88 200 142Z'),
      r('right', 'ใบขวา', 'Right leaf', 'M200 112C202 58 242 30 300 38C296 92 258 124 200 112Z'),
      r('saucer', 'จานรอง', 'Saucer', 'M122 254H278L264 278H136Z'),
      r('pot', 'กระถาง', 'Pot', 'M132 196H268L250 260H150Z'),
      r('rim', 'ขอบกระถาง', 'Pot rim', 'M122 176H278V202H122Z'),
    ],
  },
  {
    id: 'toy-truck', title: { th: 'รถบรรทุกของเล่น', en: 'Toy truck' }, difficulty: 'detailed',
    example: { background: 'turquoise', ground: 'green', cargo: 'yellow', bed: 'blue', rail: 'purple', cab: 'red', window: 'turquoise', chassis: 'orange', bumper: 'yellow', 'wheel-left': 'purple', 'wheel-right': 'purple', 'hub-left': 'pink', 'hub-right': 'pink' },
    regions: [
      r('background', 'พื้นหลัง', 'Background', BACKGROUND),
      r('ground', 'พื้นดิน', 'Ground', 'M0 260H400V300H0Z'),
      r('cargo', 'กล่องสินค้า', 'Cargo box', 'M70 76H174V148H70Z'),
      r('bed', 'กระบะ', 'Truck bed', 'M44 132H222V208H44Z'),
      r('rail', 'ขอบกระบะ', 'Bed rail', 'M36 126H230V146H36Z'),
      r('cab', 'ห้องขับ', 'Cab', 'M230 96H300L344 158V214H230Z'),
      r('window', 'หน้าต่าง', 'Window', 'M246 112H290L318 154H246Z'),
      r('chassis', 'ฐานรถ', 'Chassis', 'M40 208H350V234H40Z'),
      r('bumper', 'กันชน', 'Bumper', 'M330 202H366V228H330Z'),
      r('wheel-left', 'ล้อซ้าย', 'Left wheel', 'M126 234a34 34 0 1 1-68 0a34 34 0 1 1 68 0Z'),
      r('wheel-right', 'ล้อขวา', 'Right wheel', 'M326 234a34 34 0 1 1-68 0a34 34 0 1 1 68 0Z'),
      r('hub-left', 'ดุมล้อซ้าย', 'Left wheel hub', 'M106 234a14 14 0 1 1-28 0a14 14 0 1 1 28 0Z'),
      r('hub-right', 'ดุมล้อขวา', 'Right wheel hub', 'M306 234a14 14 0 1 1-28 0a14 14 0 1 1 28 0Z'),
    ],
  },
  {
    id: 'watering-can', title: { th: 'บัวรดน้ำ', en: 'Watering can' }, difficulty: 'detailed',
    example: { background: 'turquoise', handle: 'purple', spout: 'yellow', body: 'green', band: 'yellow', rim: 'orange', rose: 'purple', 'drop-1': 'blue', 'drop-2': 'blue', 'drop-3': 'blue', base: 'orange' },
    regions: [
      r('background', 'พื้นหลัง', 'Background', BACKGROUND),
      r('handle', 'หูจับ', 'Handle', 'M126 114C38 54 22 216 128 218V194C62 192 72 104 126 138Z'),
      r('spout', 'ท่อรดน้ำ', 'Spout', 'M244 174L314 106L328 122L258 226Z'),
      r('body', 'ตัวบัวรดน้ำ', 'Can body', 'M112 112H258L246 246H124Z'),
      r('band', 'แถบกลาง', 'Middle band', 'M116 164H254L251 194H119Z'),
      r('rim', 'ขอบบน', 'Top rim', 'M104 102H266V124H104Z'),
      r('rose', 'หัวฝักบัว', 'Sprinkler head', 'M302 102L330 80L354 120L326 136Z'),
      r('drop-1', 'หยดน้ำที่หนึ่ง', 'Water drop one', 'M354 148C334 174 340 186 354 186C368 186 374 174 354 148Z'),
      r('drop-2', 'หยดน้ำที่สอง', 'Water drop two', 'M322 198C302 224 308 236 322 236C336 236 342 224 322 198Z'),
      r('drop-3', 'หยดน้ำที่สาม', 'Water drop three', 'M366 230C346 256 352 268 366 268C380 268 386 256 366 230Z'),
      r('base', 'ฐานบัวรดน้ำ', 'Can base', 'M118 240H252V260H118Z'),
    ],
  },
  {
    id: 'vegetable-garden', title: { th: 'สวนผัก', en: 'Vegetable garden' }, difficulty: 'detailed',
    // Raised soil bed, tapered carrots with three-lobed tops, round overlapping cabbage leaves,
    // and a branching tomato plant beside its support. 16 pieces, excluding background.
    example: { background: 'turquoise', bed: 'orange', soil: 'yellow', 'carrot-left': 'orange', 'carrot-right': 'orange', 'leaves-left': 'green', 'leaves-right': 'green', cabbage: 'green', 'cabbage-fold': 'green', 'cabbage-middle': 'green', stake: 'orange', stem: 'green', 'tomato-leaf-left': 'green', 'tomato-leaf-right': 'green', 'tomato-left': 'red', 'tomato-right': 'red', calyx: 'green' },
    regions: [
      r('background', 'พื้นหลัง', 'Background', BACKGROUND),
      r('bed', 'กระบะปลูกผัก', 'Raised garden bed', 'M24 177H350L378 222V268H52L24 223Z'),
      r('soil', 'ดินปลูกผัก', 'Soil in the bed', 'M24 177H350L378 222H52Z'),
      r('carrot-left', 'แครอทซ้าย', 'Left carrot', 'M55 156Q74 141 94 156C92 176 82 201 74 216C66 201 57 176 55 156Z'),
      r('carrot-right', 'แครอทขวา', 'Right carrot', 'M108 166Q126 151 145 166C143 185 134 207 126 221C118 207 110 185 108 166Z'),
      r('leaves-left', 'ใบแครอทซ้ายสามแฉก', 'Three-lobed left carrot top', 'M74 150C58 145 44 127 43 109C59 109 68 119 70 130C62 110 62 91 74 79C86 91 86 110 78 130C82 116 93 106 107 108C105 128 91 145 74 150Z'),
      r('leaves-right', 'ใบแครอทขวาสามแฉก', 'Three-lobed right carrot top', 'M126 160C110 155 98 139 98 124C112 123 120 134 122 141C115 122 115 106 126 94C137 106 137 122 130 141C134 128 144 120 157 122C155 141 142 155 126 160Z'),
      r('cabbage', 'กะหล่ำปลี', 'Cabbage', 'M244 184C244 211 226 233 200 233C173 233 155 213 155 188C155 162 173 145 198 145C224 145 244 160 244 184Z'),
      r('cabbage-fold', 'ใบกะหล่ำชั้นนอก', 'Outer cabbage leaf', 'M158 180C180 173 203 191 207 226C181 234 160 215 158 180Z'),
      r('cabbage-middle', 'ใบกะหล่ำชั้นใน', 'Inner cabbage leaf', 'M234 180C234 198 222 211 208 211C193 211 183 198 183 181C183 164 195 156 208 157C225 158 234 168 234 180Z'),
      r('stake', 'ไม้ค้ำมะเขือเทศ', 'Tomato support stake', 'M312 40L318 30L324 40V211H312Z', true),
      r('stem', 'ลำต้นและกิ่งมะเขือเทศ', 'Tomato stem and branches', 'M291 208V132L270 118L275 110L291 120V62H301V145L330 130L335 139L301 158V208Z', true),
      r('tomato-leaf-left', 'ใบมะเขือเทศซ้าย', 'Left tomato leaf', 'M293 102C271 106 247 90 247 69C271 64 292 77 293 102Z'),
      r('tomato-leaf-right', 'ใบมะเขือเทศขวา', 'Right tomato leaf', 'M300 86C305 62 326 52 349 59C348 81 325 96 300 86Z'),
      r('tomato-left', 'มะเขือเทศซ้าย', 'Left tomato', 'M294 140a21 21 0 1 1-42 0a21 21 0 1 1 42 0Z'),
      r('tomato-right', 'มะเขือเทศขวา', 'Right tomato', 'M354 160a22 22 0 1 1-44 0a22 22 0 1 1 44 0Z'),
      r('calyx', 'ขั้วมะเขือเทศ', 'Tomato calyxes', 'M273 119L263 114L267 122L259 127L271 126L277 132L279 124L287 120L277 121ZM332 138L322 133L326 141L318 146L330 145L336 151L338 143L346 139L336 140Z', true),
    ],
  },
  // C-13: original objects and plants, with 3 easy and 3 detailed pictures.
  {
    id: 'moon-stars', title: { th: 'ดวงจันทร์กับดาว', en: 'Moon and stars' }, difficulty: 'easy',
    example: { background: 'blue', moon: 'yellow', ...alternate('star', 4, 'orange', 'pink') },
    regions: [
      r('background', 'พื้นหลัง', 'Background', BACKGROUND),
      r('moon', 'ดวงจันทร์เสี้ยว', 'Crescent moon', 'M222 34C110 16 60 156 136 230C178 270 244 264 282 218C206 244 142 174 166 104C176 74 196 50 222 34Z'),
      ...[[300, 64], [334, 156], [64, 62], [70, 250]].map(([x, y], i) => r(`star-${i + 1}`, `ดาวที่ ${i + 1}`, `Star ${i + 1}`,
        `M${x} ${y - 26}L${x + 8} ${y - 8}L${x + 28} ${y - 6}L${x + 13} ${y + 8}L${x + 17} ${y + 28}L${x} ${y + 18}L${x - 17} ${y + 28}L${x - 13} ${y + 8}L${x - 28} ${y - 6}L${x - 8} ${y - 8}Z`)),
    ],
  },
  {
    id: 'date-plate', title: { th: 'จานอินทผลัม', en: 'Plate of dates' }, difficulty: 'easy',
    example: { background: 'turquoise', plate: 'blue', center: 'yellow', ...alternate('date', 4, 'orange', 'red') },
    regions: [
      r('background', 'พื้นหลัง', 'Background', BACKGROUND),
      r('plate', 'ขอบจาน', 'Plate rim', 'M366 158a166 108 0 1 1-332 0a166 108 0 1 1 332 0Z'),
      r('center', 'กลางจาน', 'Plate center', 'M338 158a138 80 0 1 1-276 0a138 80 0 1 1 276 0Z'),
      ...[[123, 122], [236, 122], [160, 185], [274, 185]].map(([x, y], i) => r(`date-${i + 1}`, `อินทผลัมที่ ${i + 1}`, `Date ${i + 1}`,
        `M${x - 38} ${y}C${x - 38} ${y - 34} ${x + 38} ${y - 34} ${x + 38} ${y}C${x + 38} ${y + 34} ${x - 38} ${y + 34} ${x - 38} ${y}Z`)),
    ],
  },
  {
    id: 'geometric-kite', title: { th: 'ว่าวลายเรขาคณิต', en: 'Geometric kite' }, difficulty: 'easy',
    example: { background: 'turquoise', string: 'purple', left: 'yellow', top: 'red', right: 'blue', bottom: 'green', bow: 'pink' },
    regions: [
      r('background', 'พื้นหลัง', 'Background', BACKGROUND),
      r('string', 'สายว่าว', 'Kite string', 'M190 206H202C202 232 242 224 258 242C272 260 254 282 230 284L228 274C244 272 256 260 248 250C234 236 188 248 190 206Z', true),
      r('left', 'ช่องซ้าย', 'Left panel', 'M196 30L88 110L196 110Z'),
      r('top', 'ช่องบนขวา', 'Upper right panel', 'M196 30L304 110H196Z'),
      r('right', 'ช่องล่างขวา', 'Lower right panel', 'M304 110L196 216V110Z'),
      r('bottom', 'ช่องล่างซ้าย', 'Lower left panel', 'M196 216L88 110H196Z'),
      r('bow', 'โบว์สายว่าว', 'Kite tail bow', 'M232 242L204 226V258L232 242L260 226V258Z'),
    ],
  },
  {
    id: 'geometric-rug', title: { th: 'พรมลายเรขาคณิต', en: 'Geometric rug' }, difficulty: 'detailed',
    example: { background: 'turquoise', rug: 'purple', field: 'blue', 'band-top': 'yellow', 'band-bottom': 'yellow', center: 'pink', ...alternate('corner', 4, 'orange', 'green'), 'fringe-top': 'orange', 'fringe-bottom': 'orange' },
    regions: [
      r('background', 'พื้นหลัง', 'Background', BACKGROUND),
      r('fringe-top', 'ชายพรมด้านบน', 'Top fringe', 'M90 18H310V44H90Z'),
      r('fringe-bottom', 'ชายพรมด้านล่าง', 'Bottom fringe', 'M90 256H310V282H90Z'),
      r('rug', 'ขอบพรม', 'Rug border', 'M76 40H324V260H76Z'),
      r('field', 'พื้นพรม', 'Rug field', 'M102 66H298V234H102Z'),
      r('band-top', 'แถบบน', 'Top band', 'M102 66H298V88H102Z'),
      r('band-bottom', 'แถบล่าง', 'Bottom band', 'M102 212H298V234H102Z'),
      r('center', 'สี่เหลี่ยมกลางพรม', 'Center diamond', 'M200 94L254 150L200 206L146 150Z'),
      ...[[125, 112], [275, 112], [125, 188], [275, 188]].map(([x, y], i) => r(`corner-${i + 1}`, `ลายมุมที่ ${i + 1}`, `Corner motif ${i + 1}`,
        `M${x} ${y - 18}L${x + 17} ${y}L${x} ${y + 18}L${x - 17} ${y}Z`)),
    ],
  },
  {
    id: 'date-palm', title: { th: 'ต้นปาล์มอินทผลัม', en: 'Date palm' }, difficulty: 'detailed',
    example: { background: 'turquoise', ground: 'yellow', trunk: 'orange', 'trunk-band': 'yellow', ...alternate('frond', 6, 'green', 'green'), 'dates-left': 'orange', 'dates-right': 'red' },
    regions: [
      r('background', 'พื้นหลัง', 'Background', BACKGROUND),
      r('ground', 'พื้นทราย', 'Sandy ground', 'M0 264Q100 238 200 264Q300 240 400 264V300H0Z'),
      r('trunk', 'ลำต้น', 'Trunk', 'M188 98H212L224 268H176Z'),
      r('trunk-band', 'ลายลำต้น', 'Trunk band', 'M183 186H217L219 212H181Z'),
      r('frond-1', 'ใบที่ 1', 'Frond 1', 'M200 100C124 50 58 82 32 132C94 106 138 118 200 100Z'),
      r('frond-2', 'ใบที่ 2', 'Frond 2', 'M200 100C144 82 88 120 70 190C108 150 160 148 200 100Z'),
      r('frond-3', 'ใบที่ 3', 'Frond 3', 'M200 100C198 42 138 14 96 32C140 46 150 84 200 100Z'),
      r('frond-4', 'ใบที่ 4', 'Frond 4', 'M200 100C276 50 342 82 368 132C306 106 262 118 200 100Z'),
      r('frond-5', 'ใบที่ 5', 'Frond 5', 'M200 100C256 82 312 120 330 190C292 150 240 148 200 100Z'),
      r('frond-6', 'ใบที่ 6', 'Frond 6', 'M200 100C202 42 262 14 304 32C260 46 250 84 200 100Z'),
      r('dates-left', 'ช่ออินทผลัมซ้าย', 'Left date bunch', 'M174 110C152 100 138 122 146 138C130 154 146 178 162 168C184 180 198 154 186 140C200 124 188 108 174 110Z'),
      r('dates-right', 'ช่ออินทผลัมขวา', 'Right date bunch', 'M226 110C248 100 262 122 254 138C270 154 254 178 238 168C216 180 202 154 214 140C200 124 212 108 226 110Z'),
    ],
  },
  {
    id: 'arched-house', title: { th: 'บ้านหน้าต่างโค้ง', en: 'House with arched windows' }, difficulty: 'detailed',
    example: { background: 'turquoise', ground: 'green', chimney: 'orange', wall: 'yellow', roof: 'red', door: 'blue', 'window-left': 'purple', 'window-right': 'purple', 'sill-left': 'orange', 'sill-right': 'orange', step: 'pink', path: 'orange' },
    regions: [
      r('background', 'พื้นหลัง', 'Background', BACKGROUND),
      r('ground', 'สนามหญ้า', 'Lawn', 'M0 250H400V300H0Z'),
      r('path', 'ทางเดิน', 'Path', 'M174 250H226L252 300H148Z'),
      r('chimney', 'ปล่องไฟ', 'Chimney', 'M270 40H310V108H270Z'),
      r('wall', 'ผนังบ้าน', 'House wall', 'M78 124H322V250H78Z'),
      r('roof', 'หลังคา', 'Roof', 'M48 126L200 26L352 126Z'),
      r('door', 'ประตู', 'Door', 'M174 250V192Q200 160 226 192V250Z'),
      r('window-left', 'หน้าต่างซ้าย', 'Left window', 'M102 210V166C102 138 148 138 148 166V210Z'),
      r('window-right', 'หน้าต่างขวา', 'Right window', 'M252 210V166C252 138 298 138 298 166V210Z'),
      r('sill-left', 'ขอบหน้าต่างซ้าย', 'Left windowsill', 'M94 210H156V224H94Z', true),
      r('sill-right', 'ขอบหน้าต่างขวา', 'Right windowsill', 'M244 210H306V224H244Z', true),
      r('step', 'ขั้นบันได', 'Doorstep', 'M164 246H236V266H164Z'),
    ],
  },
];

// สีวัดจากเนื้อสีในถาดจริงด้วย output/art-assets/process-paint.mjs
export const ART_COLORS: ArtColor[] = [
  { id: 'red', value: '#f82f2a', shape: 'diamond', label: { th: 'สีแดง', en: 'Red' } },
  { id: 'orange', value: '#fd8601', shape: 'hexagon', label: { th: 'สีส้ม', en: 'Orange' } },
  { id: 'yellow', value: '#fde102', shape: 'triangle', label: { th: 'สีเหลือง', en: 'Yellow' } },
  { id: 'green', value: '#03d241', shape: 'square', label: { th: 'สีเขียว', en: 'Green' } },
  { id: 'turquoise', value: '#02cfe1', shape: 'circle', label: { th: 'สีฟ้าน้ำทะเล', en: 'Turquoise' } },
  { id: 'blue', value: '#017ef7', shape: 'drop', label: { th: 'สีน้ำเงิน', en: 'Blue' } },
  { id: 'purple', value: '#a556fa', shape: 'star', label: { th: 'สีม่วง', en: 'Purple' } },
  { id: 'pink', value: '#fa75af', shape: 'heart', label: { th: 'สีชมพู', en: 'Pink' } },
];

export const ART_TEXT = {
  title: { th: 'เกาะศิลปะ', en: 'Art Island' },
  choose: { th: 'เลือกรูปที่อยากระบาย', en: 'Pick a picture to color' },
  previous: { th: 'รูปก่อนหน้า', en: 'Previous pictures' },
  next: { th: 'รูปถัดไป', en: 'Next pictures' },
  colors: { th: 'เลือกสี', en: 'Pick a color' },
  back: { th: 'กลับไปเลือกรูป', en: 'Back to pictures' },
  undo: { th: 'ย้อนกลับ', en: 'Undo' },
  done: { th: 'เสร็จแล้ว', en: 'Finished' },
  finished: { th: 'สวยมากเลย!', en: 'Beautiful!' },
  again: { th: 'ระบายรูปใหม่', en: 'Color a new picture' },
  keep: { th: 'ระบายต่อ', en: 'Keep coloring' },
  example: { th: 'ภาพตัวอย่าง', en: 'Example' },
} satisfies Record<string, Text>;
