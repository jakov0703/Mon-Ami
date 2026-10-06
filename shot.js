const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const PAGE = 'file://' + path.join(__dirname, 'index.html').split(path.sep).join('/');

(async () => {
  const errors = [];
  const browser = await chromium.launch();
  fs.mkdirSync('shots', { recursive: true });

  /* ── Desktop ──────────────────────────────────────────────────────── */
  const d = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const p = await d.newPage();
  p.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });
  p.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  p.on('requestfailed', r => errors.push('FAILED: ' + r.url().split('/').pop()));

  await p.goto(PAGE, { waitUntil: 'load' });
  await p.waitForTimeout(1200);

  // Walk the page so lazy images are requested and decoded before shooting,
  // otherwise section screenshots catch empty frames.
  async function settle(page) {
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 50));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(2500);
  }
  await settle(p);

  await p.screenshot({ path: 'shots/d-hero.png' });
  await p.screenshot({ path: 'shots/d-full.png', fullPage: true });

  const sections = [
    ['menu', '#jelovnik'], ['ulov', '#ulov'], ['prica', '#prica'],
    ['ljudi', '#ljudi'], ['vlastito', '#vlastito'], ['prostor', '#prostor'],
    ['galerija', '#galerija'], ['posjet', '#posjet'], ['facts', '.facts'],
  ];
  await p.addStyleTag({ content: '.hdr,.actionbar{visibility:hidden!important}' });
  for (const [name, sel] of sections) {
    const el = await p.$(sel);
    if (el) await el.screenshot({ path: 'shots/d-' + name + '.png' });
  }
  await p.addStyleTag({ content: '.hdr,.actionbar{visibility:visible!important}' });

  const info = await p.evaluate(() => {
    const chip = document.querySelector('[data-chip]');
    const today = document.querySelector('.hours tr[aria-current="date"] th');
    const slots = document.querySelectorAll('#r-time option');
    return {
      chipText: chip.querySelector('.chip__txt').textContent,
      chipState: chip.dataset.state,
      todayRow: today ? today.textContent.trim() : null,
      slotCount: slots.length,
      firstSlot: slots[0] ? slots[0].value : null,
      lastSlot: slots.length ? slots[slots.length - 1].value : null,
      dishCount: document.querySelectorAll('.dish').length,
      priceCount: document.querySelectorAll('.dish__price').length,
      lang: document.documentElement.lang,
      h1: document.querySelector('h1').textContent,
    };
  });

  /* ── Language toggle ──────────────────────────────────────────────── */
  await p.click('.lang-seg button[data-lang="en"]');
  await p.waitForTimeout(900);
  const en = await p.evaluate(() => ({
    lang: document.documentElement.lang,
    h1: document.querySelector('h1').textContent,
    firstDish: document.querySelector('.dish__hr').textContent,
    chip: document.querySelector('[data-chip] .chip__txt').textContent,
    navFirst: document.querySelector('.nav a').textContent,
  }));
  const menuEl = await p.$('#jelovnik');
  if (menuEl) await menuEl.screenshot({ path: 'shots/d-menu-en.png' });
  await p.click('.lang-seg button[data-lang="hr"]');
  await p.waitForTimeout(600);

  /* ── Reservation dialog ───────────────────────────────────────────── */
  await p.click('.hero__cta [data-open-booking]');
  await p.waitForTimeout(900);
  await p.screenshot({ path: 'shots/d-dialog.png' });
  const dlg = await p.evaluate(() => {
    const el = document.getElementById('rezervacija');
    return { open: el.open, slots: document.querySelectorAll('#r-time option').length };
  });
  await p.keyboard.press('Escape');
  await p.waitForTimeout(400);

  /* ── Lightbox ─────────────────────────────────────────────────────── */
  await p.evaluate(() => document.querySelector('#galerija').scrollIntoView());
  await p.waitForTimeout(700);
  await p.click('.frame__btn');
  await p.waitForTimeout(900);
  await p.screenshot({ path: 'shots/d-lightbox.png' });
  const lb = await p.evaluate(() => {
    const el = document.getElementById('lightbox');
    return { open: el.open, src: el.querySelector('img').getAttribute('src'),
             alt: el.querySelector('img').alt.slice(0, 50) };
  });
  await p.keyboard.press('Escape');

  /* ── Diet filter (CSS only) ───────────────────────────────────────── */
  await p.evaluate(() => document.querySelector('#jelovnik').scrollIntoView());
  await p.waitForTimeout(500);
  await p.click('label[for="f-gf"]');
  await p.waitForTimeout(500);
  const filtered = await p.evaluate(() => {
    const all = Array.from(document.querySelectorAll('.dish'));
    const vis = all.filter(d => d.offsetParent !== null);
    return { total: all.length, visible: vis.length,
             names: vis.slice(0, 6).map(d => d.querySelector('.dish__hr').textContent) };
  });
  await p.click('label[for="f-gf"]');

  /* ── Mobile ───────────────────────────────────────────────────────── */
  const m = await browser.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 2,
    isMobile: true, hasTouch: true,
  });
  const mp = await m.newPage();
  mp.on('pageerror', e => errors.push('MOBILE: ' + e.message));
  await mp.goto(PAGE, { waitUntil: 'load' });
  await mp.waitForTimeout(1500);
  await mp.screenshot({ path: 'shots/m-hero.png' });
  await mp.screenshot({ path: 'shots/m-full.png', fullPage: true });

  // Measure the fold BEFORE scrolling anywhere, or the numbers are nonsense.
  const fold = await mp.evaluate(() => {
    const cta = document.querySelector('.hero__cta').getBoundingClientRect();
    const chip = document.querySelector('.hero .chip').getBoundingClientRect();
    const bar = document.querySelector('.actionbar');
    return {
      viewportH: window.innerHeight,
      ctaBottom: Math.round(cta.bottom),
      ctaFitsAboveFold: cta.bottom <= window.innerHeight,
      chipBottom: Math.round(chip.bottom),
      actionBarVisible: getComputedStyle(bar).display !== 'none',
    };
  });

  await mp.evaluate(() => document.querySelector('#jelovnik').scrollIntoView());
  await mp.waitForTimeout(700);
  await mp.screenshot({ path: 'shots/m-menu.png' });

  /* ── Dark mode ────────────────────────────────────────────────────── */
  const dk = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'dark' });
  const dp = await dk.newPage();
  await dp.goto(PAGE, { waitUntil: 'load' });
  await settle(dp);
  await dp.screenshot({ path: 'shots/dark-hero.png' });
  for (const [name, sel] of [['menu', '#jelovnik'], ['ulov', '#ulov'], ['posjet', '#posjet'], ['vlastito', '#vlastito']]) {
    const el = await dp.$(sel);
    if (el) await el.screenshot({ path: 'shots/dark-' + name + '.png' });
  }

  await browser.close();

  console.log(JSON.stringify({ info, en, dlg, lb, filtered, fold }, null, 2));
  const uniq = [...new Set(errors)];
  console.log('\n=== ERRORS (' + uniq.length + ' unique) ===');
  uniq.slice(0, 30).forEach(e => console.log('  ' + e));
})();
