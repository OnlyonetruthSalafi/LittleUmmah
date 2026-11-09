import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import test from 'node:test';
import { ISLAND_CONTENT } from '../src/lib/lessons.ts';
import { createHash } from 'node:crypto';

test('approved fixtures retain the original draft (allow Git line endings)', () => {
  const hashes = {
    'garden-owners': '2fc9f4ca264d65fc994135bd26605386924c244d4ad8f2c590ee8401ed715321',
    'two-gardens': 'adf2905b44d3a69ee645f4a497459b15187396ebde69ca183d3bba937fdf98f0',
  };
  for (const [slug, hash] of Object.entries(hashes)) {
    const fixture = readFileSync(`tests/fixtures/draft-${slug}.ts`, 'utf8').replaceAll('\r\n', '\n');
    assert.equal(createHash('sha256').update(fixture).digest('hex'), hash);
  }
});

test('new books are assigned to the approved age group', () => {
  const shelf = ISLAND_CONTENT.find(i => i.slug === 'stories');
  for (const [slug, age, other] of [['garden-owners', 'kids', 'juniors'], ['two-gardens', 'juniors', 'kids']]) {
    assert.equal(shelf[age].filter(b => b.id === slug).length, 1);
    assert.equal(shelf[other].filter(b => b.id === slug).length, 0);
  }
});

for (const [slug, count] of [['garden-owners', 8], ['two-gardens', 10]]) {
  test(`${slug}: approved text and source comments remain exact`, async () => {
    const draft = Object.values(await import(`./fixtures/draft-${slug}.ts`))[0];
    const story = Object.values(await import(`../src/features/stories/data/${slug}.ts`))[0];
    assert.deepEqual(story.title, draft.title);
    assert.equal(story.pages.length, count);
    for (let i = 0; i < count; i++) {
      for (const field of ['th', 'en', 'meaning']) {
        // meaning ของเล่มจริงเป็น Text สองภาษาแล้ว (9 พ.ย. 2026) ตรวจท่อนไทยกับร่างที่อนุมัติ
        const actual = field === 'meaning' ? story.pages[i].meaning?.th : story.pages[i][field];
        assert.equal(actual, draft.pages[i][field], `${slug} p${i + 1} ${field}`);
      }
      assert.equal(story.pages[i].arabic, undefined);
      assert.equal(story.pages[i].reading, undefined);
    }
    const source = readFileSync(`src/features/stories/data/${slug}.ts`, 'utf8');
    const approved = readFileSync(`tests/fixtures/draft-${slug}.ts`, 'utf8');
    for (const comment of approved.match(/\/\/ หน้า .+/g)) assert.ok(source.includes(comment), comment);
    assert.ok(story.deluxe?.cover);
    for (let i = 0; i <= count; i++) {
      const clip = `public/audio/th/stories/${slug}/p${String(i).padStart(2, '0')}.mp3`;
      assert.ok(statSync(clip).size > 2000, `${clip}: recording must contain audio frames`);
    }
  });
}
