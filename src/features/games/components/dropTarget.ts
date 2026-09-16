import { nearestDropTarget } from '../engine/rules';

/** หาช่องปลายทางจากจุดบนจอที่เด็กปล่อยนิ้วหรือแตะลงไป
 *
 * ใช้ `elementsFromPoint` (ดูทุกชั้นที่จุดนั้น) แทน `elementFromPoint` ที่ให้แต่ชั้นบนสุด
 * แล้วเลือกช่องที่จุดศูนย์กลางใกล้จุดนั้นที่สุด ดูเหตุผลที่ `nearestDropTarget`
 *
 * คิดรวมช่องที่ปิดอยู่ (หยอดแล้ว) ในการเทียบระยะด้วย แล้วค่อยให้ผู้เรียกปฏิเสธทีหลัง
 * ถ้าตัดทิ้งตั้งแต่แรก การปล่อยกลางช่องที่หยอดแล้วจะไหลไปเข้าช่องข้างๆ กลายเป็นตอบผิดทั้งที่เด็กไม่ได้เล็งช่องนั้น
 */
export function dropTargetAt(x: number, y: number): HTMLElement | null {
  const candidates: { element: HTMLElement; cx: number; cy: number; rx: number; ry: number }[] = [];
  for (const hit of document.elementsFromPoint(x, y)) {
    const element = hit.closest<HTMLElement>('[data-drop-id]');
    if (!element || candidates.some(candidate => candidate.element === element)) continue;
    const box = element.getBoundingClientRect();
    candidates.push({ element, cx: box.left + box.width / 2, cy: box.top + box.height / 2, rx: box.width / 2, ry: box.height / 2 });
  }
  return nearestDropTarget(x, y, candidates)?.element ?? null;
}
