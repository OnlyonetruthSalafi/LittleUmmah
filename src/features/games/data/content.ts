import type { GameSlug, Label } from './catalog';
export type Visual = { kind: 'shape' | 'icon' | 'text' | 'piece'; value: string; color?: string; size?: number; index?: number; columns?: number; rows?: number };
export type Item = { id: string; label: Label; visual: Visual; target: string };
export type Target = { id: string; label: Label; visual?: Visual };
export type BoardContent = { items: Item[]; targets: Target[]; puzzle?: { columns: number; rows: number }; sequential?: boolean };
export const colors = [
  { id: 'red', th: 'แดง', en: 'Red', hex: '#ed6565', shape: 'circle' },
  { id: 'yellow', th: 'เหลือง', en: 'Yellow', hex: '#f6c64d', shape: 'star' },
  { id: 'blue', th: 'น้ำเงิน', en: 'Blue', hex: '#62aaf2', shape: 'square' },
  { id: 'green', th: 'เขียว', en: 'Green', hex: '#49c3a5', shape: 'triangle' },
];
export const shapes = [
  { id: 'circle', th: 'วงกลม', en: 'Circle' }, { id: 'square', th: 'สี่เหลี่ยมจัตุรัส', en: 'Square' },
  { id: 'triangle', th: 'สามเหลี่ยม', en: 'Triangle' }, { id: 'rectangle', th: 'สี่เหลี่ยมผืนผ้า', en: 'Rectangle' }, { id: 'star', th: 'ดาว', en: 'Star' },
];
export const arabicLetters = ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'];
export const symbols = [
  { id: 'moon', th: 'จันทร์เสี้ยว', en: 'Crescent' }, { id: 'sparkle', th: 'ดาว', en: 'Star' },
  { id: 'mushaf', th: 'มุศฮัฟ', en: 'Quran book' }, { id: 'lantern', th: 'โคมไฟ', en: 'Lantern' },
  { id: 'jug', th: 'เหยือก', en: 'Jug' }, { id: 'mat', th: 'เสื่อละหมาด', en: 'Prayer mat' },
  { id: 'letters', th: 'บล็อกอักษร', en: 'Letter block' }, { id: 'maze', th: 'เขาวงกต', en: 'Maze' },
] as const;
export const findScenes = [[0, 1, 2, 3], [0, 1, 2, 3, 4, 5], [0, 1, 2, 3, 4, 5, 6, 7]];
export function boardContent(slug: GameSlug, level: number): BoardContent {
  if (slug === 'puzzle') {
    const columns = level === 1 ? 2 : 3;
    const rows = level === 3 ? 3 : 2;
    const items: Item[] = Array.from({ length: columns * rows }, (_, index) => ({ id: `piece-${index}`, target: `slot-${index}`, label: { th: `ชิ้นภาพ ${index + 1}`, en: `Piece ${index + 1}` }, visual: { kind: 'piece', value: '', index, columns, rows } }));
    return { items, targets: items.map((item, i) => ({ id: item.target, label: { th: `ช่อง ${i + 1}`, en: `Slot ${i + 1}` }, visual: item.visual })), puzzle: { columns, rows } };
  }
  if (slug === 'sequence') {
    const count = level === 1 ? 4 : level === 2 ? 3 : 6;
    const items: Item[] = Array.from({ length: count }, (_, i) => ({ id: `order-${i}`, target: `slot-${i}`, label: level === 2 ? [{ th: 'เล็ก', en: 'Small' }, { th: 'กลาง', en: 'Medium' }, { th: 'ใหญ่', en: 'Large' }][i] : { th: `เลข ${i + 1}`, en: `Number ${i + 1}` }, visual: level === 2 ? { kind: 'shape', value: 'square', color: '#62aaf2', size: 0.4 + i * 0.3 } : { kind: 'text', value: `${i + 1}` } }));
    return { items, targets: items.map((item, i) => ({ id: item.target, label: { th: `ช่อง ${i + 1}`, en: `Position ${i + 1}` } })), sequential: true };
  }
  if (slug === 'arabic-match') {
    const letters = arabicLetters.slice(level === 1 ? 0 : level === 2 ? 3 : 0, level === 1 ? 3 : 7);
    const targets: Target[] = letters.map(value => ({ id: value, label: { th: `อักษร ${value}`, en: `Letter ${value}` }, visual: { kind: 'text', value } }));
    return { targets, items: targets.map(t => ({ ...t, target: t.id, visual: t.visual! })) };
  }
  if (slug === 'sort' && level === 3) {
    const sizes = [{ th: 'เล็ก', en: 'Small' }, { th: 'ใหญ่', en: 'Large' }];
    return { targets: sizes.map((label, i) => ({ id: `size-${i}`, label, visual: { kind: 'shape', value: 'square', size: i ? 1 : 0.45, color: '#62aaf2' } })), items: Array.from({ length: 6 }, (_, i) => ({ id: `size-item-${i}`, target: `size-${i % 2}`, label: sizes[i % 2], visual: { kind: 'shape', value: shapes[i % 3].id, color: colors[i % 4].hex, size: i % 2 ? 1 : 0.45 } })) };
  }
  if (slug === 'shape-match' || (slug === 'sort' && level === 2)) {
    const selected = shapes.slice(0, slug === 'sort' ? 3 : level === 1 ? 3 : 5);
    const targets: Target[] = selected.map(s => ({ id: s.id, label: { th: s.th, en: s.en }, visual: { kind: 'shape', value: s.id, color: '#c9dfed' } }));
    return { targets, items: Array.from({ length: slug === 'sort' ? 6 : 5 }, (_, i) => ({ id: `shape-${i}`, target: selected[i % selected.length].id, label: targets[i % selected.length].label, visual: { kind: 'shape', value: selected[i % selected.length].id, color: colors[i % 4].hex } })) };
  }
  const selected = colors.slice(0, slug === 'color-match' ? 4 : level === 1 ? 3 : 4);
  return { targets: selected.map(c => ({ id: c.id, label: { th: c.th, en: c.en }, visual: { kind: 'shape', value: c.shape, color: c.hex } })), items: Array.from({ length: slug === 'sort' ? 6 : 5 }, (_, i) => { const c = selected[i % selected.length]; return { id: `color-${i}`, target: c.id, label: { th: c.th, en: c.en }, visual: { kind: 'shape', value: c.shape, color: c.hex } }; }) };
}
