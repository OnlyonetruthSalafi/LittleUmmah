import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import test from 'node:test';
import { getIslandContent } from '../src/lib/lessons.ts';

/*
  ห้องเรียนหุ่นยนต์ เกาะภาษาอาหรับ (/learn/arabic)

  จุดที่พังแล้วเงียบที่สุดคือ "ไฟล์เสียงครูหาย" — บทเรียนจะไม่ค้าง เพราะมีตัวจับเวลาสำรอง
  เด็กจึงเห็นครูยืนเฉยๆ แล้วบทวิ่งผ่านไปโดยไม่มีใครรู้ว่าเสียงหายไป
  เทสต์นี้ตรวจว่าทุกบทมีไฟล์เสียงอยู่จริงในโฟลเดอร์ ไม่ใช่แค่มีชื่อ key ในโค้ด

  ไม่ import ตัว classroom.ts เพราะไฟล์นั้นใช้ alias "@/" ซึ่ง node ล้วนไม่รู้จัก
  ข้อมูลต้นทางเป็นชุดเดียวกัน (ISLAND_CONTENT) จึงตรวจจากที่นี่ได้ผลเท่ากัน
*/

const CHEER_COUNT = 3;
const clip = name => `public/audio/class/${name}.mp3`;
const island = getIslandContent('arabic');
const steps = [...island.kids, ...island.juniors];
const classroomSource = readFileSync('src/features/arabic/data/classroom.ts', 'utf8');

test('ทุกบทเรียนมีข้อความอาหรับสำหรับเขียนบนกระดาน', () => {
  for (const lesson of steps) {
    const board = lesson.glyph ?? lesson.arabic ?? '';
    assert.ok(board.trim().length > 0, `${lesson.id} ต้องมีตัวอักษรหรือวลีอาหรับให้ขึ้นกระดาน`);
  }
});

test('ทุกบทเรียนมีคำอ่านไทยให้เด็กอ่านตาม', () => {
  for (const lesson of steps) {
    const match = classroomSource.match(new RegExp(`\\n\\s*${lesson.id}:\\s*"([^"]+)"`));
    assert.ok(match, `${lesson.id} ต้องมีคำอ่านตามในตาราง SAY ของ classroom.ts`);
    // ต้องเป็นคำอ่านภาษาไทย ไม่ใช่ตัวอาหรับ เพราะเป็นข้อความสำรองที่ส่งให้เสียงสังเคราะห์ไทยอ่าน
    assert.ok(!/[؀-ۿ]/.test(match[1]), `${lesson.id}: คำอ่านตามต้องไม่ใช่ตัวอาหรับ`);
  }
});

test('ไฟล์เสียงครูมีครบทุกบท ทุกคำชม และเสียงจบคาบ', () => {
  const names = steps.flatMap(lesson => [`teach-${lesson.id}`, `say-${lesson.id}`]);
  for (let i = 1; i <= CHEER_COUNT; i += 1) names.push(`cheer-${i}`);
  names.push('done');

  for (const name of new Set(names)) {
    assert.ok(existsSync(clip(name)), `ไม่มีไฟล์เสียง ${clip(name)}`);
    assert.ok(statSync(clip(name)).size > 2000, `${name}.mp3 เล็กผิดปกติ น่าจะแปลงไม่สำเร็จ`);
  }
});

test('คำชมต้องไม่บอกว่าเด็กอ่านถูก เพราะเว็บไม่ได้ฟังเสียงเด็ก', () => {
  const voiceScript = readFileSync('scripts/make-class-voice.mjs', 'utf8');
  const cheers = voiceScript.match(/"cheer-\d": "([^"]+)"/g) ?? [];
  assert.equal(cheers.length, CHEER_COUNT);
  for (const line of cheers) {
    assert.ok(!/ถูกต้อง|ได้ยิน|อ่านถูก/.test(line), `คำชมนี้อ้างว่าตรวจคำอ่านแล้ว: ${line}`);
  }
});

test('ชอล์กขาวบนกระดานเขียวเข้มผ่านเกณฑ์ contrast', () => {
  const luminance = hex => {
    const c = hex.match(/[a-f\d]{2}/gi).map(v => parseInt(v, 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
    return c[0] * .2126 + c[1] * .7152 + c[2] * .0722;
  };
  // #133b35 = ผิวกระดานใน classroom.css, #1e5fbf = พื้นปุ่มช่วงวัยที่เลือกอยู่
  assert.ok((luminance('#ffffff') + .05) / (luminance('#133b35') + .05) >= 4.5);
  assert.ok((luminance('#ffffff') + .05) / (luminance('#1e5fbf') + .05) >= 4.5);
});
