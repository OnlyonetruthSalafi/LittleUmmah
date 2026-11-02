import type { Text } from '@/i18n/config';

/*
  รูประบายสี: สิ่งของและพืชเท่านั้น ไม่มีคนหรือสัตว์เลยแม้ใบหน้าว่าง และไม่มีใบหน้าบนดวงจันทร์ ดวงอาทิตย์ หรือสิ่งของ (ข้อ 1.1)
  ทุกรูปใช้ viewBox 400×300 วาดตามลำดับใน regions ชิ้นแรกคือพื้นหลัง
  SVG paths ใช้เป็นเส้นรูปและหน้ากาก canvas ระบายสีด้วยพู่กันใน paint.ts
*/
export type ArtRegion = { id: string; d: string; label: Text; thin?: boolean };
export type ArtPicture = { id: string; title: Text; regions: ArtRegion[]; lines?: string };
export type ArtColor = { id: string; value: string; label: Text; shape: 'diamond' | 'hexagon' | 'triangle' | 'square' | 'circle' | 'drop' | 'star' | 'heart' };

const BACKGROUND = 'M0 0H400V300H0Z';
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
} satisfies Record<string, Text>;
