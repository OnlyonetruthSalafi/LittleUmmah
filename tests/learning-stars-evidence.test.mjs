import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { SAHABA, ULAMA, PHOTO } from '../src/app/[lang]/parents/content.ts';
test('all original Arabic, translations, sources and Shamela links remain byte-for-byte unchanged', () => {
  const before=JSON.parse(fs.readFileSync(new URL('./fixtures/learning-stars-evidence.json',import.meta.url),'utf8'));
  assert.deepEqual({SAHABA,ULAMA,PHOTO},before);
});
