import type { GameIconName } from "@/lib/games";

// ใช้สิ่งของที่รูปทรงต่างกันชัดเจน เด็กจึงจับคู่ได้โดยไม่ต้องแยกสีอย่างเดียว
export function GameIcon({ name, className = "" }: { name: GameIconName | "sparkle" | "lock" | "check" | "back"; className?: string }) {
  return <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
    {name === "moon" && <><path d="M77 19a40 40 0 1 0 24 66A40 40 0 0 1 77 19Z" fill="var(--color-sun)" /><path d="m91 20 4 12 13 1-10 8 3 12-10-7-11 7 3-12-10-8 13-1Z" fill="var(--color-cloud)" /></>}
    {name === "lantern" && <><path d="M48 25V18a12 12 0 0 1 24 0v7M39 30h42l12 20-8 48H35l-8-48Z" fill="var(--color-sun)" /><path d="M27 50h66M44 50l5 48m27-48-5 48M31 103h58" /><path d="m60 57-8 15 8 15 8-15Z" fill="var(--color-cloud)" /></>}
    {name === "dates" && <><path d="M15 80h90c-7 24-83 24-90 0Z" fill="var(--color-sky)" /><ellipse cx="43" cy="59" rx="15" ry="25" fill="var(--color-sun)" /><ellipse cx="78" cy="57" rx="15" ry="25" fill="var(--color-sun)" /><path d="M44 44q-7 15 0 30m35-32q-7 15 0 29" /></>}
    {name === "mushaf" && <><path d="M60 31Q37 16 12 26v65q25-10 48 5 23-15 48-5V26Q83 16 60 31Z" fill="var(--color-cloud)" /><path d="M60 31v65M22 40q15-4 27 4m-27 9q15-4 27 4m-27 9q15-4 27 4m22-27q12-8 27-4M71 57q12-8 27-4M71 70q12-8 27-4" /></>}
    {name === "mat" && <><rect x="27" y="17" width="66" height="86" rx="5" fill="var(--color-game-mint)" /><path d="M38 89V52q22-13 22-24 0 11 22 24v37ZM36 10v7m16-7v7m16-7v7m16-7v7M36 103v8m16-8v8m16-8v8m16-8v8" /><path d="m60 57 9 13-9 13-9-13Z" fill="var(--color-sun)" /></>}
    {name === "jug" && <><path d="M78 39h14a20 20 0 0 1 0 40H81" /><path d="m29 24 15 18c0 16-17 31-12 49 4 17 45 17 49 0 5-18-12-33-12-49l8-18Z" fill="var(--color-sky)" /><path d="M44 42h25M40 83q18 8 34 0" /></>}
    {name === "memory" && <><rect x="12" y="17" width="58" height="76" rx="12" fill="var(--color-sun)" /><rect x="49" y="30" width="58" height="76" rx="12" fill="var(--color-cloud)" /><path d="m78 47 6 13 15 2-11 11 3 16-13-8-13 8 3-16-11-11 15-2Z" fill="var(--color-sun)" /><path d="m27 48 10 10 14-20" /></>}
    {name === "letters" && <><rect x="15" y="22" width="90" height="76" rx="16" fill="var(--color-cloud)" />{/* อะลิฟวางข้างบาอ์ ไม่วางซ้อนบนเส้นโค้ง — แบบซ้อนมีจุดกับเส้นโค้งดูคล้ายหน้ายิ้ม (ข้อ 1.1) */}<path d="M22 58q-4 20 22 20t26-20M46 90h1M88 38v44" /></>}
    {name === "maze" && <><path d="M14 105V15h45v18H34v25h22v25H34m72 22H57V83h25V59h24V15H80" /><path d="M73 45V32q10-5 10-13 0 8 10 13v13Z" fill="var(--color-sun)" /><path d="M84 45v-8" /></>}
    {name === "sparkle" && <><path d="m60 17 12 29 31 3-24 21 7 31-26-16-26 16 7-31-24-21 31-3Z" fill="var(--color-sun)" /><path d="M15 16v14M8 23h14m81 63v14m-7-7h14" /></>}
    {name === "lock" && <><rect x="27" y="51" width="66" height="52" rx="10" /><path d="M40 51V33a20 20 0 0 1 40 0v18M60 73v12" /></>}
    {name === "check" && <path d="m25 61 23 23 48-49" />}
    {name === "back" && <path d="m52 27-33 33 33 33M20 60h82" />}
  </svg>;
}
