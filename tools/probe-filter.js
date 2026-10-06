const { chromium } = require('playwright');
const path = require('path');
const PAGE = 'file://' + path.join(__dirname, '..', 'index.html').split(path.sep).join('/');

const CASES = [
  { ids:['f-gf'],            label:'Bez glutena' },
  { ids:['f-veg'],           label:'Vegetarijanski' },
  { ids:['f-fish'],          label:'Riba' },
  { ids:['f-meat'],          label:'Meso' },
  { ids:['f-fish','f-meat'], label:'Riba + Meso' },
  { ids:['f-gf','f-veg'],    label:'Bez glutena + Vegetarijanski' },
];

(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({viewport:{width:1440,height:1000}})).newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto(PAGE, { waitUntil:'load' });
  await p.waitForTimeout(1300);
  await p.evaluate(() => document.querySelector('#jelovnik').scrollIntoView());
  await p.waitForTimeout(400);

  let bad = 0;
  for (const c of CASES) {
    // Clear, then apply this case.
    await p.evaluate(() => document.querySelectorAll('.filters input')
      .forEach(i => { if (i.checked) i.click(); }));
    await p.waitForTimeout(250);
    for (const id of c.ids) await p.click('label[for="' + id + '"]');
    await p.waitForTimeout(450);

    const r = await p.evaluate(ids => {
      const wanted = ids.map(i => i.replace('f-',''));
      const dishes = Array.from(document.querySelectorAll('.dish'));
      const shown = dishes.filter(d => d.offsetParent !== null);
      // Every shown dish must match at least one checked diet (OR logic).
      const wrongDish = shown.filter(d => {
        const diets = (d.dataset.diet || '').split(/\s+/);
        return !wanted.some(w => diets.includes(w));
      }).length;
      // Every dish that matches must be shown.
      const missing = dishes.filter(d => {
        const diets = (d.dataset.diet || '').split(/\s+/);
        return wanted.some(w => diets.includes(w)) && d.offsetParent === null;
      }).length;
      // No chip may point at a hidden or empty category.
      const chips = Array.from(document.querySelectorAll('.rail__track a'));
      const visibleChips = chips.filter(a => a.offsetParent !== null);
      const deadChips = visibleChips.filter(a => {
        const sec = document.querySelector(a.getAttribute('href'));
        if (!sec || sec.offsetParent === null) return true;
        return sec.querySelectorAll('.dish').length > 0 &&
               Array.from(sec.querySelectorAll('.dish')).every(d => d.offsetParent === null);
      }).length;
      // No visible category may be empty.
      const emptyCats = Array.from(document.querySelectorAll('.menu__cat'))
        .filter(s => s.offsetParent !== null &&
          Array.from(s.querySelectorAll('.dish')).every(d => d.offsetParent === null)).length;
      return { shown: shown.length, wrongDish, missing,
               chips: visibleChips.length, deadChips, emptyCats };
    }, c.ids);

    const ok = r.wrongDish === 0 && r.missing === 0 && r.deadChips === 0 && r.emptyCats === 0;
    if (!ok) bad++;
    console.log((ok ? '  ok   ' : '  BAD  ') + c.label.padEnd(32) +
      r.shown + ' dishes, ' + r.chips + ' chips' +
      (r.wrongDish ? '  wrongDish=' + r.wrongDish : '') +
      (r.missing ? '  missing=' + r.missing : '') +
      (r.deadChips ? '  deadChips=' + r.deadChips : '') +
      (r.emptyCats ? '  emptyCats=' + r.emptyCats : ''));
  }

  // Clearing all filters must restore everything.
  await p.evaluate(() => document.querySelectorAll('.filters input')
    .forEach(i => { if (i.checked) i.click(); }));
  await p.waitForTimeout(450);
  const restored = await p.evaluate(() => ({
    dishes: Array.from(document.querySelectorAll('.dish')).filter(d => d.offsetParent !== null).length,
    chips: Array.from(document.querySelectorAll('.rail__track a')).filter(a => a.offsetParent !== null).length,
  }));
  const restoreOk = restored.dishes === 62 && restored.chips === 11;
  if (!restoreOk) bad++;
  console.log((restoreOk ? '  ok   ' : '  BAD  ') + 'clearing filters restores all'.padEnd(32) +
    restored.dishes + ' dishes, ' + restored.chips + ' chips');

  await b.close();
  console.log('  JS errors: ' + (errs.length ? errs.join('; ') : 'none'));
  console.log('\n' + (bad === 0 && !errs.length ? 'PASS — filters correct in all cases'
                                                : 'FAIL — ' + bad + ' cases'));
})();
