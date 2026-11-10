import test from 'node:test';
import assert from 'node:assert/strict';
import { afterScenePaint } from '../src/components/performance/afterScenePaint.ts';

test('startup waits for image decoding and a paint, cancellation prevents late narration', async t => {
  const frames = new Map();
  let id = 0;
  const original = { document: globalThis.document, requestAnimationFrame: globalThis.requestAnimationFrame, cancelAnimationFrame: globalThis.cancelAnimationFrame };
  t.after(() => { for (const [key, value] of Object.entries(original)) { if (value === undefined) delete globalThis[key]; else globalThis[key] = value; } });
  globalThis.requestAnimationFrame = callback => { frames.set(++id, callback); return id; };
  globalThis.cancelAnimationFrame = id => frames.delete(id);
  const tick = () => { const pending = [...frames.values()]; frames.clear(); pending.forEach(fn => fn()); };
  const flush = () => new Promise(resolve => setImmediate(resolve));
  const image = new EventTarget();
  let decode;
  image.complete = false;
  image.decode = () => new Promise(resolve => { decode = resolve; });
  globalThis.document = { querySelectorAll: () => [image] };
  let calls = 0;
  afterScenePaint(() => calls++);
  await flush(); tick(); assert.equal(calls, 0);
  image.dispatchEvent(new Event('load'));
  await flush(); tick(); assert.equal(calls, 0, 'load without decode is not ready');
  decode(); await flush();
  tick(); assert.equal(calls, 0, 'give the browser a paint opportunity');
  tick(); assert.equal(calls, 1);

  const cancel = afterScenePaint(() => calls++);
  image.dispatchEvent(new Event('load'));
  cancel(); decode(); await flush(); tick(); tick();
  assert.equal(calls, 1, 'leaving the page during decode must not start narration');

  image.complete = true;
  image.decode = () => Promise.reject(new Error('failed image'));
  afterScenePaint(() => calls++);
  await flush(); tick(); tick();
  assert.equal(calls, 2, 'a failed image must not permanently block the guide');

  const cancelCached = afterScenePaint(() => calls++);
  await flush(); tick(); cancelCached(); tick();
  assert.equal(calls, 2, 'cancel between animation frames must also work');
});

test('a stalled image request does not block startup work forever', async t => {
  const original = { document: globalThis.document, requestAnimationFrame: globalThis.requestAnimationFrame, cancelAnimationFrame: globalThis.cancelAnimationFrame };
  t.after(() => { for (const [key, value] of Object.entries(original)) { if (value === undefined) delete globalThis[key]; else globalThis[key] = value; } });
  globalThis.requestAnimationFrame = callback => setTimeout(callback, 0);
  globalThis.cancelAnimationFrame = id => clearTimeout(id);
  const image = new EventTarget();
  image.complete = false; // never loads
  globalThis.document = { querySelectorAll: () => [image] };
  let calls = 0;
  afterScenePaint(() => calls++, undefined, 30);
  await new Promise(resolve => setTimeout(resolve, 15));
  assert.equal(calls, 0);
  await new Promise(resolve => setTimeout(resolve, 60));
  assert.equal(calls, 1, 'guide starts after the max wait');

  const cancel = afterScenePaint(() => calls++, undefined, 30);
  cancel();
  await new Promise(resolve => setTimeout(resolve, 60));
  assert.equal(calls, 1, 'cancelled work stays cancelled after the max wait');
});
