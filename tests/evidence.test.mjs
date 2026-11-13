import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { EVIDENCE } from '../src/content/evidence.ts';

// Frozen gaps from the collection stage. Remove entries only after an explicit source is supplied.
// Includes Word.ar (spoken Arabic labels), beyond the required meaning/arabic fields.
const MISSING_SOURCE = {
  "src/lib/lessons.ts#ISLAND_CONTENT[arabic].juniors[salam]": "บทภาษาอาหรับ/คำศัพท์ ไม่มีเลขแหล่งอ้างอิงใน comment ของบทนี้",
  "src/lib/lessons.ts#ISLAND_CONTENT[arabic].juniors[jazak]": "บทภาษาอาหรับ/คำศัพท์ ไม่มีเลขแหล่งอ้างอิงใน comment ของบทนี้",
  "src/lib/lessons.ts#ISLAND_CONTENT[arabic].juniors[bismillah]": "บทภาษาอาหรับ/คำศัพท์ ไม่มีเลขแหล่งอ้างอิงใน comment ของบทนี้",
  "src/lib/lessons.ts#ISLAND_CONTENT[arabic].juniors[alhamdulillah]": "บทภาษาอาหรับ/คำศัพท์ ไม่มีเลขแหล่งอ้างอิงใน comment ของบทนี้",
  "src/lib/lessons.ts#ISLAND_CONTENT[arabic].juniors[fatha]": "บทภาษาอาหรับ/คำศัพท์ ไม่มีเลขแหล่งอ้างอิงใน comment ของบทนี้",
  "src/lib/lessons.ts#ISLAND_CONTENT[arabic].juniors[kasra]": "บทภาษาอาหรับ/คำศัพท์ ไม่มีเลขแหล่งอ้างอิงใน comment ของบทนี้",
  "src/lib/lessons.ts#ISLAND_CONTENT[arabic].juniors[damma]": "บทภาษาอาหรับ/คำศัพท์ ไม่มีเลขแหล่งอ้างอิงใน comment ของบทนี้",
  "src/lib/lessons.ts#ISLAND_CONTENT[arabic].juniors[sukun]": "บทภาษาอาหรับ/คำศัพท์ ไม่มีเลขแหล่งอ้างอิงใน comment ของบทนี้",
  "src/lib/lessons.ts#ISLAND_CONTENT[arabic].juniors[numbers]": "บทภาษาอาหรับ/คำศัพท์ ไม่มีเลขแหล่งอ้างอิงใน comment ของบทนี้",
  "src/lib/lessons.ts#ISLAND_CONTENT[arabic].juniors[numbers2]": "บทภาษาอาหรับ/คำศัพท์ ไม่มีเลขแหล่งอ้างอิงใน comment ของบทนี้",
  "src/lib/lessons.ts#ISLAND_CONTENT[arabic].juniors[digits]": "บทภาษาอาหรับ/คำศัพท์ ไม่มีเลขแหล่งอ้างอิงใน comment ของบทนี้",
  "src/lib/lessons.ts#ISLAND_CONTENT[arabic].juniors[words]": "บทภาษาอาหรับ/คำศัพท์ ไม่มีเลขแหล่งอ้างอิงใน comment ของบทนี้",
  "src/lib/lessons.ts#ISLAND_CONTENT[arabic].juniors[home]": "บทภาษาอาหรับ/คำศัพท์ ไม่มีเลขแหล่งอ้างอิงใน comment ของบทนี้",
  "src/lib/lessons.ts#ISLAND_CONTENT[arabic].juniors[nature]": "บทภาษาอาหรับ/คำศัพท์ ไม่มีเลขแหล่งอ้างอิงใน comment ของบทนี้",
  "src/lib/lessons.ts#ISLAND_CONTENT[arabic].juniors[family]": "บทภาษาอาหรับ/คำศัพท์ ไม่มีเลขแหล่งอ้างอิงใน comment ของบทนี้",
  "src/lib/lessons.ts#ISLAND_CONTENT[moral].kids[bismillah]": "สลาม/บิสมิลลาฮ์ ไม่มี comment ระบุที่มาประจำบทหรือฉาก",
  "src/lib/lessons.ts#ISLAND_CONTENT[moral].kids[salam]": "สลาม/บิสมิลลาฮ์ ไม่มี comment ระบุที่มาประจำบทหรือฉาก",
  "src/lib/lessons.ts#ISLAND_CONTENT[stories].kids[yunus]": "ข้อมูลสรุปนิทานใน lessons.ts ไม่มี comment ที่มาประจำจุด ห้ามยืมจากไฟล์อื่นโดยเดา",
  "src/lib/lessons.ts#ISLAND_CONTENT[stories].kids[ibrahim-fire]": "ข้อมูลสรุปนิทานใน lessons.ts ไม่มี comment ที่มาประจำจุด ห้ามยืมจากไฟล์อื่นโดยเดา",
  "src/lib/lessons.ts#ISLAND_CONTENT[stories].juniors[kaaba]": "ข้อมูลสรุปนิทานใน lessons.ts ไม่มี comment ที่มาประจำจุด ห้ามยืมจากไฟล์อื่นโดยเดา",
  "src/lib/lessons.ts#ISLAND_CONTENT[stories].juniors[musa]": "ข้อมูลสรุปนิทานใน lessons.ts ไม่มี comment ที่มาประจำจุด ห้ามยืมจากไฟล์อื่นโดยเดา",
  "src/lib/lessons.ts#ISLAND_CONTENT[stories].juniors[yusuf]": "ข้อมูลสรุปนิทานใน lessons.ts ไม่มี comment ที่มาประจำจุด ห้ามยืมจากไฟล์อื่นโดยเดา",
  "src/lib/lessons.ts#ISLAND_CONTENT[art].juniors[eid-card]": "บทศิลปะ/คัดอักษร ไม่มีแหล่งอ้างอิงใน comment",
  "src/lib/lessons.ts#ISLAND_CONTENT[art].juniors[calligraphy]": "บทศิลปะ/คัดอักษร ไม่มีแหล่งอ้างอิงใน comment",
  "src/features/moral/cartoon.ts#CARTOONS.meet-friends.scenes[meet-salam].word": "สลาม/บิสมิลลาฮ์ ไม่มี comment ระบุที่มาประจำบทหรือฉาก",
  "src/features/moral/cartoon.ts#CARTOONS.bismillah.word": "สลาม/บิสมิลลาฮ์ ไม่มี comment ระบุที่มาประจำบทหรือฉาก",
  "src/features/moral/cartoon.ts#CARTOONS.salam.word": "สลาม/บิสมิลลาฮ์ ไม่มี comment ระบุที่มาประจำบทหรือฉาก",
  "src/features/moral/cartoon.ts#CARTOONS.salam.scenes[sal-teach].word": "สลาม/บิสมิลลาฮ์ ไม่มี comment ระบุที่มาประจำบทหรือฉาก",
  "src/features/moral/cartoon.ts#CARTOONS.salam.scenes[sal-reply].word": "สลาม/บิสมิลลาฮ์ ไม่มี comment ระบุที่มาประจำบทหรือฉาก",
  "src/features/explore/data.ts#CARTOONS.desert-home.scenes[dsk-bye].word": "คำซิกรุในฉากลา ไม่มี comment ระบุที่มา",
  "src/features/explore/data.ts#FILMS.desert-home.turns[2].word": "คำซิกรุเดียวกับฉากลา (ซุบฮานัลลอฮ์) ในการ์ตูนเต็มเรื่อง ไม่มี comment ระบุที่มา",
  "src/features/explore/data.ts#FILMS.desert-home.words[0]": "คำซิกรุเดียวกับฉากลา (ซุบฮานัลลอฮ์) ในการ์ตูนเต็มเรื่อง ไม่มี comment ระบุที่มา",
  "src/features/explore/data.ts#CARTOONS.desert-life.scenes[dsj-bye].word": "คำซิกรุในฉากลา ไม่มี comment ระบุที่มา",
  "src/features/explore/data.ts#CARTOONS.forest-home.scenes[frk-bye].word": "คำซิกรุในฉากลา ไม่มี comment ระบุที่มา",
  "src/features/explore/data.ts#CARTOONS.forest-life.scenes[frj-bye].word": "คำซิกรุในฉากลา ไม่มี comment ระบุที่มา",
  "src/features/explore/data.ts#CARTOONS.sea-home.scenes[sek-bye].word": "คำซิกรุในฉากลา ไม่มี comment ระบุที่มา",
  "src/features/explore/data.ts#CARTOONS.sea-life.scenes[sej-bye].word": "คำซิกรุในฉากลา ไม่มี comment ระบุที่มา",
  "src/features/explore/data.ts#CARTOONS.polar-home.scenes[pok-bye].word": "คำซิกรุในฉากลา ไม่มี comment ระบุที่มา",
  "src/features/explore/data.ts#CARTOONS.polar-life.scenes[poj-bye].word": "คำซิกรุในฉากลา ไม่มี comment ระบุที่มา"
};

const files = readdirSync(new URL('../src/features/stories/data/', import.meta.url), { recursive: true })
  .filter(f => f.endsWith('.ts') && !['index.ts', 'common.ts'].includes(f.split(/[\\/]/).at(-1)))
  .map(f => 'src/features/stories/data/' + f.replaceAll('\\', '/'))
  .concat(['src/features/faith/data.ts', 'src/lib/lessons.ts', 'src/features/moral/data.ts',
    'src/features/moral/cartoon.ts', 'src/features/explore/data.ts']);
const modules = await Promise.all(files.map(async file => [file, await import(new URL('../' + file, import.meta.url))]));
const byId = new Map(EVIDENCE.map(e => [e.id, e]));
const used = new Set();
const missing = [];
const storyPages = [];
const meaningNodes = [];
function visit(value, path, inherited = []) {
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value)) {
    value.forEach((item, i) => visit(item, path + '[' + (item.id ?? item.slug ?? item.clip ?? item.image?.split('/').at(-1) ?? i) + ']', inherited));
    return;
  }
  if (value.evidence !== undefined) {
    assert.ok(Array.isArray(value.evidence) && value.evidence.length > 0, path + ': nonempty evidence array');
    assert.equal(new Set(value.evidence).size, value.evidence.length, path + ': repeated evidence id');
    for (const id of value.evidence) {
      assert.equal(typeof id, 'string', path);
      assert.ok(byId.has(id), path + ': unknown evidence ' + id);
      used.add(id);
    }
  }
  const ids = value.evidence ?? inherited;
  if (('meaning' in value || 'arabic' in value || 'ar' in value) && ids.length === 0) missing.push(path);
  if (path.includes('#') && path.includes('.pages[') && 'image' in value) storyPages.push({value, ids, path});
  if ('meaning' in value) meaningNodes.push({ value, path });
  for (const [key, item] of Object.entries(value)) if (key !== 'evidence') visit(item, path + '.' + key, ids);
}
for (const [file, mod] of modules) for (const [name, value] of Object.entries(mod)) visit(value, file + '#' + name);

test('evidence registry: unique ids, valid kinds, verification records well-formed', () => {
  assert.ok(EVIDENCE.length > 0);
  assert.equal(byId.size, EVIDENCE.length, 'duplicate evidence ids');
  for (const entry of EVIDENCE) {
    assert.match(entry.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(['quran','hadith','athar','scholar'].includes(entry.kind));
    assert.ok(entry.ref.trim());
    // null = รอ Claude ยืนยัน; ยืนยันแล้วต้องบอกว่าตรวจอะไร ด้วยวิธีไหน วันไหน
    if (entry.verified !== null) {
      assert.equal(entry.verified.by, 'claude', entry.id);
      assert.match(entry.verified.date, /^\d{4}-\d{2}-\d{2}$/, entry.id);
      assert.ok(entry.verified.how.trim().length > 20, entry.id + ': describe what was checked');
    }
  }
});

test('all content references exist and every registry entry is used', () => {
  assert.deepEqual([...used].sort(), [...byId.keys()].sort());
});

test('every meaning/arabic/Word.ar has its own or parent evidence, except frozen MISSING_SOURCE', () => {
  assert.deepEqual(missing.sort(), Object.keys(MISSING_SOURCE).sort(), 'new gap or stale allowlist entry; review source comments');
  for (const reason of Object.values(MISSING_SOURCE)) assert.ok(reason.trim());
});

test('Quran-sourced story pages contain no Arabic or reading (AGENTS 1.6)', () => {
  for (const {value, ids, path} of storyPages) if (ids.some(id => byId.get(id)?.kind === 'quran')) {
    assert.equal(value.arabic, undefined, path);
    assert.equal(value.reading, undefined, path);
  }
});

// Claude ยืนยันอายะฮ์ด้วยการเทียบ meaning กับคำแปล quran.com id 51 (เก็บเฉพาะอายะฮ์ที่ยืนยันแล้วใน fixture)
// จับกรณีผูกหน้ากับอายะฮ์ผิด เช่น สลับ evidence ของสองหน้า หรือ verified ทั้งที่อายะฮ์ไม่มีข้อความนั้น
// อนุโลมได้หนึ่งท่อนต่อหน้า เพราะข้อ 1.6 ให้แก้คำพิมพ์ผิดที่ชัดเจนในคำแปล (เช่น ขี้แนะ→ชี้แนะ) และ ฮฺ/ฮ์
const QURAN_TH = JSON.parse(readFileSync(new URL('./fixtures/quran-th-51.json', import.meta.url), 'utf8')).verses;
const normTh = s => s.replace(/[\s"“”'‘’()（）.,!?…:;«»\-–—]/g, '').replace(/ฮฺ/g, 'ฮ์');
const matches = (text, ids) => {
  const full = normTh(ids.flatMap(id => QURAN_TH[id] ?? []).map(v => v.th).join(' '));
  const chunks = text.split(/\s+|…/).filter(c => normTh(c).length > 6);
  return chunks.length > 0 && chunks.filter(c => !full.includes(normTh(c))).length <= 1;
};

// วิธีที่สอง (เจ้าของโปรเจกต์ตกลง 12 พ.ย. 2026): อายะฮ์ที่บทอ้างแค่เลข ไม่ได้ยกคำแปล — Claude เปิดตัฟซีรอิบนุกะษีร (Shamela 8473)
// เจอ ayah marker บนหน้า และตัวบทตรงกับหัวข้อที่บทใช้ บันทึกลิงก์หน้าใน how
const TAFSIR_HOW = /^ตัฟซีรอิบนุกะษีร \(Shamela 8473\) (มี ayah marker|ยกตัวบท) .+https:\/\/shamela\.ws\/book\/8473\/\d+/;
const tafsirVerified = e => e.kind === 'quran' && !!e.verified && TAFSIR_HOW.test(e.verified.how) && !QURAN_TH[e.id];

test('tafsir-verified Quran entries carry a Shamela 8473 page link in how', () => {
  for (const e of EVIDENCE) if (e.kind === 'quran' && e.verified?.how.startsWith('ตัฟซีรอิบนุกะษีร')) assert.ok(TAFSIR_HOW.test(e.verified.how), e.id);
});

test('verified Quran evidence: each page meaning is found in the verses its own evidence points to', () => {
  const supported = new Set();
  const wrong = [];
  for (const { value, path } of meaningNodes) {
    const text = typeof value.meaning === 'string' ? value.meaning : value.meaning?.th;
    const ids = (value.evidence ?? []).filter(id => byId.get(id)?.kind === 'quran' && byId.get(id).verified && !tafsirVerified(byId.get(id)));
    if (!text || !ids.length) continue;
    if (!matches(text, ids)) wrong.push(path + ' -> ' + ids.join(','));
    for (const id of ids) if (matches(text, [id])) supported.add(id);
  }
  assert.deepEqual(wrong, [], 'page evidence points to verses that do not contain its meaning');
  const unsupported = EVIDENCE.filter(e => e.kind === 'quran' && e.verified && !tafsirVerified(e) && !supported.has(e.id)).map(e => e.id);
  assert.deepEqual(unsupported, [], 'verified Quran entries must be backed by a page meaning found in their verses');
});
