const { chromium } = require('playwright');
const path = require('path');
const PAGE = 'file://' + path.join(__dirname, '..', 'index.html').split(path.sep).join('/');
(async () => {
  const b = await chromium.launch();
  // Block Google Fonts: if the remaining shift is the webfont swap, CLS
  // should drop to ~0 with the fallback metrics doing their job.
  const ctx = await b.newContext({ viewport:{width:1440,height:1000} });
  await ctx.route('**fonts.googleapis.com**', r => r.abort());
  await ctx.route('**fonts.gstatic.com**', r => r.abort());
  const p = await ctx.newPage();
  await p.addInitScript(() => {
    window.__cls = 0;
    new PerformanceObserver(l => { for (const e of l.getEntries())
      if (!e.hadRecentInput) window.__cls += e.value;
    }).observe({ type:'layout-shift', buffered:true });
  });
  await p.goto(PAGE, { waitUntil:'load' });
  await p.waitForTimeout(3000);
  const cls = await p.evaluate(() => Math.round(window.__cls * 100000)/100000);
  await b.close();
  console.log('CLS with webfonts blocked (fallback metrics only):', cls);
})();
