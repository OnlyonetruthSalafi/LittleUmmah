import type { Text } from "@/i18n/config";

/*
  ผองเพื่อนนูรี (IMG-8 อนุมัติ 9 พ.ย. 2026 · ท่าทาง IMG-9) — ข้อมูลกลางที่เดียว ใช้ทั้งหน้าเว็บและสคริปต์อัดเสียง
  ชื่อทั้งหมดเป็นชื่อชั่วคราว เจ้าของโปรเจกต์เปลี่ยนได้ (แก้ที่นี่ แก้บทใน cartoon.ts + make-moral-cartoon-voice.mjs แล้วอัดเสียงใหม่)

  ทุกภาพใน public/Character/friends/ สเกลเดียวกับนูรี (ห้าม trim) ท่ายืน = <id>.webp, ท่าอื่น = <id>-<pose>.webp
  เพื่อนพูดด้วยคำว่า "เรา" ไม่ใช้ ครับ/ค่ะ (หุ่นยนต์ไม่ระบุเพศ)

  ตอนนี้เพื่อนอยู่สองที่: การ์ตูน "รู้จักเพื่อนใหม่" บนเกาะมารยาท (cartoon.ts "meet-friends")
  และยืนบนเมฆเหนือ Footer ข้างนูรีโบกมือ (SiteFooter.tsx — เจ้าของโปรเจกต์สั่ง 9 พ.ย. 2026)
  เจ้าของโปรเจกต์ยกเลิกการวางเพื่อนตามหน้าอื่นทั้งหมด (9 พ.ย. 2026) จะกำหนดตำแหน่งเอง — ห้ามวางเพิ่มเอง

  เสียง: เจ้าของโปรเจกต์ให้ใช้เสียง ElevenLabs คนละเสียงได้ (9 พ.ย. 2026) + ฟิลเตอร์หุ่นยนต์ชุดเดิมทุกตัว
  Claude เลือกเสียงตั้งต้น รอเจ้าของโปรเจกต์ฟังตัวอย่างใน output/friend-voice-samples/ แล้วสลับได้ที่ voiceId
*/
export type FriendId = "hadi" | "sabir" | "rassam" | "qalam" | "safi";
export type FriendPose = "stand" | "cheer" | "point" | "think" | "action";

export type Friend = {
  id: FriendId;
  name: Text;
  role: Text;
  /** สีประจำตัว ใช้ขอบป้ายชื่อผู้พูด (ตกแต่ง ชื่อเป็นข้อความเสมอ) */
  color: string;
  /** เสียง ElevenLabs ของเพื่อนตัวนี้ */
  voiceId: string;
  /** ปรับระดับเสียงเพิ่ม (semitones) ถ้าจำเป็น */
  pitch: number;
};

export const FRIENDS: Record<FriendId, Friend> = {
  // Hafiz – Energetic Cartoon Character
  hadi: { id: "hadi", name: { th: "ฮาดี", en: "Hadi" }, role: { th: "นักสำรวจ", en: "the explorer" }, color: "#0b7f7d", voiceId: "LkSPBLr5WF7APTCqF4ZJ", pitch: 0 },
  // Sigma Centauri – AI Robot (เสียงต่ำ ตัวใหญ่ที่สุดในแก๊ง)
  sabir: { id: "sabir", name: { th: "ซาบิร", en: "Sabir" }, role: { th: "นักสร้าง", en: "the builder" }, color: "#9a6200", voiceId: "bAq8AI9QURijOtmeFFqT", pitch: 0 },
  // Piku – Expressive Kid Character
  rassam: { id: "rassam", name: { th: "รอสซาม", en: "Rassam" }, role: { th: "นักวาด", en: "the painter" }, color: "#5b3fc4", voiceId: "EeQEodFZVtBkjtgK3HBc", pitch: 0 },
  // Adam – Robotic, Smooth and Calm (นักอ่านใจเย็น) ยกเสียงขึ้นเล็กน้อยให้ไม่ดูเป็นผู้ใหญ่
  // เดิมชื่อ "กอลัม" เจ้าของโปรเจกต์เปลี่ยนเป็นฟาฮีม (9 พ.ย. 2026 — ชื่อเดิมพ้องเสียงตัวร้ายในหนัง) id/ชื่อไฟล์ยังเป็น qalam
  qalam: { id: "qalam", name: { th: "ฟาฮีม", en: "Faheem" }, role: { th: "นักอ่าน", en: "the reader" }, color: "#1f6b45", voiceId: "MwQXU20wCONBtEfjFukj", pitch: 2 },
  // Teddy Twinkle – Cute Cartoon Boy ยกเสียงขึ้นให้เป็นน้องเล็ก
  safi: { id: "safi", name: { th: "ซาฟี", en: "Safi" }, role: { th: "น้องเล็ก", en: "the little one" }, color: "#1d6fae", voiceId: "XjGYkUkzth8BPs29fmcV", pitch: 2 },
};

export function friendImage(id: FriendId, pose: FriendPose = "stand") {
  return pose === "stand" ? `/Character/friends/${id}.webp` : `/Character/friends/${id}-${pose}.webp`;
}
