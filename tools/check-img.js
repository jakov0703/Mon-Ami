const { chromium } = require('playwright');
const path = require('path');
const PAGE = 'file://' + path.join(__dirname, '..', 'index.html').split(path.sep).join('/');
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({viewport:{width:1440,height:1000}})).newPage();
  await p.goto(PAGE, { waitUntil:'load' });
  // Scroll the whole page so every lazy image is asked for, then wait for decode.
  await p.evaluate(async () => {
    for (let y=0; y<document.body.scrollHeight; y+=600) { window.scrollTo(0,y); await new Promise(r=>setTimeout(r,60)); }
    window.scrollTo(0,0);
  });
  await p.waitForTimeout(3500);
  const imgs = await p.evaluate(() => Array.from(document.images).map(i => ({
    src: i.currentSrc.split('/').pop() || i.getAttribute('src'),
    ok: i.complete && i.naturalWidth > 0,
    w: i.naturalWidth,
  })));
  await b.close();
  const bad = imgs.filter(i => !i.ok);
  console.log('images:', imgs.length, '| loaded:', imgs.length-bad.length, '| broken:', bad.length);
  bad.forEach(i => console.log('  BROKEN:', i.src));
  imgs.filter(i=>i.ok).forEach(i => console.log('  ok', String(i.w).padStart(5), i.src));
})();
