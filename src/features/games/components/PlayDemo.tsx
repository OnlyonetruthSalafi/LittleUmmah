import { HandTapIcon } from '@/components/icons/HandTapIcon';

/*
  ภาพสาธิตวิธีเล่น — มือขาวลากรูปทรงไปลงหลุมให้เด็กดูเป็นตัวอย่าง

  วางทับภาพเกาะในหน้าแนะนำเกม แทนคำอธิบายที่เป็นตัวหนังสือ
  เด็กวัย 3–6 ปีอ่านไม่ออก แต่ดูมือขยับแล้วเข้าใจทันทีว่าต้องทำอะไร

  พิกัดเป็นเปอร์เซ็นต์ของภาพเกาะ (public/games/hub/shape-match.webp ขนาด 640×640)
  - ดาวทองที่ขอบเกาะ  ≈ (79%, 55%)
  - หลุมรูปดาวบนแผ่น  ≈ (50%, 23%)
  ถ้าเปลี่ยนภาพเกาะ ต้องหาพิกัดใหม่ ไม่งั้นมือจะลากไปผิดที่
*/

const FROM = { x: 79, y: 55 };
const TO = { x: 50, y: 23 };

export function PlayDemo() {
  return (
    <span className="gc-demo" aria-hidden="true">
      {/* เส้นทางลาก: เส้นประโค้งพร้อมหัวลูกศรที่ปลายทาง viewBox 100×100 = เปอร์เซ็นต์ของภาพพอดี */}
      <svg className="gc-demo-path" viewBox="0 0 100 100">
        <defs>
          <marker id="gc-demo-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="3.4" markerHeight="3.4" orient="auto-start-reverse">
            <path d="M0 0.8 L9 5 L0 9.2 Z" fill="#ffffff" stroke="#123a72" strokeWidth="1.1" strokeLinejoin="round" />
          </marker>
        </defs>
        <path
          d={`M${FROM.x} ${FROM.y} Q ${(FROM.x + TO.x) / 2 + 4} ${(FROM.y + TO.y) / 2 - 10} ${TO.x} ${TO.y}`}
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeDasharray="4 3.4"
          markerEnd="url(#gc-demo-arrow)"
          paintOrder="stroke"
        />
      </svg>

      {/* วงแหวนบอกตำแหน่งปลายทาง ให้เด็กเห็นว่าเป้าหมายคือหลุมนี้ */}
      <span className="gc-demo-target" style={{ left: `${TO.x}%`, top: `${TO.y}%` }} />

      <span className="gc-demo-hand">
        <HandTapIcon className="gc-demo-hand-icon" />
      </span>
    </span>
  );
}
