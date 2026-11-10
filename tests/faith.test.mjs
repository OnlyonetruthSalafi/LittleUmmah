import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { LESSONS, CARTOONS, CARD_ART, GUIDE_STEPS } from '../src/features/faith/data.ts';
import { CATEGORIES, HOME_ISLANDS } from '../src/lib/categories.ts';
import { LINES } from '../scripts/make-faith-voice.mjs';

test('faith is live without changing the other home island positions', () => {
  assert.deepEqual(HOME_ISLANDS.learn.map(c => c.slug), ['arabic','moral','tajweed','quran-reading','faith-basics']);
  const faith = CATEGORIES.find(c => c.slug === 'faith-basics');
  assert.equal(faith.href, '/learn/faith-basics');
  assert.equal(HOME_ISLANDS.learn.at(-1).comingSoon, undefined);
  assert.deepEqual(CATEGORIES.filter(c => c !== faith).map(c => c.slug), ['moral','stories','arabic','explore','games','art']);
});

test('all twelve faith lessons have complete image and narration assets', () => {
  assert.equal(LESSONS.kids.length, 6);
  assert.equal(LESSONS.juniors.length, 6);
  const clips = new Set(GUIDE_STEPS.map(s => s.clip));
  for (const lesson of [...LESSONS.kids, ...LESSONS.juniors]) {
    assert.ok(existsSync(`public${CARD_ART[lesson.id]}`), lesson.id);
    assert.ok(CARTOONS[lesson.id].scenes.length >= 4);
    for (const scene of CARTOONS[lesson.id].scenes) {
      assert.ok(existsSync(`public${scene.bg}`), scene.bg);
      assert.ok(!clips.has(scene.clip), `duplicate ${scene.clip}`);
      clips.add(scene.clip);
    }
  }
  assert.deepEqual([...clips].sort(), Object.keys(LINES).sort());
  for (const clip of clips) assert.ok(readFileSync(`public/audio/th/faith/${clip}.mp3`).length > 1000, clip);
});

test('every new faith PNG is registered with its current source hash', () => {
  const manifest = JSON.parse(readFileSync('scripts/source-images.json', 'utf8'));
  const files = Object.keys(manifest).filter(f => f.startsWith('public/faith/'));
  assert.equal(files.length, 17);
  // PNG originals are ignored; a fresh checkout can still run the suite.
  for (const file of files) if (existsSync(file)) {
    assert.equal(createHash('sha256').update(readFileSync(file)).digest('hex'), manifest[file], file);
  }
});
