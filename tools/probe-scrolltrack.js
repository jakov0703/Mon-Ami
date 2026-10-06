const { chromium } = require('playwright');
const path = require('path');
const PAGE = 'file://' + path.join(__dirname, '..', 'index.html').split(path.sep).join('/');

async function run(vp, label) {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: vp, isMobile: vp.width < 500, hasTouch: vp.width < 500 })).newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto(PAGE, { waitUntil:'load' });
  await p.waitForTimeout(1300);

  console.log('\n=== ' + label + ' (' + vp.width + 'x' + vp.height + ') ===');

  // Scroll slowly through the whole menu; at each stop the highlighted chip
  // should match the category actually under the sticky chrome.
  await p.evaluate(() => document.querySelector('#jelovnik').scrollIntoView());
  await p.waitForTimeout(600);

  let checks = 0, wrong = 0, jumps = 0, lastY = -1;
  for (let i = 0; i < 60; i++) {
    await p.mouse.wheel(0, 200);
    await p.waitForTimeout(90);
    const s = await p.evaluate(() => {
      const hdr = document.querySelector('.hdr').getBoundingClientRect();
      const tools = document.querySelector('.menu__tools').getBoundingClientRect();
      let h = hdr.height; if (tools.top <= h + 2) h += tools.height;
      // Same line the page derives: max(sticky, scrollMargin + toolbar) + 20
      const cat0 = document.querySelector('.menu__cat');
      const margin = parseFloat(getComputedStyle(cat0).scrollMarginTop) || 0;
      const line = Math.max(h, margin + tools.height) + 20;
      // Which category is genuinely occupying the reading area?
      let actual = null;
      document.querySelectorAll('.menu__cat').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top <= line) actual = el.id;   // last one past the line
      });
      const a = document.querySelector('.rail__track a.is-active');
      return { actual, active: a ? a.getAttribute('href').slice(1) : null,
               y: Math.round(window.scrollY),
               inMenu: !!document.querySelector('.menu').getBoundingClientRect &&
                       document.querySelector('.menu').getBoundingClientRect().bottom > 200 };
    });
    if (lastY >= 0 && s.y < lastY - 3) jumps++;
    lastY = s.y;
    if (s.actual && s.inMenu) {
      checks++;
      if (s.active !== s.actual) { wrong++;
        if (wrong <= 4) console.log('  mismatch at y=' + s.y + ': reading ' + s.actual + ', chip says ' + s.active); }
    }
  }
  console.log('  chip matched the section being read: ' + (checks - wrong) + '/' + checks);
  console.log('  backward scroll jumps: ' + jumps);
  console.log('  JS errors: ' + (errs.length ? errs.join('; ') : 'none'));
  await b.close();
  return { wrong, jumps, errs: errs.length };
}

(async () => {
  const d = await run({ width:1440, height:1000 }, 'desktop');
  const m = await run({ width:390, height:844 }, 'mobile');
  const bad = d.wrong + d.jumps + d.errs + m.wrong + m.jumps + m.errs;
  console.log('\n' + (bad === 0 ? 'PASS — tracking and scrolling clean on both' : 'ISSUES: ' + bad));
})();
