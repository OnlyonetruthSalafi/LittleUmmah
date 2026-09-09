/*
  ที่เก็บสถานะเปิด/ปิดเสียงนอก React

  ใช้คู่กับ useSyncExternalStore แทนการ setState ใน effect
  เพราะ localStorage อ่านตอนเรนเดอร์ฝั่งเซิร์ฟเวอร์ไม่ได้
  ถ้าอ่านตรงๆ ใน useState จะได้ HTML คนละแบบกับฝั่งไคลเอนต์
*/

const STORAGE_KEY = "little-ummah:sound";

const listeners = new Set<() => void>();
let cached: boolean | null = null;

function readFromStorage(): boolean {
  try {
    // ค่าเริ่มต้นคือเปิดเสียง เด็กเล็กคือผู้ใช้หลักและยังอ่านไม่ออก
    return window.localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    // โหมดส่วนตัวของบางเบราว์เซอร์ห้ามแตะ localStorage
    return true;
  }
}

export function subscribeSound(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

export function getSoundSnapshot(): boolean {
  cached ??= readFromStorage();
  return cached;
}

/** ฝั่งเซิร์ฟเวอร์ยังไม่รู้ค่าที่ผู้ใช้เลือกไว้ จึงเรนเดอร์เป็นเปิดเสียงเสมอ */
export function getSoundServerSnapshot(): boolean {
  return true;
}

export function setSoundEnabled(next: boolean) {
  cached = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
  } catch {
    // เก็บค่าไม่ได้ก็ยังใช้งานได้ในหน้านี้
  }
  for (const listener of listeners) listener();
}
