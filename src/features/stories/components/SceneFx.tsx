import type { SceneFx as Fx, StoryPage } from "../types";

/*
  ฉากเคลื่อนไหวซ้อนบนภาพหน้าคู่ (หนังสือแบบอลังการ)

  ขยับแค่สิ่งไม่มีชีวิต — ประกายน้ำ เมฆ ฝน ฟองอากาศ ลำแสง ฝุ่นละอองในแสง (ข้อ 1.1)
  เคลื่อนช้า ความต่างสีต่ำ ไม่กระพริบ (ข้อ 2.1) ปิดการเคลื่อนไหวแล้วซ่อนทั้งชั้น (story.css)
  ตำแหน่ง/ขนาดอนุภาคคงที่ (ไม่สุ่มตอน render) server กับ client จึงได้ HTML ตรงกัน
*/

/** ลำดับเลขกึ่งสุ่มที่คงที่ ให้อนุภาคกระจายตัวดูเป็นธรรมชาติ */
const spread = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

function Bubbles({ count, from = 0, to = 100 }: { count: number; from?: number; to?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const size = 6 + spread(i, 1) * 16;
        return (
          <span
            key={i}
            className="fx-bubble"
            style={{
              left: `${from + spread(i, 2) * (to - from)}%`,
              width: size,
              height: size,
              animationDuration: `${7 + spread(i, 3) * 6}s`,
              animationDelay: `${-spread(i, 4) * 12}s`,
            }}
          />
        );
      })}
    </>
  );
}

function Motes({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="fx-mote"
          style={{
            left: `${spread(i, 5) * 100}%`,
            top: `${10 + spread(i, 6) * 70}%`,
            animationDuration: `${9 + spread(i, 7) * 8}s`,
            animationDelay: `${-spread(i, 8) * 15}s`,
          }}
        />
      ))}
    </>
  );
}

/**
  ฝนเป็นเม็ดแยกกัน ยาว ความเร็ว ความสว่างต่างกันทุกเม็ด
  (ฝนแบบเดิมเป็นลายไล่สีซ้ำเป็นตาราง เห็นเป็นเส้นประเรียงแถวเท่ากันหมด เจ้าของโปรเจกต์ขอแก้ 7 ต.ค. 2026)
*/
function Rain({ count, far = false }: { count: number; far?: boolean }) {
  const salt = far ? 20 : 10;
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="fx-drop"
          data-far={far || undefined}
          style={{
            left: `${-4 + spread(i, salt) * 116}%`,
            height: `${(far ? 1.6 : 2.6) + spread(i, salt + 1) * (far ? 1.6 : 3)}cqw`,
            opacity: (far ? 0.25 : 0.4) + spread(i, salt + 2) * 0.35,
            animationDuration: `${(far ? 0.9 : 0.55) + spread(i, salt + 3) * 0.35}s`,
            animationDelay: `${-spread(i, salt + 4) * 2}s`,
          }}
        />
      ))}
    </>
  );
}

/**
  เงาปลาใหญ่ทั้งตัว เป็นเงาทึบเรียบ ไม่มีตา ปาก เหงือก หรือลายใดๆ ที่ทำหน้าที่เป็นใบหน้า (ข้อ 1.1)
  อยู่นอกชั้น .sb-fx จึงยังเห็นเมื่อปิดการเคลื่อนไหว (แค่ไม่ว่ายช้าๆ)
*/
export function FishShadow({ fish }: { fish: NonNullable<StoryPage["fish"]> }) {
  const [left, top, width] = fish.at;
  return (
    <div className="sb-fx-still" aria-hidden="true">
      <div
        className="fx-fish"
        data-deep={fish.deep || undefined}
        style={{ left: `${left}%`, top: `${top}%`, width: `${width}%` }}
      >
        <svg viewBox="0 0 400 160" style={fish.flip ? { transform: "scaleX(-1)" } : undefined}>
          <path d="M12 84C18 56 64 34 140 32c26-1 48 0 70 4 6-16 22-30 46-30-6 12-8 24-4 38 24 8 44 18 64 30 20-18 44-34 76-44-14 26-22 46-24 66 2 20 10 40 24 66-32-10-56-26-76-44-30 18-66 30-110 36-24 3-44 2-62 0-6 10-16 22-34 28 2-12 2-22-2-30C40 124 16 106 12 84z" />
        </svg>
      </div>
    </div>
  );
}

const Clouds = () => (
  <>
    <span className="fx-cloud" style={{ top: "4%", left: "8%", animationDuration: "38s" }} />
    <span className="fx-cloud" style={{ top: "12%", left: "52%", animationDuration: "46s", animationDelay: "-20s" }} />
    <span className="fx-cloud" style={{ top: "1%", left: "74%", animationDuration: "52s", animationDelay: "-9s" }} />
  </>
);

const at = (p?: [number, number]) => (p ? { left: `${p[0]}%`, top: `${p[1]}%` } : undefined);

export function SceneFx({
  fx,
  water,
  moon,
  lamp,
}: {
  fx: Fx;
  water?: [number, number, number, number];
  moon?: [number, number] | null;
  lamp?: [number, number] | null;
}) {
  return (
    <div className="sb-fx" data-fx={fx} aria-hidden="true">
      {(fx === "clouds" || fx === "harbor" || fx === "town" || fx === "dust") && <Clouds />}
      {fx === "dust" && <Motes count={22} />}
      {water && (
        <span
          className="fx-glints"
          style={{ left: `${water[0]}%`, top: `${water[1]}%`, width: `${water[2]}%`, height: `${water[3]}%` }}
        />
      )}
      {fx === "storm" && (
        <>
          <Rain count={60} far />
          <Rain count={42} />
          <span className="fx-spray" />
        </>
      )}
      {fx === "whirl" && (
        <>
          <span className="fx-whirl" />
          <Rain count={30} far />
          <Bubbles count={8} from={14} to={36} />
        </>
      )}
      {fx === "deep" && (
        <>
          <span className="fx-glow" />
          <Bubbles count={10} from={25} to={33} />
        </>
      )}
      {fx === "rays" && (
        <>
          <span className="fx-rays" />
          <Bubbles count={14} />
        </>
      )}
      {(fx === "dawn" || fx === "shade") && <Motes count={14} />}
      {fx === "shade" && <span className="fx-dapple" />}
      {fx === "night" && (
        <>
          {moon !== null && <span className="fx-moon" style={at(moon)} />}
          {lamp !== null && <span className="fx-lamp" style={at(lamp)} />}
        </>
      )}
    </div>
  );
}
