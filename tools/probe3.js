const { chromium } = require('playwright');
const path = require('path');
const PAGE = 'file://' + path.join(__dirname, '..', 'index.html').split(path.sep).join('/');
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({viewport:{width:1440,height:1000}})).newPage();
  await p.goto(PAGE, { waitUntil:'load' });
  await p.waitForTimeout(2500);
  // Sample the actual painted pixels behind the hero caption text.
  const box = await p.evaluate(() => {
    const el = document.querySelector('.hero__cap');
    el.scrollIntoView({ block: 'center' });
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
  });
  await p.waitForTimeout(600);
  const shot = await p.screenshot({ clip: { x: box.x + 20, y: box.y + box.h - 22, width: 300, height: 16 } });
  const sharp = require('sharp');
  const { data, info } = await sharp(shot).raw().toBuffer({ resolveWithObject: true });
  // Darkest and brightest pixels in the strip the caption sits on.
  let min = 999, max = -1, sum = 0, n = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    const lum = 0.2126*data[i] + 0.7152*data[i+1] + 0.0722*data[i+2];
    min = Math.min(min, lum); max = Math.max(max, lum); sum += lum; n++;
  }
  await b.close();
  const rel = v => { v = v/255; return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4); };
  const paperLum = rel(249)*0.2126 + rel(246)*0.7152 + rel(240)*0.0722;
  const worst = (paperLum + 0.05) / (rel(max) + 0.05);
  console.log('caption strip luminance  min', min.toFixed(0), 'max', max.toFixed(0), 'mean', (sum/n).toFixed(0));
  console.log('worst-case contrast of cream text over the brightest pixel:', worst.toFixed(2), ':1');
})();
