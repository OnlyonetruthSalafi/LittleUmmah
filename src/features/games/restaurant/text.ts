import type { Text } from '@/i18n/config';

export const lunch = {
  title: { th: 'ร้านอาหารริมทะเล', en: 'Seaside Restaurant' },
  scene: { th: 'โต๊ะอาหารริมทะเล เพื่อนนั่งอยู่ฝั่งตรงข้าม พนักงานหุ่นยนต์ยืนอยู่ข้างครัว', en: 'A seaside table. Your friends sit across from you and the waiter robot stands by the kitchen.' },
  menu: { th: 'เมนูอาหาร', en: 'Menu' },
  money: (n: number): Text => ({ th: `เงินค่าอาหาร ${n} เหรียญ`, en: `Lunch money: ${n} coins` }),
  spent: (n: number, budget: number): Text => n > budget
    ? { th: `เลือกไว้ ${n} เหรียญ เกินเงินที่มี ${n - budget} เหรียญ`, en: `Chosen: ${n} coins, ${n - budget} too many` }
    : { th: `เลือกไว้ ${n} เหรียญ เหลือ ${budget - n} เหรียญ`, en: `Chosen: ${n} coins, ${budget - n} left` },
  ask: { th: 'แตะเพื่อนแต่ละคนเพื่อถามว่าอยากกินอะไร', en: 'Tap each friend to ask what they want' },
  pick: { th: 'ลากจานจากเมนูไปวางที่ที่นั่งของเพื่อน หรือแตะจานแล้วแตะที่นั่ง', en: 'Drag a dish to a friend’s place, or tap a dish then a place' },
  order: { th: 'สั่งอาหาร', en: 'Order' },
  cooking: { th: 'พนักงานกำลังนำอาหารมา', en: 'Your food is coming' },
  tasting: { th: 'เพื่อนกำลังชิมอาหาร', en: 'Your friends are tasting' },
  fix: { th: 'มีเพื่อนที่ยังไม่ได้อาหารที่อยากกิน เลือกจานใหม่ให้นะ', en: 'Someone didn’t get what they wanted. Choose again.' },
  done: (n: number): Text => ({ th: `ทุกคนอิ่มอร่อย ได้ ${n} เหรียญเข้าลิ้นชักร้าน`, en: `Everyone is happy! ${n} coins for your shop` }),
  ask1: (name: Text): Text => ({ th: `ถาม${name.th}ว่าอยากกินอะไร`, en: `Ask ${name.en} what they want` }),
  place: (name: Text): Text => ({ th: `ที่นั่งของ${name.th}`, en: `${name.en}’s place` }),
  empty: { th: 'ยังไม่มีจาน', en: 'no dish yet' },
  price: (n: number): Text => ({ th: `${n} เหรียญ`, en: `${n} coins` }),
  hot: { th: 'ร้อน', en: 'Hot' }, cold: { th: 'เย็น', en: 'Cold' }, spicy: { th: 'เผ็ด', en: 'Spicy' }, mild: { th: 'ไม่เผ็ด', en: 'Not spicy' },
  big: { th: 'จานใหญ่', en: 'Big plate' }, small: { th: 'จานเล็ก', en: 'Small plate' },
  has: (name: Text): Text => ({ th: `มี${name.th}`, en: `With ${name.en.toLowerCase()}` }),
  backMap: { th: 'กลับแผนที่', en: 'Island map' },
  chosen: (dish: Text): Text => ({ th: `เลือก${dish.th}แล้ว แตะที่นั่งของเพื่อน`, en: `${dish.en} picked. Tap a friend’s place.` }),
};
