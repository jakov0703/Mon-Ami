const { chromium } = require('playwright');
const path = require('path');
const PAGE = 'file://' + path.join(__dirname, '..', 'index.html').split(path.sep).join('/');
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({viewport:{width:1440,height:1000}})).newPage();
  await p.goto(PAGE, { waitUntil:'load' });
  await p.waitForTimeout(1200);

  const cats = await p.evaluate(() =>
    Array.from(document.querySelectorAll('.rail__track a')).map(a => a.getAttribute('href')));

  let bad = 0;
  for (const href of cats) {
    // Reset to the top of the menu between cases so each click is a real jump.
    await p.evaluate(() => document.querySelector('#jelovnik').scrollIntoView());
    await p.waitForTimeout(400);
    await p.click('.rail__track a[href="' + href + '"]');
    // Wait for the scroll to settle AND the post-scroll resync (700ms).
    await p.waitForFunction(() => {
      if (window.__lastY === window.scrollY) { window.__still = (window.__still||0)+1; }
      else { window.__still = 0; window.__lastY = window.scrollY; }
      return window.__still > 6;
    }, null, { timeout: 5000 }).catch(()=>{});
    await p.waitForTimeout(900);

    const r = await p.evaluate(h => {
      const hdr = document.querySelector('.hdr').getBoundingClientRect();
      const tools = document.querySelector('.menu__tools').getBoundingClientRect();
      const cover = Math.max(hdr.bottom, tools.bottom);
      const h3 = document.querySelector(h).querySelector('h3').getBoundingClientRect();
      const a = document.querySelector('.rail__track a.is-active');
      return { headingTop: Math.round(h3.top), cover: Math.round(cover),
               obscured: h3.top < cover - 1,
               active: a ? a.getAttribute('href') : null };
    }, href);
    const ok = !r.obscured && r.active === href;
    if (!ok) bad++;
    console.log((ok ? '  ok   ' : '  BAD  ') + href.padEnd(28) +
      'heading y=' + String(r.headingTop).padStart(4) +
      ' (clear of ' + r.cover + ')  chip=' + (r.active === href ? 'correct' : r.active));
  }
  await b.close();
  console.log('\n' + (bad === 0 ? 'PASS — all ' + cats.length + ' categories'
                                : 'FAIL — ' + bad + ' of ' + cats.length));
})();
