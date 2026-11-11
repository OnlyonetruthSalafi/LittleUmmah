import assert from 'node:assert/strict';
import test from 'node:test';
import { AGE_BOOTSTRAP } from '../src/lib/ageBootstrap.ts';
import vm from 'node:vm';

let serial = 0;
const fresh = () => import(`../src/lib/ageStore.ts?test=${serial++}`);
test('age store: valid reads, writes, invalid input, subscriptions and SSR', async () => {
  const values = new Map([['lu-age', 'juniors']]);
  globalThis.window = { localStorage: { getItem: k => values.get(k), setItem: (k,v) => values.set(k,v) } };
  const s = await fresh();
  assert.equal(s.getAgeServerSnapshot(), null);
  assert.equal(s.getAgeSnapshot(), 'juniors');
  let calls = 0;
  const off = s.subscribeAge(() => calls++);
  s.setAge('kids');
  assert.equal(values.get('lu-age'), 'kids');
  assert.equal(s.getAgeSnapshot(), 'kids');
  assert.equal(calls, 1);
  off(); s.setAge('juniors'); assert.equal(calls, 1);
  for (const value of ['', 'KIDS', 'null', '{}', '"kids"', null, undefined, 3]) {
    assert.equal(s.parseAge(value), null);
    values.set('lu-age', value); s.refreshAge(); assert.equal(s.getAgeSnapshot(), null);
  }
  delete globalThis.window;
});
test('age store tolerates missing or throwing localStorage and retains in-memory choice', async () => {
  for (const win of [undefined, {}, { get localStorage() { throw Error('SecurityError'); } }, { localStorage: { getItem() { throw Error('blocked'); }, setItem() { throw Error('quota'); } } }]) {
    globalThis.window = win;
    const s = await fresh();
    assert.equal(s.getAgeSnapshot(), null);
    s.setAge('kids');
    if (win) assert.equal(s.getAgeSnapshot(), 'kids');
  }
  delete globalThis.window;
});
test('pre-paint bootstrap: hash wins, age entry persists, invalid/missing/blocked storage is safe', () => {
  for (const saved of [null, 'kids', 'juniors', 'invalid']) {
    for (const hash of ['', '#kids', '#juniors']) {
      const dataset = {};
      vm.runInNewContext(AGE_BOOTSTRAP, { location: { pathname: '/learn/moral', hash }, document: { documentElement: { dataset } }, localStorage: { getItem: () => saved } });
      assert.equal(dataset.age, hash.slice(1) || (saved === 'kids' || saved === 'juniors' ? saved : undefined));
    }
  }
  for (const age of ['kids','juniors']) {
    const dataset = {}; let written;
    vm.runInNewContext(AGE_BOOTSTRAP, { location: { pathname: `/en/${age}`, hash: '' }, document: { documentElement: { dataset } }, localStorage: { getItem: () => null, setItem: (k,v) => { written = [k,v]; } } });
    assert.deepEqual(written, ['lu-age', age]); assert.equal(dataset.age, age);
    vm.runInNewContext(AGE_BOOTSTRAP, { location: { pathname: `/${age}`, hash: '' }, document: { documentElement: { dataset } }, get localStorage() { throw Error('blocked'); } });
    assert.equal(dataset.age, age);
  }
});
