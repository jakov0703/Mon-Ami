/* Reproduces the two reported menu bugs:
   1. something wrong while scrolling through the menu
   2. choosing a category group behaves badly
   Measures rather than guesses. */
const { chromium } = require('playwright');
const path = require('path');
const PAGE = 'file://' + path.join(__dirname, '..', 'index.html').split(path.sep).join('/');

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 } });
  const p = await ctx.newPage();
  await p.goto(PAGE, { waitUntil: 'load' });
  await p.waitForTimeout(1500);

  /* ── How tall is the sticky chrome that content must clear? ─────────── */
  const chrome = await p.evaluate(() => {
    document.querySelector('#jelovnik').scrollIntoView();
    return new Promise(res => setTimeout(() => {
      const hdr = document.querySelector('.hdr').getBoundingClientRect();
      const tools = document.querySelector('.menu__tools').getBoundingClientRect();
      const root = getComputedStyle(document.documentElement);
      const cat = document.querySelector('.menu__cat');
      return res({
        headerBottom: Math.round(hdr.bottom),
        toolsTop: Math.round(tools.top),
        toolsBottom: Math.round(tools.bottom),
        toolsH: Math.round(tools.height),
        stickyChromeBottom: Math.round(Math.max(hdr.bottom, tools.bottom)),
        scrollPaddingTop: root.scrollPaddingTop,
        catScrollMargin: getComputedStyle(cat).scrollMarginTop,
      });
    }, 500));
  });
  console.log('--- sticky chrome ---');
  console.log(JSON.stringify(chrome, null, 2));
  const needed = chrome.stickyChromeBottom;
  console.log('content must start below: ' + needed + 'px');
  console.log('scroll-margin currently reserves: ' + chrome.catScrollMargin);

  /* ── BUG 2: click each category chip, is its heading actually visible? ── */
  console.log('\n--- clicking each category chip ---');
  const cats = await p.evaluate(() =>
    Array.from(document.querySelectorAll('.rail__track a')).map(a => a.getAttribute('href')));

  const catResults = [];
  for (const href of cats) {
    await p.evaluate(h => {
      const a = document.querySelector('.rail__track a[href="' + h + '"]');
      a.click();
    }, href);
    await p.waitForTimeout(900);
    const r = await p.evaluate(h => {
      const sec = document.querySelector(h);
      const head = sec.querySelector('h3');
      const hb = head.getBoundingClientRect();
      const hdr = document.querySelector('.hdr').getBoundingClientRect();
      const tools = document.querySelector('.menu__tools').getBoundingClientRect();
      const cover = Math.max(hdr.bottom, tools.bottom);
      const active = document.querySelector('.rail__track a.is-active');
      return {
        id: h,
        headingTop: Math.round(hb.top),
        coveredBy: Math.round(cover),
        obscured: hb.top < cover - 1,
        activeChip: active ? active.getAttribute('href') : null,
        activeMatches: active ? active.getAttribute('href') === h : false,
      };
    }, href);
    catResults.push(r);
    console.log((r.obscured ? '  BAD  ' : '  ok   ') + r.id.padEnd(26) +
      'heading at y=' + String(r.headingTop).padStart(4) +
      '  sticky covers to ' + r.coveredBy +
      (r.activeMatches ? '  chip ok' : '  chip=' + r.activeChip));
  }
  const obscured = catResults.filter(r => r.obscured).length;
  const wrongChip = catResults.filter(r => !r.activeMatches).length;
  console.log('headings hidden under sticky chrome: ' + obscured + '/' + catResults.length);
  console.log('wrong chip highlighted: ' + wrongChip + '/' + catResults.length);

  /* ── BUG 1: does the page fight the user while scrolling the menu? ──── */
  console.log('\n--- scrolling through the menu, watching for jumps ---');
  await p.evaluate(() => {
    window.__trace = [];
    window.__t0 = performance.now();
    const rec = () => {
      window.__trace.push({ t: Math.round(performance.now() - window.__t0), y: Math.round(window.scrollY) });
      if (window.__trace.length < 400) requestAnimationFrame(rec);
    };
    rec();
  });
  // Scroll down in small steps, the way a wheel does.
  await p.evaluate(() => document.querySelector('#jelovnik').scrollIntoView());
  await p.waitForTimeout(400);
  for (let i = 0; i < 40; i++) {
    await p.mouse.wheel(0, 120);
    await p.waitForTimeout(55);
  }
  await p.waitForTimeout(700);

  const trace = await p.evaluate(() => window.__trace);
  // A reversal while scrolling down means something scrolled the page back.
  let reversals = [], maxRev = 0;
  for (let i = 2; i < trace.length; i++) {
    const d = trace[i].y - trace[i - 1].y;
    if (d < -3) { reversals.push({ t: trace[i].t, from: trace[i - 1].y, to: trace[i].y, d });
                  maxRev = Math.min(maxRev, d); }
  }
  console.log('frames sampled: ' + trace.length);
  console.log('backward jumps while scrolling down: ' + reversals.length +
              (reversals.length ? '  (largest ' + maxRev + 'px)' : ''));
  reversals.slice(0, 12).forEach(r =>
    console.log('    t=' + String(r.t).padStart(5) + 'ms  ' + r.from + ' -> ' + r.to + '  (' + r.d + 'px)'));

  /* ── BUG 2b: filters hide categories, but chips still link to them ──── */
  console.log('\n--- category chips while a filter is active ---');
  await p.evaluate(() => { document.getElementById('f-gf').checked = true;
                           document.getElementById('f-gf').dispatchEvent(new Event('change', {bubbles:true})); });
  await p.waitForTimeout(500);
  const withFilter = await p.evaluate(() => {
    const chips = Array.from(document.querySelectorAll('.rail__track a'));
    return chips.map(a => {
      const sec = document.querySelector(a.getAttribute('href'));
      return { href: a.getAttribute('href'),
               chipVisible: a.offsetParent !== null,
               sectionVisible: sec ? sec.offsetParent !== null : false };
    });
  });
  const dead = withFilter.filter(x => x.chipVisible && !x.sectionVisible);
  console.log('chips still shown that now lead nowhere: ' + dead.length + '/' + withFilter.length);
  dead.forEach(d => console.log('    ' + d.href));

  await b.close();
})();
