import type { Text } from '@/i18n/config';
export const VOICE_LINES = {
  'ls-earned': { th: 'เก่งมากจ้ะ ได้ดาวเรียนรู้เพิ่มหนึ่งดวงแล้ว', en: 'Well done! You earned one Learning Star.' },
  'ls-empty': { th: 'ดาวเรียนรู้หมดแล้วจ้ะ ไปเรียนที่เกาะเรียนรู้กับครู เก็บดาวแล้วกลับมาเล่นกันนะ', en: 'Your Learning Stars are used up. Come learn with me on a learning island, collect stars, then come back to play.' },
  'ls-free': { th: 'วันนี้เล่นฟรีได้หนึ่งด่านนะจ๊ะ', en: 'Today you can play one level for free.' },
  'time-warn': { th: 'อีกสองนาทีจะหมดเวลาเล่นแล้วนะจ๊ะ เล่นด่านนี้ให้จบก่อนนะ', en: "Two more minutes of play time. Let's finish this level." },
  'time-up': { th: 'หมดเวลาเล่นแล้วจ้ะ ไปบอกคุณพ่อคุณแม่ให้ช่วยปลดล็อก หรือไปเรียนที่เกาะเรียนรู้กับครูกันนะ', en: 'Play time is over. Ask your parents to unlock it, or come learn with me on a learning island.' },
  'unlocked': { th: 'คุณพ่อคุณแม่ปลดล็อกให้แล้ว เล่นต่อได้เลยจ้ะ', en: 'Your parents unlocked it. You can keep playing!' },
  'ls-last': { th: 'ดาวดวงสุดท้ายแล้วนะจ๊ะ เล่นด่านนี้จบแล้ว ไปเรียนเก็บดาวที่เกาะเรียนรู้ก่อนนะ', en: 'This is your last star. After this level, go learn on a learning island to collect more.' },
} satisfies Record<string, Text>;
export const LS = {
  "name": {
    "th": "ดาวเรียนรู้",
    "en": "Learning Stars"
  },
  "earned": {
    "th": "ได้ดาวเรียนรู้ +1",
    "en": "Learning Star +1"
  },
  "full": {
    "th": "ดาวเต็มแล้ว",
    "en": "Your stars are full"
  },
  "free": {
    "th": "รอบนี้ฟรีวันนี้",
    "en": "This round is free today"
  },
  "star": {
    "th": "รอบนี้ใช้ 1 ดาว",
    "en": "This round uses 1 star"
  },
  "credit": {
    "th": "มีเครดิตรอบเล่นอยู่แล้ว",
    "en": "You already have a round credit"
  },
  "unlimited": {
    "th": "เล่นได้ไม่จำกัดดาว",
    "en": "Unlimited rounds"
  },
  "empty": {
    "th": "ดาวเรียนรู้หมดแล้ว",
    "en": "Out of Learning Stars"
  },
  "time": {
    "th": "หมดเวลาเล่นแล้ว",
    "en": "Play time is over"
  },
  "warn": {
    "th": "เหลือเวลาเล่นอีก 2 นาที เล่นด่านนี้ให้จบก่อนนะ",
    "en": "2 minutes left. Finish this level."
  },
  "learn": {
    "th": "ไปเรียนเก็บดาว",
    "en": "Go learn to collect stars"
  },
  "parents": {
    "th": "สำหรับผู้ปกครอง",
    "en": "For parents"
  },
  "settings": {
    "th": "ตั้งค่า",
    "en": "Settings"
  },
  "evidence": {
    "th": "แนวทางเนื้อหาและหลักฐาน",
    "en": "Content guidelines and evidence"
  },
  "allEvidence": {
    "th": "ดูหลักฐานทั้งหมด",
    "en": "Read all evidence"
  },
  "addOne": {
    "th": "ให้ดาว +1",
    "en": "Give +1 star"
  },
  "addThree": {
    "th": "ให้ดาว +3",
    "en": "Give +3 stars"
  },
  "add15": {
    "th": "เพิ่ม 15 นาที",
    "en": "Add 15 minutes"
  },
  "add30": {
    "th": "เพิ่ม 30 นาที",
    "en": "Add 30 minutes"
  },
  "day": {
    "th": "ไม่จำกัดถึงพรุ่งนี้",
    "en": "Unlimited until tomorrow"
  },
  "timeSettings": {
    "th": "จำกัดเวลาเล่น",
    "en": "Play time limit"
  },
  "sound": {
    "th": "เสียง",
    "en": "Sound"
  },
  "on": {
    "th": "เปิด",
    "en": "On"
  },
  "off": {
    "th": "ปิด",
    "en": "Off"
  },
  "minutes": {
    "th": "นาทีต่อวัน",
    "en": "Minutes per day"
  },
  "used": {
    "th": "ใช้ไปวันนี้ (นาที)",
    "en": "Used today (minutes)"
  },
  "resetTime": {
    "th": "รีเซ็ตเวลาวันนี้",
    "en": "Reset today?s time"
  },
  "rules": {
    "th": "เรียนจบ 1 บท ได้ 1 ดาว วันละครั้งต่อบท เก็บได้สูงสุด 20 ดาว เล่นฟรีวันละ 1 รอบ จากนั้นใช้ 1 ดาวต่อรอบจนกว่าจะผ่านหนึ่งด่าน ออกแล้วกลับมาเล่นต่อได้",
    "en": "Complete a lesson for 1 star, once per lesson per day, up to 20. One free round daily, then 1 star per round until you pass a level. You can leave and return to the same credit."
  },
  "timeRules": {
    "th": "นับเฉพาะเกาะเกมและศิลปะขณะหน้าจอแสดงอยู่ บทเรียนไม่ถูกล็อก เมื่อครบเวลา ให้จบด่านที่กำลังเล่นหรือผ่อนสูงสุด 5 นาที ศิลปะหยุดทันที",
    "en": "Counts only Games and Art while visible. Lessons stay available. At the limit, finish the current level or take up to 5 extra minutes. Art stops immediately."
  },
  "device": {
    "th": "การตั้งค่านี้ใช้เฉพาะเบราว์เซอร์นี้ในเครื่องนี้ เด็กโตอาจเลี่ยงได้ด้วยการล้างข้อมูลเบราว์เซอร์",
    "en": "These settings apply only to this browser on this device. Older children may bypass them by clearing browser data."
  },
  "gateTitle": {
    "th": "ให้ผู้ปกครองช่วยตอบ",
    "en": "Ask a parent to answer"
  },
  "answer": {
    "th": "คำตอบเป็นตัวเลข",
    "en": "Answer in numbers"
  },
  "submit": {
    "th": "ยืนยัน",
    "en": "Confirm"
  },
  "cancel": {
    "th": "กลับ",
    "en": "Back"
  },
  "wrong": {
    "th": "ยังไม่ถูก ลองคำถามใหม่",
    "en": "Not quite. Try the new question."
  },
  "times": {
    "th": "คูณ",
    "en": "times"
  },
  "storage": {
    "th": "บันทึกข้อมูลไม่ได้ ขณะนี้เล่นได้ไม่จำกัด",
    "en": "Storage is unavailable. Play is unlimited."
  },
  "emptyHelp": {
    "th": "ไปเรียนที่เกาะเรียนรู้เพื่อเก็บดาวก่อน แล้วกลับมาเล่นนะ",
    "en": "Go learn on a learning island to collect stars first, then come back to play."
  },
  "last": {
    "th": "ดาวดวงสุดท้ายแล้ว เล่นจบด่านนี้ ไปเรียนเก็บดาวก่อนนะ",
    "en": "This is your last star. After this level, go learn to collect more."
  },
  "hubEmpty": {
    "th": "ต้องไปเรียนเก็บดาวก่อนนะ",
    "en": "Go learn to collect stars first"
  },
  "hubOne": {
    "th": "เหลือดาว 1 ดวง",
    "en": "1 star left"
  },
  "timeLearn": {
    "th": "ไปเกาะเรียนรู้",
    "en": "Go to a learning island"
  },
  "timeHelp": {
    "th": "ขอให้ผู้ปกครองช่วยปลดล็อก หรือไปเรียนกับครูนูรีกันนะ",
    "en": "Ask a parent to unlock, or learn with Nuri."
  },
  "tips": {
    "th": "ชวนลูกเรียนก่อนเล่นเพื่อเก็บดาวเรียนรู้ ตั้งค่าเวลาเกาะเกมและศิลปะได้ตามที่ครอบครัวตกลงกัน และไปเกาะเรียนรู้ต่อได้เมื่อครบเวลา",
    "en": "Encourage learning before play to collect Learning Stars. Agree on time for Games and Art as a family. Learning islands remain available when time is up."
  }
} satisfies Record<string, Text>;
