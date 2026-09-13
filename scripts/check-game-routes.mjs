import assert from 'node:assert/strict';
import { games } from '../src/features/games/data/catalog.ts';
import { gamePresentation } from '../src/features/games/data/presentation.ts';
const base = process.env.GAME_TEST_URL ?? 'http://localhost:3001';
const routes = ['/', '/kids', '/juniors', '/learn/games/memory/easy', '/learn/games/memory/hard', '/games', ...games.map(game => `/games/${game.slug}`)];
for (const route of routes) {
  const response = await fetch(`${base}${route}`);
  assert.equal(response.status, 200, route);
  const html = await response.text();
  assert.ok(html.includes('<main'), `${route} has a main landmark`);
  if (route === '/games') for (const game of games) assert.ok(html.includes(`href="/games/${game.slug}"`), `${game.slug} is linked`);
  const game = games.find(game => route === `/games/${game.slug}`);
  if (game) {
    assert.ok(html.includes(game.title.th), `${route} Thai title rendered`);
    assert.ok(html.includes(gamePresentation[game.slug].world.th), `${route} world name rendered`);
    assert.ok(html.includes('gc-adventure-intro'), `${route} illustrated introduction rendered`);
    for (const label of gamePresentation[game.slug].levels) assert.ok(html.includes(label.th), `${route} level description rendered`);
  }
  console.log(`PASS ${route}`);
}
const island = await fetch(`${base}/learn/games`, { redirect: 'manual' });
assert.equal(island.status, 307);
assert.equal(island.headers.get('location'), '/games');
const missing = await fetch(`${base}/games/not-a-game`);
assert.equal(missing.status, 404);
const image = await fetch(`${base}/games/puzzle/courtyard.webp`);
assert.equal(image.status, 200);
assert.ok(image.headers.get('content-type').includes('image/webp'));
console.log('PASS island redirect, unknown game 404 and puzzle asset');
for (const name of ['game-hub-bg', ...games.map(game => game.slug)]) {
  const asset = await fetch(`${base}/games/hub/${name}.webp`);
  assert.equal(asset.status, 200, name);
  assert.ok(asset.headers.get('content-type').includes('image/webp'), name);
  assert.ok((await asset.arrayBuffer()).byteLength < 200_000, `${name} image budget`);
}
console.log('PASS all nine world assets and per-image 200KB budget');
for (const object of ['moon', 'sparkle', 'mushaf', 'lantern', 'jug', 'mat', 'letters', 'maze']) {
  const asset = await fetch(`${base}/games/common/objects/${object}.webp`);
  assert.equal(asset.status, 200, object);
  assert.ok(asset.headers.get('content-type').includes('image/webp'));
  assert.ok((await asset.arrayBuffer()).byteLength < 50_000, `${object} object image budget`);
}
const garden = await fetch(`${base}/games/common/backgrounds/garden.webp`);
assert.equal(garden.status, 200);
assert.ok(garden.headers.get('content-type').includes('image/webp'));
assert.ok((await garden.arrayBuffer()).byteLength < 200_000);
console.log('PASS eight object images, garden scene and all eight illustrated introductions');
