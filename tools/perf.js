const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const PAGE = 'file://' + path.join(__dirname, '..', 'index.html').split(path.sep).join('/');
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({viewport:{width:1440,height:1000}})).newPage();
  const bytes = {};
  p.on('response', async r => {
    try {
      const u = r.url().split('/').pop().split('?')[0];
      const h = r.headers()['content-length'];
      const ext = (u.match(/\.(\w+)$/)||[,'other'])[1];
      bytes[ext] = (bytes[ext]||0) + (h ? +h : 0);
    } catch(e){}
  });
  await p.goto(PAGE, { waitUntil:'load' });
  await p.waitForTimeout(3000);

  const m = await p.evaluate(() => new Promise(res => {
    const out = { lcp:null, cls:0, shifts:0 };
    try {
      new PerformanceObserver(l => {
        const e = l.getEntries();
        out.lcp = Math.round(e[e.length-1].startTime);
        out.lcpEl = e[e.length-1].element ? e[e.length-1].element.tagName + '.' +
                    (e[e.length-1].element.className||'').split(' ')[0] : '?';
        out.lcpUrl = (e[e.length-1].url||'').split('/').pop();
      }).observe({type:'largest-contentful-paint', buffered:true});
      new PerformanceObserver(l => {
        for (const e of l.getEntries()) if (!e.hadRecentInput) { out.cls += e.value; out.shifts++; }
      }).observe({type:'layout-shift', buffered:true});
    } catch(e) { out.err = e.message; }
    setTimeout(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      out.domContentLoaded = Math.round(nav.domContentLoadedEventEnd);
      out.load = Math.round(nav.loadEventEnd);
      out.cls = Math.round(out.cls * 10000)/10000;
      out.domNodes = document.querySelectorAll('*').length;
      res(out);
    }, 2200);
  }));
  await b.close();

  console.log('HTML file size:', (fs.statSync('index.html').size/1024).toFixed(1), 'KB');
  console.log('bytes by type:', JSON.stringify(bytes));
  console.log('metrics:', JSON.stringify(m, null, 2));
})();
