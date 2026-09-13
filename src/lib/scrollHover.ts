/*
  แยก "ชี้เมาส์จริง" ออกจาก "เลื่อนจอแล้วของเลื่อนมาอยู่ใต้เมาส์ที่นิ่งอยู่"

  ตอนเลื่อนจอ เบราว์เซอร์ส่ง pointerenter ให้ทุกเกาะที่ไหลผ่านใต้เมาส์ เกาะเลยอ่านชื่อรัวๆ
  และตัดเสียงหัวข้อที่กำลังพูดอยู่ทิ้ง
  ใช้เวลาหลังเลื่อนจอเป็นเกณฑ์ ไม่ใช้ movementX/Y เพราะบางเบราว์เซอร์/อุปกรณ์รายงานเป็น 0
  แม้เมาส์ขยับเข้ามาจริง ถ้าใช้ movement เด็กจะชี้แล้วไม่ได้ยินชื่อเกาะ
*/
const SCROLL_HOVER_MS = 300;
let lastScrollAt = -Infinity;

if (typeof window !== "undefined") {
  // capture: จับการเลื่อนของทุก element ที่เลื่อนได้ ไม่ใช่แค่หน้า
  window.addEventListener("scroll", () => { lastScrollAt = performance.now(); }, { passive: true, capture: true });
}

/** pointerenter นี้เกิดจากการเลื่อนจอหรือเปล่า */
export function isScrollHover(): boolean {
  return performance.now() - lastScrollAt < SCROLL_HOVER_MS;
}
