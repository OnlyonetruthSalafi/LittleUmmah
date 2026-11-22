import assert from 'node:assert/strict';
import { chromium, chromePath } from './film-kit/lib/playwright.mjs';

const base = process.argv[2] || 'http://localhost:3123';
const browser = await chromium.launch({ executablePath: chromePath, headless: true });
try {
  for (const muted of [false, true]) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
    await page.addInitScript(muted => {
      if (muted) localStorage.setItem('little-ummah:sound', 'off');
      const urls = new WeakMap();
      window.shopSounds = [];
      const read = Response.prototype.arrayBuffer;
      Response.prototype.arrayBuffer = async function () {
        const bytes = await read.call(this);
        urls.set(bytes, this.url.split('/').pop());
        return bytes;
      };
      const decode = AudioContext.prototype.decodeAudioData;
      AudioContext.prototype.decodeAudioData = async function (bytes) {
        const buffer = await decode.call(this, bytes);
        urls.set(buffer, urls.get(bytes));
        return buffer;
      };
      // Check the signal on its way to the speakers, including the game's gain/mute.
      const meters = new WeakMap();
      const connect = AudioNode.prototype.connect;
      AudioNode.prototype.connect = function (next, ...ports) {
        if (next === this.context.destination) {
          const meter = this.context.createAnalyser();
          meters.set(this.context, meter);
          connect.call(this, meter);
          connect.call(meter, next);
          return next;
        }
        return connect.call(this, next, ...ports);
      };
      const start = AudioBufferSourceNode.prototype.start;
      AudioBufferSourceNode.prototype.start = function (...args) {
        const meter = meters.get(this.context);
        const entry = { name: urls.get(this.buffer), peak: 0, elapsed: 0, duration: this.buffer.duration };
        window.shopSounds.push(entry);
        const at = this.context.currentTime;
        const samples = new Float32Array(meter.fftSize);
        const sample = setInterval(() => {
          meter.getFloatTimeDomainData(samples);
          for (const value of samples) entry.peak = Math.max(entry.peak, Math.abs(value));
        }, 10);
        this.addEventListener('ended', () => {
          clearInterval(sample);
          entry.elapsed = this.context.currentTime - at;
        }, { once: true });
        return start.apply(this, args);
      };
    }, muted);
    await page.goto(base + '/games/vip#shop');
    await page.getByRole('link', { name: /เข้าร้านน้ำปั่น/ }).tap();
    const dialog = page.getByRole('dialog');
    const reply = dialog.getByRole('button', { name: /^วะอะลัยกุมุสสะลาม/ }).first();
    await reply.tap();
    await dialog.getByRole('button', { name: /รับออเดอร์/ }).tap();
    for (const object of ['orange', 'banana', 'blender', 'cup']) {
      await page.locator('[data-object="' + object + '"]').tap();
    }
    // Serving is a drag: lift the full cup and drop it on the customer.
    const cup = page.locator('[data-drag="serve"]');
    const box = await cup.boundingBox();
    // The customer's chest in the 900 × 530 scene, where the dashed guide ends.
    const scene = await page.locator('[data-shop-stage] svg[role="img"]').boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(scene.x + scene.width * 478 / 900, scene.y + scene.height * 200 / 530, { steps: 8 });
    await page.mouse.up();
    await page.locator('[data-object="coins"]').tap();
    await page.locator('[data-customer="safi"][data-arrived="true"]').waitFor();
    await reply.tap();
    await dialog.getByRole('button', { name: /รับออเดอร์/ }).waitFor();
    const events = await page.evaluate(() => window.shopSounds);
    for (const name of ['smoothie-coins.mp3', 'safi-shop-salam.mp3']) {
      const plays = events.filter(entry => entry.name === name);
      assert.equal(plays.length, muted ? 0 : 1, name);
      if (!muted) {
        assert.ok(plays[0].peak > 0.015, name + ' must reach the output');
        assert.ok(plays[0].elapsed >= plays[0].duration - 0.06, name + ' must finish');
      }
    }
    console.log(muted ? 'Muted sale and greeting passed.' : 'Audible payment and complete Safi greeting passed.');
    await page.close();
  }
} finally {
  await browser.close();
}
