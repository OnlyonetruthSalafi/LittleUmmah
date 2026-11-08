// Shared by home, hub and landscape regressions; all homepage routes use the
// learn/play sections rather than the retired age selector/footer shortcuts.
export async function inspectHomepage(page, check) {
  const m = await page.evaluate(() => {
    const box = e => { const r=e.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height}; };
    const zones = [...document.querySelectorAll('[data-home-zone]')];
    return {
      width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
      zones: zones.map(e=>e.dataset.homeZone),
      learn: [...document.querySelectorAll('[data-home-zone="learn"] li')].map(e=>({slug:e.dataset.slug,...box(e),image:box(e.querySelector("img"))})),
      play: [...document.querySelectorAll('[data-home-zone="play"] li')].map(e=>({slug:e.dataset.slug,...box(e),image:box(e.querySelector('img'))})),
      links: [...document.querySelectorAll('[data-home-zone] a')].map(e=>({href:e.getAttribute('href'),...box(e)})),
      captions: [...document.querySelectorAll('[data-home-zone] .island-caption')].map(box),
      soon: [...document.querySelectorAll('[data-coming-soon]')].map(e=>({linked:!!e.closest('a'),focusable:e.tabIndex>=0,label:e.getAttribute('aria-label'),tag:e.tagName,type:e.type,...box(e)})),
      alts: [...document.querySelectorAll('[data-home-zone] img')].map(e=>e.alt),
      parents: !!document.querySelector('header a[href$="/parents"]'),
      age: !!document.querySelector('main a[href="/kids"],main a[href="/juniors"]'),
      footer: !!document.querySelector('main .ui-chip, main footer'),
      order: zones.length===2 && !!(zones[0].compareDocumentPosition(document.querySelector('h1')) & Node.DOCUMENT_POSITION_FOLLOWING) && !!(document.querySelector('h1').compareDocumentPosition(zones[1]) & Node.DOCUMENT_POSITION_FOLLOWING),
    };
  });
  check(m.zones.join()==='learn,play' && m.order,'home: learn → Hero → play');
  check(m.learn.length===5 && m.learn[0]?.slug==='arabic','home: 5 learn islands, Arabic first');
  check(m.learn.slice(1).every(e=>e.y>m.learn[0].y),'home: Arabic uniquely highest');
  check(m.play.map(e=>e.slug).join() === 'stories,art,games,numbers-math,explore','home: 5 main adventure islands, Games centered');
  check(m.links.length===6 && m.links.every(e=>e.w>=64&&e.h>=64),'home: 6 live links ≥64px');
  check(m.soon.length===4 && m.soon.every(e=>!e.linked&&e.focusable&&e.tag==='BUTTON'&&e.type==='button'&&e.w>=64&&e.h>=64&&e.label),'home: four accessible locked island buttons');
  check(m.alts.every(a=>a===''),'home: decorative image alt empty');
  check(m.parents&&!m.age&&!m.footer,'home: parents retained, age selector/footer removed');
  check(m.scrollWidth<=m.width,'home: no horizontal overflow');

  const overlaps = items => items.some((a,i)=>items.slice(i+1).some(b=>a.x+a.w>b.x+.5&&b.x+b.w>a.x+.5&&a.y+a.h>b.y+.5&&b.y+b.h>a.y+.5));
  // Wide learn artwork may interleave; the real links and label boxes may not.
  check(!overlaps([...m.links,...m.soon])&&!overlaps(m.captions),'home: no overlapping island targets or captions');
  check(m.learn.map(e=>e.slug).join()==='arabic,moral,tajweed,quran-reading,faith-basics','home: exact upper membership and DOM order');
  check(m.links.every(e=>!/\/games\//.test(e.href)),'home: no subgame shortcuts');
  const p=m.play;
  if (p.length===5) {
    check(p[0].y<p[1].y&&p[1].y<p[2].y,'home: left half descends to Games');
    check(p.slice(0,2).every((e,i)=>Math.abs(e.y-p[4-i].y)<1),'home: symmetric U heights');
    check(Math.abs(p[2].image.w/p[0].image.w-1.2)<.01,'home: Games image 1.2x');
    const ts=m.width<1024?[0,(1-Math.sqrt(.5))/2,.5,(1+Math.sqrt(.5))/2,1]:[0,.25,.5,.75,1];
    const rise=p[2].y-p[0].y;
    check(p.every((e,i)=>Math.abs(e.y-p[0].y-rise*4*ts[i]*(1-ts[i]))<1),'home: measured lower Bezier');
    if(m.width>=1024) check(p.every((e,i)=>i===0||e.x>p[i-1].x),'home: desktop left-to-right order');
  }
  const l=m.learn;
  if(l.length===5) {
    const samples=m.width<768?[0,1,.5,.5,1]:[0,1,.25,.25,1];
    const rise=l[1].y-l[0].y;
    check(l.every((e,i)=>Math.abs(e.y-l[0].y-rise*samples[i])<1),'home: measured single upper Bezier');
    check(l.every(e=>Math.abs(e.image.w-l[0].image.w)<1),'home: equal upper image size');
    if(m.width<768||m.width>=1024)check(p.every(e=>Math.abs(e.image.w-l[0].image.w)<1||e.slug==='games'),'home: equal upper/lower image size');
    if(m.width<=430)check(l.every(e=>e.image.w/m.width>=.4&&e.image.w/m.width<=.48),'home: mobile image frames 40-48vw (visible alpha checked in report)');
  }
  const url = page.url();
  for (const button of await page.locator('[data-coming-soon]').all()) {
    await button.click();
    check(await page.locator('.island-notice[data-visible="true"]').count()===1,'home: locked island opens one toast');
    check(page.url()===url,'home: locked island does not navigate');
    check((await page.getByRole('status').innerText()).length>0,'home: polite status has message');
    await page.locator('.island-notice-close').click();
  }
  await page.evaluate(()=>window.scrollTo(0,0));
  return m;
}
