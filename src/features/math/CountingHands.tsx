import Image from "next/image";
import "./hands.css";

/*
  สองมือนับนิ้ว — ภาพ 3D มือขวาเด็กมุมฝ่ามือ 6 ท่า (Codex gpt-6-astra, docs/briefs/MATH-HANDS-2.md, ต้นทาง output/math-hands-v2/)
  เจ้าของสั่ง 18 พ.ย. 2026: หงายมือเข้าหาตัว โป้งอยู่นอกสุด โป้งสั้นตามจริง (ชุด SVG เดิมโป้งยาวจนน่ากลัว)
  ลำดับ: มือขวา โป้ง→ก้อย = 1–5 แล้วมือซ้าย โป้ง→ก้อย = 6–10 · มือซ้าย = ภาพมือขวากลับด้าน (CSS)
  ภาพ hand-n = ชูนิ้ว n นิ้วเรียงจากโป้ง · ซ้อนทั้ง 6 ภาพแล้วสลับความทึบ เปลี่ยนท่าโดยไม่โหลดใหม่และฝ่ามือไม่กระโดด
*/
const POSES = [0, 1, 2, 3, 4, 5];

function Hand({ side, up }: { side: "left" | "right"; up: number }) {
  return (
    <span className="num-hand" data-side={side}>
      {POSES.map((pose) => (
        <Image key={pose} src={`/math/hands/hand-${pose}.webp`} alt="" width={400} height={480} loading="eager"
          sizes="(max-width: 480px) 40vw, 200px" className={`num-hand-pose${pose === up ? " num-hand-on" : ""}`} />
      ))}
    </span>
  );
}

export function CountingHands({ up }: { up: number }) {
  const count = Number.isFinite(up) ? Math.min(10, Math.max(0, Math.floor(up))) : 0;
  return (
    <div className="num-hands" aria-hidden="true">
      <Hand side="left" up={Math.max(0, count - 5)} />
      <Hand side="right" up={Math.min(5, count)} />
    </div>
  );
}
