import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, existsSync } from 'node:fs';
import { ISLAND_CONTENT } from '../src/lib/lessons.ts';
import { CARTOONS } from '../src/features/moral/cartoon.ts';
import { CARD_ART } from '../src/features/moral/data.ts';
import { LINES } from '../scripts/make-moral-cartoon-voice.mjs';

// Independent acceptance fixture transcribed verbatim from the owner's C-8 table (8 Nov 2026).
const expected = JSON.parse(readFileSync(new URL('./fixtures/daily-duas.json', import.meta.url), 'utf8'));
const moral = ISLAND_CONTENT.find(island => island.slug === 'moral');

for (const dua of expected) {
  test(`${dua.id}: Arabic, Thai reading and meaning match the approved strings exactly, in the correct age group`, () => {
    const lesson = moral[dua.age].find(l => l.id === dua.id);
    assert.ok(lesson);
    assert.equal(moral[dua.age === 'kids' ? 'juniors' : 'kids'].some(l => l.id === dua.id), false);
    assert.equal(lesson.arabic, dua.arabic);
    assert.equal(lesson.reading, dua.reading);
    assert.equal(lesson.meaning, dua.meaning);
    assert.deepEqual(CARTOONS[dua.id].word, { ar: dua.arabic, th: dua.reading });
    for (const file of ['src/lib/lessons.ts', 'src/features/moral/cartoon.ts']) {
      const source = readFileSync(file, 'utf8');
      const pos = source.indexOf(`"${dua.id}"`);
      const comment = source.slice(Math.max(0, pos - 400), pos);
      assert.ok(comment.includes(`// C-8: Claude ตรวจตัวบท 8 พ.ย. 2026 — ${dua.source}`), file);
    }
  });

  test(`${dua.id}: sayAlong only splits at approved Arabic punctuation, every line has voice text and art`, () => {
    const cartoon = CARTOONS[dua.id];
    assert.ok(cartoon.scenes.length >= 5 && cartoon.scenes.length <= 6);
    assert.equal(cartoon.wordPlacement, 'above');
    const parts = dua.arabic.match(/[^،]+،?/g).map(s => s.trim());
    const repeat = cartoon.scenes.filter(s => s.sayAlong);
    assert.ok(repeat.length);
    assert.deepEqual([...new Set(repeat.map(s => s.word.ar))], parts);
    assert.equal(parts.join(' '), dua.arabic);
    assert.ok(existsSync(`public${CARD_ART[dua.id]}`));
    for (const scene of cartoon.scenes) {
      assert.ok(scene.th && scene.en);
      assert.equal(LINES[scene.clip], scene.th, `spoken line drift: ${scene.clip}`);
      assert.ok(existsSync(`public/audio/th/${scene.clip}.mp3`), `missing narration: ${scene.clip}`);
      assert.ok(existsSync(`public${scene.bg}`));
      if (scene.sayAlong) assert.ok(scene.sayAlongMs >= 10000, `time to repeat: ${scene.clip}`);
      if (scene.word) assert.ok(scene.word.ar === dua.arabic || parts.includes(scene.word.ar));
    }
    assert.ok(cartoon.scenes.some(s => s.th === dua.meaning && s.en === dua.meaningEn));
    assert.doesNotMatch(cartoon.scenes.map(s => s.th + s.en).join(' '), /อภัยบาป|forgiv.*sin|ชัยฏอน|Shaytan/i);
  });
}

test('daily dua clip IDs are unique across the existing cartoon catalogue', () => {
  const ids = Object.values(CARTOONS).flatMap(c => c.scenes.map(s => s.clip));
  assert.equal(new Set(ids).size, ids.length);
});
