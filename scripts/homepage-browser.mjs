// ตรวจพื้นฐานของหน้าแรกแบบวงเกาะโคจร (IslandOrbit) — ใช้ร่วมใน check-games-hub-browser และ game-landscape-stage1
// ตรวจละเอียดอยู่ใน check-home-browser.mjs
export async function inspectHomepage(page, check) {
  const m = await page.evaluate(() => {
    const f = document.querySelector('.orbit-island[data-front]');
    const r = f?.querySelector('.orbit-art')?.getBoundingClientRect();
    return {
      count: document.querySelectorAll('.orbit-island').length,
      overflow: document.documentElement.scrollWidth > innerWidth,
      front: f?.dataset.slug,
      frontInside: !!r && r.left >= 0 && r.right <= innerWidth,
      arrows: [...document.querySelectorAll('.orbit-arrow')].every(a => { const b = a.getBoundingClientRect(); return b.width >= 64 && b.height >= 64; }),
    };
  });
  check(m.count === 10, 'home: 10 islands in the orbit');
  check(!m.overflow, 'home: no horizontal scroll');
  check(m.frontInside, `home: front island (${m.front}) inside the screen`);
  check(m.arrows, 'home: orbit arrows ≥64px');
  return m;
}
