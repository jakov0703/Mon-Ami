const { chromium } = require('playwright');
const path = require('path');
const PAGE = 'file://' + path.join(__dirname, '..', 'index.html').split(path.sep).join('/');
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({viewport:{width:1440,height:1000}})).newPage();
  p.on('console', m => console.log('  [page]', m.text()));
  await p.goto(PAGE, { waitUntil:'load' });
  await p.waitForTimeout(1200);
  // Watch class changes on the rail to see who sets what, and when.
  await p.evaluate(() => {
    window.__t0 = performance.now();
    const track = document.querySelector('.rail__track');
    new MutationObserver(muts => {
      muts.forEach(m => {
        if (m.attributeName !== 'class') return;
        const el = m.target;
        if (el.classList.contains('is-active'))
          console.log('+active ' + el.getAttribute('href') +
                      ' @' + Math.round(performance.now() - window.__t0) + 'ms');
      });
    }).observe(track, { attributes:true, subtree:true, attributeFilter:['class'] });
  });
  await p.evaluate(() => document.querySelector('#jelovnik').scrollIntoView());
  await p.waitForTimeout(400);
  console.log('--- clicking Jela od mesa ---');
  await p.click('.rail__track a[href="#c-jela-od-mesa"]');
  await p.waitForTimeout(2500);
  const fin = await p.evaluate(() => {
    const a = document.querySelector('.rail__track a.is-active');
    return a ? a.getAttribute('href') : null;
  });
  console.log('final active:', fin);
  await b.close();
})();
