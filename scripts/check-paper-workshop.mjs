// Run against a built server. PLAYWRIGHT_MODULE and PLAYWRIGHT_EXECUTABLE
// can point to a local Playwright installation and Chromium executable.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import sharp from "sharp";

const require = createRequire(import.meta.url);
const { chromium, firefox, webkit } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.argv[2] || "http://localhost:3000";

async function checkPrintedArrows(page) {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const stage = page.locator(".pp-viewport");
  const arrows = page.locator(".pp-reading-spread .ui-round");
  await page.getByRole("slider").fill("38");
  assert.match(await stage.locator(".pp-printed-turn").evaluate(el => el.style.backgroundImage), /workshop\.webp/);
  // Capture intermediate illustrations as well as the eventually settled page.
  await stage.evaluate(el => {
    window.turnAtlases = new Set();
    new MutationObserver(() => {
      const frame = el.querySelector(".pp-printed-turn");
      if (frame.hidden || !el.dataset.turn) return;
      const name = frame.style.backgroundImage.match(/\/turns\/([^/]+)\.webp/);
      if (name) window.turnAtlases.add(name[1]);
    }).observe(el, { attributes: true, childList: true, subtree: true });
  });
  const pages = ["cover", "p01", "p02", "p03", "p04", "p05"];
  let previous = 0;
  for (const index of [1, 2, 3, 4, 5, 4, 3, 2, 1, 0]) {
    await page.evaluate(() => window.turnAtlases.clear());
    await (index > previous ? arrows.last() : arrows.first()).click();
    await page.locator(`.pp-viewport[data-scene="${pages[index]}"]:not([data-turn])`).waitFor();
    assert.deepEqual(await page.evaluate(() => [...window.turnAtlases]), [pages[Math.min(index, previous)]],
      `bottom arrow ${pages[previous]} → ${pages[index]} uses only this turn's illustration`);
    assert.match(await stage.locator(".pp-poster").getAttribute("src"), new RegExp("/" + pages[index] + "\\.webp$"));
    previous = index;
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
}

async function difference(a, b) {
  const samples = await Promise.all([a, b].map(image => sharp(image).resize(160, 96).removeAlpha().raw().toBuffer()));
  let total = 0;
  for (let i = 0; i < samples[0].length; i++) total += Math.abs(samples[0][i] - samples[1][i]);
  return total / samples[0].length;
}

async function dragMiddle(page, scene, mode, fraction) {
  await scene.scrollIntoViewIfNeeded();
  const rect = await scene.boundingBox();
  const start = { x: rect.x + rect.width * .5, y: rect.y + rect.height * .5 };
  const end = { ...start, x: start.x + rect.width * fraction };
  if (mode === "touch") {
    const session = await page.context().newCDPSession(page);
    await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [start] });
    await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [end] });
    await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await session.detach();
  } else {
    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    await page.mouse.move(end.x, end.y, { steps: 4 });
    await page.mouse.up();
  }
}

async function checkFullscreen(page, mode) {
  const mobileFallback = mode === "phone-fallback";
  const native = !mobileFallback && mode !== "print";
  const slider = page.getByRole("slider");
  const toggle = page.locator(".pp-screen-toggle");
  const expanded = page.locator(".pp-screen[data-expanded]");
  await slider.fill("73");
  const canvas = await page.locator(".pp-viewport canvas").elementHandle();
  await page.evaluate(({ native, mobileFallback }) => {
    window.orientationCalls = [];
    if (screen.orientation) {
      Object.defineProperty(screen.orientation, "lock", { configurable: true, value: async value => {
        window.orientationCalls.push(value);
      } });
      Object.defineProperty(screen.orientation, "unlock", { configurable: true, value: () => window.orientationCalls.push("unlock") });
    }
    if (!native) {
      const denied = () => Promise.reject(new DOMException("Fullscreen denied", "NotAllowedError"));
      Object.defineProperty(Element.prototype, "requestFullscreen", { configurable: true, value: mobileFallback ? denied : undefined });
      Object.defineProperty(Element.prototype, "webkitRequestFullscreen", { configurable: true, value: undefined });
    }
  }, { native, mobileFallback });
  await toggle.click();
  await expanded.waitFor();
  assert.equal(await page.evaluate(() => !!document.fullscreenElement), native);
  assert.equal(await slider.inputValue(), "73");
  if (mode === "touch" || mobileFallback) {
    if (native) await page.waitForFunction(() => window.orientationCalls.includes("landscape"));
    const side = await page.locator(".pp-viewport").evaluate(el => ({
      width: el.clientWidth, height: el.clientHeight, box: el.getBoundingClientRect().toJSON(),
      rotated: getComputedStyle(el).getPropertyValue("--pp-quarter-turn").trim() === "1",
    }));
    assert.ok(side.width > side.height, "reader content is landscape");
    if (mobileFallback) assert.ok(side.rotated, "portrait phone keeps a landscape reader when full screen is denied");
    if (side.rotated) {
      const x = side.box.x + side.box.width * .5, y = side.box.y + side.box.height * .05;
      await page.mouse.move(x, y);
      await page.mouse.down();
      await page.mouse.move(x, y + side.box.height * .18, { steps: 4 });
      await page.mouse.up();
      assert.ok(Number(await slider.inputValue()) < 60, "drag follows the rotated page edge");
    }
    await page.setViewportSize({ width: 844, height: 390 });
    await page.waitForFunction(() => getComputedStyle(document.querySelector(".pp-viewport")).getPropertyValue("--pp-quarter-turn").trim() !== "1");
  }
  await page.getByRole("button", { name: /เริ่มอ่านเรื่อง|Read the story/ }).click();
  await expanded.locator('.pp-viewport[data-scene="p01"]:not([data-turn])').waitFor();
  const next = expanded.locator(".pp-reading-spread .ui-round").last();
  const box = await next.boundingBox();
  assert.ok(await page.evaluate(b => b.x >= -1 && b.y >= -1 && b.x + b.width <= innerWidth + 1 && b.y + b.height <= innerHeight + 1, box),
    "page controls are visible on the same screen as the scene");
  await next.click();
  await expanded.locator('.pp-viewport[data-scene="p02"]:not([data-turn])').waitFor();
  if (mode === "print") await page.keyboard.press("Escape");
  else if (mode === "desktop") await page.evaluate(() => document.exitFullscreen());
  else await toggle.click();
  await expanded.waitFor({ state: "detached" });
  assert.equal(await page.evaluate(el => el === document.querySelector(".pp-viewport canvas"), canvas), true);
  assert.equal(await page.locator(".pp-viewport").getAttribute("data-scene"), "p02");
  assert.deepEqual(await page.evaluate(() => window.orientationCalls), mode === "touch" ? ["landscape", "unlock"] : []);
}

async function check(mode, width, height) {
  const fallback = mode === "print";
  const reducedMotion = mode === "desktop" ? "no-preference" : "reduce";
  const browser = fallback ? await firefox.launch() : await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_EXECUTABLE,
    args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
  });
  try {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion, hasTouch: mode === "touch" });
    const issues = [];
    page.on("pageerror", error => issues.push(error.message));
    page.on("console", message => { if (message.type() === "error") issues.push(message.text()); });
    page.on("response", r => { if (r.status() >= 400) issues.push(r.status() + " " + r.url()); });
    if (fallback) await page.addInitScript(() => {
      const get = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...args) {
        return type === "webgl2" ? null : get.call(this, type, ...args);
      };
    });
    const locale = mode === "desktop" ? "" : "/en";
    await page.goto(base + locale + "/learn/stories/nuh-paper-popup#paper-book");
    const scene = page.locator(".pp-viewport");
    const slider = page.getByRole("slider");
    const open = page.locator(".pp-lift-cover");
    await slider.waitFor();
    if (!fallback) await page.locator('.pp-viewport[data-live="true"]').waitFor();
    assert.equal(await scene.getAttribute("data-scene"), "cover");
    await slider.fill("40");
    const still = await scene.screenshot();
    await slider.fill("80");
    const furtherOpen = await scene.screenshot();
    await slider.fill("40");
    // Compare decoded pixels. Fractional scroll offsets on touch screens can
    // change rasterization at the frame edge without changing the fold.
    assert.ok(await difference(still, furtherOpen) > 4, "opening farther changes the rendered spread");
    assert.ok(await difference(still, await scene.screenshot()) < 2, "scrubbing back must reproduce the frame");
    await dragMiddle(page, scene, mode, .16);
    assert.ok(Number(await slider.inputValue()) < 35, "dragging the middle folds a partially open cover");
    await slider.fill("0");
    await open.click();
    const waitOpen = () => page.waitForFunction(() => document.querySelector(".pp-opening input").value === "100");
    await waitOpen();
    if (!fallback) {
      await scene.scrollIntoViewIfNeeded();
      const rect = await scene.boundingBox();
      const point = { x: rect.x + rect.width * .50, y: rect.y + rect.height * .37 };
      await page.mouse.click(point.x, point.y);
      const focus = page.getByRole("button", { name: /ดูเรือใกล้|Look closer/ });
      assert.equal(await focus.getAttribute("aria-pressed"), "true");
      await focus.click();
      const views = page.locator(".pp-camera-views button");
      assert.equal(await views.count(), 5);
      await page.waitForTimeout(450);
      let before = await scene.screenshot();
      for (const index of [2, 3, 4, 0, 1]) {
        await views.nth(index).click();
        assert.equal(await views.nth(index).getAttribute("aria-pressed"), "true");
        await page.waitForTimeout(450);
        const after = await scene.screenshot();
        assert.ok(await difference(before, after) > 4, "selecting a view changes the rendered camera angle");
        before = after;
      }
    } else {
      assert.equal(await scene.getAttribute("data-live"), "false");
      assert.match(await page.locator(".pp-printed-turn").evaluate(el => el.style.backgroundImage), /workshop.webp/);
    }
    await open.click();
    if (reducedMotion === "reduce") {
      assert.equal(await slider.inputValue(), "0");
      await open.click();
    } else {
      await page.waitForFunction(() => Number(document.querySelector(".pp-opening input").value) < 75);
    }
    await waitOpen();
    await dragMiddle(page, scene, mode, -.22);
    await page.locator('.pp-viewport[data-scene="p01"]:not([data-turn])').waitFor();
    await dragMiddle(page, scene, mode, -.24);
    await page.locator('.pp-viewport[data-scene="p02"]:not([data-turn])').waitFor();
    await dragMiddle(page, scene, mode, .24);
    await page.locator('.pp-viewport[data-scene="p01"]:not([data-turn])').waitFor();
    if (!fallback) assert.equal(await page.getByRole("button", { name: /ด้านหน้า|Front/ }).getAttribute("aria-pressed"), "true");
    await page.keyboard.press("ArrowLeft");
    await page.locator('.pp-viewport[data-scene="cover"]:not([data-turn])').waitFor();
    assert.equal(await slider.inputValue(), "0");
    if (fallback) await checkPrintedArrows(page);
    await checkFullscreen(page, mode);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.deepEqual(issues, []);
    console.log(mode, width, height, "passed");
  } finally {
    await browser.close();
  }
}
await check("desktop", 1280, 860);
await check("touch", 390, 844);
await check("print", 844, 390);
const mobileBrowser = await webkit.launch();
try {
  const page = await mobileBrowser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: "reduce" });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(base + "/en/learn/stories/nuh-paper-popup#paper-book");
  await page.locator('.pp-viewport[data-live="true"]').waitFor();
  await checkFullscreen(page, "phone-fallback");
  assert.deepEqual(errors, []);
  console.log("WebKit portrait phone, denied fullscreen, rotation and exit passed");
} finally {
  await mobileBrowser.close();
}
