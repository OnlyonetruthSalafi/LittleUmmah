/*
  เต็มจอ + ล็อกแนวนอน ตอนเด็กกดเล่นบนจอสัมผัส (เจ้าของโปรเจกต์สั่ง 4 ต.ค. 2026)
  - เรียกได้เฉพาะใน event ที่ผู้ใช้กด เบราว์เซอร์ไม่ยอมให้เต็มจอเอง
  - PC (เมาส์) ไม่ทำอะไร หน้าเกมบน PC คงเดิม
  - iPhone ไม่มี Fullscreen API สำหรับหน้าเว็บ → ข้ามเงียบๆ ใช้ layout แนวนอนจาก CSS อย่างเดียว
  - iPad เต็มจอได้แต่ล็อกแนวนอนไม่ได้ / Android ได้ทั้งสองอย่าง
*/
type FullscreenDoc = Document & { webkitFullscreenElement?: Element | null; webkitExitFullscreen?: () => Promise<void> | void };
type FullscreenEl = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };
type LockableOrientation = ScreenOrientation & { lock?: (orientation: 'landscape') => Promise<void> };

const isTouch = () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
const fullscreenElement = () => { const doc = document as FullscreenDoc; return doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null; };

const requestOf = () => { const root = document.documentElement as FullscreenEl; return root.requestFullscreen?.bind(root) ?? root.webkitRequestFullscreen?.bind(root); };

export const canEnterFullscreen = () => isTouch() && !!requestOf();

export function enterGameFullscreen() {
  if (!isTouch() || fullscreenElement()) return;
  const request = requestOf();
  if (!request) return;
  Promise.resolve(request({ navigationUI: 'hide' } as FullscreenOptions))
    // ล็อกได้หลังเต็มจอแล้วเท่านั้น ถ้าเครื่องไม่รองรับก็ปล่อยให้เด็กหมุนเอง
    .then(() => (screen.orientation as LockableOrientation | undefined)?.lock?.('landscape'))
    .catch(() => {});
}

// แตะการ์ดเกมเต็มจอตั้งแต่หน้ารวมเกม ส่วน StrictMode ถอด/ใส่ effect ทันทีตอนเข้าหน้าเกม
// จึงเลื่อนการออกไปรอบถัดไป ถ้า GameShell ยังอยู่จะยกเลิกทันใน keepGameFullscreen
let exitTimer: ReturnType<typeof setTimeout> | undefined;
export function keepGameFullscreen() { clearTimeout(exitTimer); }

export function exitGameFullscreen() {
  clearTimeout(exitTimer);
  exitTimer = setTimeout(() => {
    if (!fullscreenElement()) return;
    try { screen.orientation?.unlock?.(); } catch {}
    const doc = document as FullscreenDoc;
    Promise.resolve((doc.exitFullscreen?.bind(doc) ?? doc.webkitExitFullscreen?.bind(doc))?.()).catch(() => {});
  });
}
