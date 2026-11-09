/*
  ภาพการ์ดบท "รู้จักเพื่อนใหม่" (เกาะมารยาท) — ประกอบจากภาพที่อนุมัติแล้วเท่านั้น ไม่สร้างภาพใหม่
  พื้น = public/moral/scenes/class.webp · ครูนูรี = public/moral/guide/wave-1.webp · เพื่อน = public/Character/friends/<id>-cheer.png
    node scripts/make-meet-friends-card.mjs  ->  public/moral/card-meet-friends.png แล้วรัน optimize-images.mjs public/moral
*/
import sharp from "sharp";

const W = 1024, H = 768;
const bg = await sharp("public/moral/scenes/class.webp").resize(W, H, { fit: "cover", position: "left" }).toBuffer();
const put = async (src, size, left, top) => ({ input: await sharp(src).resize(size, size).toBuffer(), left, top });
// แถวหลัง: ฮาดี ฟาฮีม รอสซาม · แถวหน้า: ซาบิร ซาฟี · นูรีขวาสุดตัวใหญ่ (ภาพสเกลเดียวกัน ฐานหุ่นอยู่ราว 92% ของภาพ)
const layers = [
  await put("public/Character/friends/hadi-cheer.png", 330, 20, 300),
  await put("public/Character/friends/qalam-cheer.png", 330, 230, 290),
  await put("public/Character/friends/rassam-cheer.png", 330, 440, 345),
  await put("public/Character/friends/sabir-cheer.png", 360, 90, 420),
  await put("public/Character/friends/safi-cheer.png", 280, 400, 470),
  await put("public/moral/guide/wave-1.webp", 440, 600, 340),
];
await sharp(bg).composite(layers).png().toFile("public/moral/card-meet-friends.png");
console.log("public/moral/card-meet-friends.png");
