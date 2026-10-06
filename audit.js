/* Measures the real rendered contrast of every text node against the colour
   actually painted behind it, in both themes — plus target sizes and
   document structure. Cheaper than trusting a spec table: a colour token can
   be correct and still be used against the wrong background. */
const { chromium } = require('playwright');
const path = require('path');
const PAGE = 'file://' + path.join(__dirname, 'index.html').split(path.sep).join('/');

const CONTRAST = () => {
  const relLum = (r, g, b) => {
    const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  /* getComputedStyle returns modern colours verbatim — "oklch(0.22 0.012 60)"
     rather than rgb() — so the numbers cannot be read as RGB channels.
     Painting the value into a 1x1 canvas makes the browser itself do the
     conversion, which is both correct and future-proof. */
  const probe = document.createElement('canvas');
  probe.width = probe.height = 1;
  const cx = probe.getContext('2d', { willReadFrequently: true });
  const cache = {};
  const parse = str => {
    const s = String(str).trim();
    if (!s || s === 'none' || s === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
    if (cache[s]) return cache[s];
    cx.clearRect(0, 0, 1, 1);
    cx.fillStyle = '#000';
    cx.fillStyle = s;                    // invalid values leave it at #000
    cx.clearRect(0, 0, 1, 1);
    cx.fillStyle = s;
    cx.fillRect(0, 0, 1, 1);
    const d = cx.getImageData(0, 0, 1, 1).data;
    const out = { r: d[0], g: d[1], b: d[2], a: d[3] / 255 };
    cache[s] = out;
    return out;
  };
  const over = (fg, bg) => ({            // flatten a translucent colour
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1,
  });
  const bgOf = el => {
    let n = el; const stack = [];
    while (n && n.nodeType === 1) {
      const c = parse(getComputedStyle(n).backgroundColor);
      if (c && c.a > 0) { stack.push(c); if (c.a >= 0.999) break; }
      n = n.parentElement;
    }
    let base = { r: 255, g: 255, b: 255, a: 1 };
    for (let i = stack.length - 1; i >= 0; i--) base = over(stack[i], base);
    return base;
  };
  const ratio = (a, b) => {
    const L1 = relLum(a.r, a.g, a.b), L2 = relLum(b.r, b.g, b.b);
    return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
  };

  const rows = []; const seen = {};
  const els = document.querySelectorAll('body *');
  for (let i = 0; i < els.length; i++) {
    const el = els[i];
    let text = '';
    for (let k = 0; k < el.childNodes.length; k++) {
      const n = el.childNodes[k];
      if (n.nodeType === 3 && n.textContent.trim()) text += n.textContent.trim() + ' ';
    }
    text = text.trim();
    if (!text) continue;

    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    if (parseFloat(cs.opacity) < 0.15) continue;
    const bb = el.getBoundingClientRect();
    if (bb.width < 2 || bb.height < 2) continue;
    if (el.closest('.vh')) continue;

    /* Text over a photograph or a gradient scrim cannot be judged from
       computed styles — there is no single background colour to compare
       against. Those are measured from real pixels instead (see probe3.js);
       reporting them here would be a false failure. */
    let onImage = false;
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const bgi = getComputedStyle(n).backgroundImage;
      if (bgi && bgi !== 'none') { onImage = true; break; }
      if (n.classList && (n.classList.contains('hero__figure') ||
          n.classList.contains('frame__box'))) { onImage = true; break; }
    }
    if (onImage) continue;

    let fg = parse(cs.color);
    if (!fg) continue;
    const bg = bgOf(el);
    if (fg.a < 0.999) fg = over(fg, bg);

    const px = parseFloat(cs.fontSize);
    const weight = parseInt(cs.fontWeight, 10) || 400;
    const large = px >= 24 || (weight >= 700 && px >= 18.66);
    const need = large ? 3 : 4.5;
    const got = Math.round(ratio(fg, bg) * 100) / 100;

    const key = cs.color + '|' + Math.round(bg.r) + ',' + Math.round(bg.g) + ',' +
                Math.round(bg.b) + '|' + Math.round(px);
    if (seen[key]) continue;
    seen[key] = 1;

    rows.push({
      pass: got >= need, ratio: got, need, px: Math.round(px * 10) / 10,
      cls: String(el.className || el.tagName).split(' ')[0],
      text: text.slice(0, 46),
    });
  }
  rows.sort((a, b) => a.ratio - b.ratio);
  return rows;
};

const TARGETS = () => {
  const bad = [];
  document.querySelectorAll('a[href], button, input, select, textarea').forEach(el => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return;
    const r = el.getBoundingClientRect();
    if (r.width <= 2 && r.height <= 2) return;   // styled-label proxies
    if (r.width === 0 || r.height === 0) return;
    if (el.closest('.vh')) return;
    if (r.width < 24 || r.height < 24) {
      bad.push({ w: Math.round(r.width), h: Math.round(r.height),
        tag: el.tagName.toLowerCase(), cls: String(el.className || '').split(' ')[0],
        text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30) });
    }
  });
  return bad;
};

const STRUCTURE = () => {
  const hs = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6'))
    .map(h => ({ lvl: +h.tagName[1], text: h.textContent.trim().slice(0, 40) }));
  const jumps = [];
  for (let i = 1; i < hs.length; i++) {
    if (hs[i].lvl - hs[i - 1].lvl > 1) jumps.push(hs[i - 1].text + ' -> ' + hs[i].text);
  }
  const imgs = Array.from(document.images);
  let jsonLd = 'MISSING';
  const s = document.querySelector('script[type="application/ld+json"]');
  if (s) { try { jsonLd = JSON.parse(s.textContent)['@type'] + ' ok'; }
           catch (e) { jsonLd = 'INVALID: ' + e.message; } }
  return {
    h1Count: hs.filter(h => h.lvl === 1).length,
    headingJumps: jumps,
    imgsMissingAlt: imgs.filter(i => !i.hasAttribute('alt')).length,
    imgsNoDims: imgs.filter(i => !i.getAttribute('width') || !i.getAttribute('height')).length,
    landmarks: { header: !!document.querySelector('header'), main: !!document.querySelector('main'),
                 footer: !!document.querySelector('footer'), nav: document.querySelectorAll('nav').length },
    lang: document.documentElement.lang,
    jsonLd,
  };
};

(async () => {
  const b = await chromium.launch();
  let totalFails = 0;

  for (const scheme of ['light', 'dark']) {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: scheme });
    const p = await ctx.newPage();
    await p.goto(PAGE, { waitUntil: 'load' });
    await p.waitForTimeout(1800);

    const rows = await p.evaluate(CONTRAST);
    const fails = rows.filter(r => !r.pass);
    totalFails += fails.length;
    console.log('\n===== ' + scheme.toUpperCase() + ' — contrast =====');
    console.log('distinct pairs: ' + rows.length + ' | failing: ' + fails.length);
    fails.forEach(r => console.log('  FAIL ' + r.ratio + ' (need ' + r.need + ') ' +
      r.px + 'px .' + r.cls + '  "' + r.text + '"'));
    console.log('  tightest passing pairs:');
    rows.filter(r => r.pass).slice(0, 6).forEach(r =>
      console.log('    ' + r.ratio.toFixed(2) + '  ' + r.px + 'px  .' + r.cls));

    if (scheme === 'light') {
      const t = await p.evaluate(TARGETS);
      console.log('\n===== targets below 24px: ' + t.length + ' =====');
      t.forEach(x => console.log('  ' + x.w + 'x' + x.h + ' ' + x.tag + '.' + x.cls + ' "' + x.text + '"'));
      console.log('\n===== structure =====');
      console.log(JSON.stringify(await p.evaluate(STRUCTURE), null, 2));
    }
    await ctx.close();
  }

  await b.close();
  console.log('\n' + (totalFails === 0 ? 'PASS — no contrast failures in either theme'
                                       : 'FAIL — ' + totalFails + ' contrast problems'));
})();
