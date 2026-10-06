/* Keyboard, focus-management and reduced-motion checks — the things a
   colour audit cannot see. */
const { chromium } = require('playwright');
const path = require('path');
const PAGE = 'file://' + path.join(__dirname, 'index.html').split(path.sep).join('/');

(async () => {
  const b = await chromium.launch();
  const results = [];
  const ok = (name, pass, detail) => {
    results.push({ name, pass, detail: detail || '' });
    console.log((pass ? 'PASS  ' : 'FAIL  ') + name + (detail ? '  — ' + detail : ''));
  };

  /* ── Keyboard reachability ─────────────────────────────────────────── */
  const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 } });
  const p = await ctx.newPage();
  await p.goto(PAGE, { waitUntil: 'load' });
  await p.waitForTimeout(1500);

  // Tab through the header and confirm focus lands somewhere visible each time.
  const tabTrail = [];
  for (let i = 0; i < 12; i++) {
    await p.keyboard.press('Tab');
    const cur = await p.evaluate(() => {
      const a = document.activeElement;
      if (!a || a === document.body) return null;
      const r = a.getBoundingClientRect();
      const cs = getComputedStyle(a);
      return {
        tag: a.tagName.toLowerCase(),
        label: (a.textContent || a.getAttribute('aria-label') || '').trim().slice(0, 26),
        w: Math.round(r.width), h: Math.round(r.height),
        offscreen: r.bottom < 0 || r.top > innerHeight,
        outline: cs.outlineStyle !== 'none' && cs.outlineWidth !== '0px',
      };
    });
    if (cur) tabTrail.push(cur);
  }
  ok('every tab stop is on screen', tabTrail.every(t => !t.offscreen),
     tabTrail.filter(t => t.offscreen).map(t => t.label).join(', '));
  ok('every tab stop has a visible focus ring', tabTrail.every(t => t.outline),
     tabTrail.filter(t => !t.outline).map(t => t.tag + ' ' + t.label).join(', '));
  ok('first tab stop is the skip link', /prekoči|preskoči|skip/i.test(tabTrail[0].label),
     'got: "' + tabTrail[0].label + '"');

  /* ── Reservation dialog: focus trap + restore ──────────────────────── */
  await p.click('.hero__cta [data-open-booking]');
  await p.waitForTimeout(700);
  const inDialog = await p.evaluate(() =>
    !!document.activeElement.closest('#rezervacija'));
  ok('opening the booking form moves focus into it', inDialog);

  await p.keyboard.press('Escape');
  await p.waitForTimeout(500);
  const restored = await p.evaluate(() => ({
    closed: !document.getElementById('rezervacija').open,
    focus: (document.activeElement.textContent || '').trim().slice(0, 24),
  }));
  ok('Escape closes the booking form', restored.closed);
  ok('focus returns to the button that opened it',
     /rezerviraj/i.test(restored.focus), 'focus on: "' + restored.focus + '"');

  /* ── Lightbox keyboard nav ─────────────────────────────────────────── */
  await p.evaluate(() => document.querySelector('#galerija').scrollIntoView());
  await p.waitForTimeout(500);
  await p.click('.frame__btn');
  await p.waitForTimeout(600);
  const first = await p.evaluate(() => document.querySelector('#lightbox img').src.split('/').pop());
  await p.keyboard.press('ArrowRight');
  await p.waitForTimeout(400);
  const second = await p.evaluate(() => document.querySelector('#lightbox img').src.split('/').pop());
  ok('arrow keys move between photographs', first !== second, first + ' -> ' + second);
  await p.keyboard.press('Escape');
  await p.waitForTimeout(400);
  ok('Escape closes the lightbox',
     await p.evaluate(() => !document.getElementById('lightbox').open));

  /* ── Menu filter by keyboard alone ─────────────────────────────────── */
  await p.evaluate(() => {
    document.querySelector('#jelovnik').scrollIntoView();
    document.getElementById('f-gf').focus();
  });
  await p.keyboard.press('Space');
  await p.waitForTimeout(400);
  const filtered = await p.evaluate(() =>
    Array.from(document.querySelectorAll('.dish')).filter(d => d.offsetParent !== null).length);
  ok('diet filter works from the keyboard', filtered === 2, filtered + ' dishes shown');
  await p.keyboard.press('Space');
  await ctx.close();

  /* ── Reduced motion: content must still be visible ─────────────────── */
  const rc = await b.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const rp = await rc.newPage();
  await rp.goto(PAGE, { waitUntil: 'load' });
  await rp.waitForTimeout(1500);
  const hidden = await rp.evaluate(() =>
    Array.from(document.querySelectorAll('.reveal'))
      .filter(el => parseFloat(getComputedStyle(el).opacity) < 0.9).length);
  ok('nothing stays invisible with reduced motion', hidden === 0, hidden + ' hidden');
  await rc.close();

  /* ── No scroll-driven animation support: same check ────────────────── */
  const nf = await b.newContext({ viewport: { width: 1440, height: 1000 } });
  const np = await nf.newPage();
  // Simulate a browser without animation-timeline by disabling the feature
  // through a stylesheet override that mimics the unsupported path.
  await np.goto(PAGE, { waitUntil: 'load' });
  await np.addStyleTag({ content: '.reveal{animation:none!important}' });
  await np.waitForTimeout(800);
  const hidden2 = await np.evaluate(() =>
    Array.from(document.querySelectorAll('.reveal'))
      .filter(el => parseFloat(getComputedStyle(el).opacity) < 0.9).length);
  ok('content visible without scroll-animation support', hidden2 === 0, hidden2 + ' hidden');
  await nf.close();

  await b.close();
  const failed = results.filter(r => !r.pass);
  console.log('\n' + (failed.length === 0
    ? 'PASS — ' + results.length + ' checks'
    : 'FAIL — ' + failed.length + ' of ' + results.length));
})();
