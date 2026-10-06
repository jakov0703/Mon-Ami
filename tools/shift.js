const { chromium } = require('playwright');
const path = require('path');
const PAGE = 'file://' + path.join(__dirname, '..', 'index.html').split(path.sep).join('/');
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({viewport:{width:1440,height:1000}})).newPage();
  await p.addInitScript(() => {
    window.__shifts = [];
    new PerformanceObserver(l => {
      for (const e of l.getEntries()) {
        if (e.hadRecentInput) continue;
        window.__shifts.push({
          value: Math.round(e.value * 100000) / 100000,
          at: Math.round(e.startTime),
          sources: (e.sources || []).map(s => s.node ?
            (s.node.tagName || '?') + '.' + String(s.node.className || '').split(' ')[0] : '?'),
        });
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });
  await p.goto(PAGE, { waitUntil:'load' });
  await p.waitForTimeout(3500);
  const s = await p.evaluate(() => window.__shifts);
  await b.close();
  console.log(JSON.stringify(s, null, 2));
})();
