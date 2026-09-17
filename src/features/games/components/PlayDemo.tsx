import type { CSSProperties } from 'react';
import { HandTapIcon } from '@/components/icons/HandTapIcon';
import type { GameSlug } from '../data/catalog';

/*
  ภาพสาธิตวิธีเล่น — มือขาวขยับให้เด็กดูเป็นตัวอย่าง วางทับภาพเกาะในหน้าแนะนำเกม
  เด็กวัย 3–6 ปีอ่านไม่ออก แต่ดูมือขยับแล้วเข้าใจทันทีว่าต้องทำอะไร

  พิกัดเป็นเปอร์เซ็นต์ของภาพเกาะ public/games/hub/<slug>.webp (640×640)
  ถ้าเปลี่ยนภาพเกาะ ต้องหาพิกัดใหม่ ไม่งั้นมือจะชี้ผิดที่

  shape-match: ลากดาวทองที่ขอบเกาะ ≈ (79%, 55%) ไปลงหลุมรูปดาว ≈ (50%, 23%)
  sequence:    แตะลูกบาศก์เล็ก → กลาง → ใหญ่ ตามทางแผ่นทอง ≈ (31%, 49%) (51%, 40%) (73%, 27%)
*/
type Point = { x: number; y: number };
const DEMOS: Partial<Record<GameSlug, { variant: 'drag' | 'steps'; points: Point[] }>> = {
  'shape-match': { variant: 'drag', points: [{ x: 79, y: 55 }, { x: 50, y: 23 }] },
  sequence: { variant: 'steps', points: [{ x: 31, y: 49 }, { x: 51, y: 40 }, { x: 73, y: 27 }] },
};

export function PlayDemo({ slug }: { slug: GameSlug }) {
  const demo = DEMOS[slug];
  if (!demo) return null;
  const [from, ...rest] = demo.points;
  const to = rest[rest.length - 1];
  const d = demo.variant === 'drag'
    ? `M${from.x} ${from.y} Q ${(from.x + to.x) / 2 + 4} ${(from.y + to.y) / 2 - 10} ${to.x} ${to.y}`
    // ทางผ่านทุกจุด โค้งขึ้นเล็กน้อยระหว่างจุด ให้ดูเป็น "ขั้นต่อไป" ไม่ใช่เส้นตรงทื่อ
    : demo.points.slice(1).reduce((path, p, i) => { const q = demo.points[i]; return `${path} Q ${(q.x + p.x) / 2} ${Math.min(q.y, p.y) - 8} ${p.x} ${p.y}`; }, `M${from.x} ${from.y}`);

  return (
    <span className="gc-demo" data-variant={demo.variant} aria-hidden="true"
      style={Object.fromEntries(demo.points.flatMap((p, i) => [[`--p${i}x`, `${p.x}%`], [`--p${i}y`, `${p.y}%`]])) as CSSProperties}>
      {/* เส้นประพร้อมหัวลูกศรที่ปลายทาง viewBox 100×100 = เปอร์เซ็นต์ของภาพพอดี */}
      <svg className="gc-demo-path" viewBox="0 0 100 100">
        <defs>
          <marker id={`gc-demo-arrow-${slug}`} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="3.4" markerHeight="3.4" orient="auto-start-reverse">
            <path d="M0 0.8 L9 5 L0 9.2 Z" fill="#ffffff" stroke="#123a72" strokeWidth="1.1" strokeLinejoin="round" />
          </marker>
        </defs>
        <path d={d} fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="4 3.4"
          markerEnd={`url(#gc-demo-arrow-${slug})`} paintOrder="stroke" />
      </svg>

      {/* วงแหวนบอกตำแหน่ง: ลาก = ปลายทางจุดเดียว, แตะตามลำดับ = วงที่ทุกจุดสว่างขึ้นทีละวง */}
      {(demo.variant === 'drag' ? [to] : demo.points).map((p, i) =>
        <span key={i} className="gc-demo-target" style={{ left: `${p.x}%`, top: `${p.y}%`, '--step': i } as CSSProperties} />)}

      <span className="gc-demo-hand">
        <HandTapIcon className="gc-demo-hand-icon" />
      </span>
    </span>
  );
}
