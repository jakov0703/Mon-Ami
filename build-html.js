/* ════════════════════════════════════════════════════════════════════════
   Assembles index.html from src/. Run:  node build-html.js

   Why a generator rather than hand-written HTML: the 62 menu rows, the
   opening hours and the search-engine data all have to agree with each
   other. Deriving them from one source means they cannot drift apart.
   The output is a single self-contained file with no build step of its own.
   ════════════════════════════════════════════════════════════════════════ */
const fs = require('fs');
const path = require('path');
const D = require('./src/data.js');
const I18N = require('./src/i18n.js');

const { INFO, HOURS, AWARDS, MENU, CATEGORIES, CATEGORIES_EN,
        CATEGORY_NOTES, GALLERY, SUPPLIERS, SPECIES, TIMELINE, DAYS } = D;

/* ── helpers ──────────────────────────────────────────────────────────── */
const esc = s => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

/* A span whose text the language toggle replaces. */
const T = (key, tag = 'span', attrs = '') =>
  `<${tag} data-i18n="${key}"${attrs ? ' ' + attrs : ''}>${esc(I18N[key].hr)}</${tag}>`;

const t = key => I18N[key].hr;

/* Paired strings that are not in the dictionary (dish names, captions). */
const pair = (hr, en, tag = 'span', cls = '') =>
  `<${tag}${cls ? ` class="${cls}"` : ''} data-hr="${esc(hr)}" data-en="${esc(en)}">${esc(hr)}</${tag}>`;

const slug = s => s.toLowerCase()
  .replace(/[čć]/g, 'c').replace(/ž/g, 'z').replace(/š/g, 's').replace(/đ/g, 'd')
  .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/* <picture> with AVIF -> WebP -> JPEG and a real srcset.
   `widths` must match what build-img.js actually generated. */
function picture(slot, widths, w, h, alt, sizes, opts = {}) {
  const set = ext => widths.map(x => `img/${slot}-${x}.${ext} ${x}w`).join(', ');
  const largest = widths[widths.length - 1];
  const eager = opts.eager
    ? ' loading="eager" fetchpriority="high" decoding="sync"'
    : ' loading="lazy" decoding="async"';
  return `<picture>
<source type="image/avif" srcset="${set('avif')}" sizes="${sizes}">
<source type="image/webp" srcset="${set('webp')}" sizes="${sizes}">
<img src="img/${slot}-${largest}.jpg" srcset="${set('jpg')}" sizes="${sizes}"
     width="${w}" height="${h}" alt="${esc(alt)}"${eager}${opts.attrs || ''}>
</picture>`;
}

/* Alt text needs to swap language too, so it goes through data-i18n-attr. */
const altPair = key => ` data-i18n-attr="alt:${key}"`;

/* ── wordmark ─────────────────────────────────────────────────────────────
   Redrawn as SVG. The real logo PNG sits on an opaque cream ground, so it
   cannot be recoloured or placed on a dark header; and the file the live
   site uses in its header is a transparent spacer with no artwork at all.
   The O is drawn as a plate ring, which is the one idea worth keeping.
   ─────────────────────────────────────────────────────────────────────── */
const WORDMARK = `<svg class="wordmark" viewBox="0 0 208 64" role="img" aria-label="Mon Ami — restoran" fill="currentColor">
  <g>
    <!-- M -->
    <path d="M2 34V6h5.6l8.1 18.2L23.8 6h5.6v28h-4.6V14.7l-7.1 15.8h-3.9L6.6 14.7V34H2Z"/>
    <!-- O drawn as a plate: outer ring plus concentric inner ring -->
    <path d="M47.4 34.6c-7.9 0-14.3-6.4-14.3-14.3S39.5 6 47.4 6s14.3 6.4 14.3 14.3-6.4 14.3-14.3 14.3Zm0-3.4c6 0 10.9-4.9 10.9-10.9S53.4 9.4 47.4 9.4 36.5 14.3 36.5 20.3s4.9 10.9 10.9 10.9Z"/>
    <path d="M47.4 27.6c-4 0-7.3-3.3-7.3-7.3s3.3-7.3 7.3-7.3 7.3 3.3 7.3 7.3-3.3 7.3-7.3 7.3Zm0-1.7c3.1 0 5.6-2.5 5.6-5.6s-2.5-5.6-5.6-5.6-5.6 2.5-5.6 5.6 2.5 5.6 5.6 5.6Z"/>
    <!-- N -->
    <path d="M66.9 34V6h4.8l13.4 20.1V6h4.6v28h-4.8L71.5 13.9V34h-4.6Z"/>
    <!-- A -->
    <path d="M108.9 34 119.3 6h5.2l10.4 28h-5.1l-2.5-7.1h-11.9l-2.5 7.1h-4Zm8.8-11h9.2l-4.6-13-4.6 13Z"/>
    <!-- M -->
    <path d="M139.4 34V6h5.6l8.1 18.2L161.2 6h5.6v28h-4.6V14.7l-7.1 15.8h-3.9L144 14.7V34h-4.6Z"/>
    <!-- I -->
    <path d="M173.8 34V6h4.7v28h-4.7Z"/>
  </g>
  <text x="2" y="56" font-family="Instrument Sans, Arial, sans-serif" font-size="9.5"
        letter-spacing="2.1" font-weight="500">RESTORAN</text>
</svg>`;

/* ── menu rows ────────────────────────────────────────────────────────────
   Inlined as static HTML at build time rather than rendered in the browser.
   Two reasons: 62 rows appearing after paint would shift the layout, and a
   menu that only exists in JavaScript is a menu search engines cannot read
   — which is the whole problem with the current site.
   ─────────────────────────────────────────────────────────────────────── */
function menuSection() {
  const rail = CATEGORIES.map(c =>
    `<a href="#c-${slug(c)}">${pair(c, CATEGORIES_EN[c])}</a>`
  ).join('\n');

  const filters = [
    ['f-gf', 'f_gf'], ['f-veg', 'f_veg'], ['f-fish', 'f_fish'], ['f-meat', 'f_meat'],
  ].map(([id, key]) =>
    `<input type="checkbox" id="${id}"><label for="${id}">${esc(t(key))}</label>`
  ).join('\n');

  const cats = CATEGORIES.map(c => {
    const rows = MENU.filter(d => d.c === c).map(d => {
      const badges = [];
      if (d.tag === 'chef') {
        badges.push(`<span class="badge badge--chef" data-hr="${esc(t('b_chef'))}" data-en="${esc(I18N.b_chef.en)}">${esc(t('b_chef'))}</span>`);
      }
      if (d.unit === 'kg') {
        badges.push(`<button type="button" class="badge" popovertarget="pop-kg"`
          + ` data-hr="${esc(t('b_kg'))}" data-en="${esc(I18N.b_kg.en)}">${esc(t('b_kg'))}</button>`);
      }
      const note = d.note_hr
        ? `\n      ${pair(d.note_hr, d.note_en, 'span', 'dish__note')}`
        : '';
      const price = d.p
        ? `<span class="dish__price">${esc(d.p)}&nbsp;€${d.unit === 'kg'
            ? '<span class="dish__unit">/kg</span>' : ''}</span>`
        : `<span class="dish__price"><span class="dish__unit" data-hr="pitajte" data-en="ask">pitajte</span></span>`;

      return `    <li class="dish" data-diet="${esc(d.diet || '')}"${d.tag ? ` data-tag="${d.tag}"` : ''}>
      <span class="dish__name">${pair(d.hr, d.en, 'span', 'dish__hr')}${badges.join('')}${pair(d.en, d.hr, 'span', 'dish__en')}${note}</span>
      <span class="dish__lead" aria-hidden="true"></span>
      ${price}
    </li>`;
    }).join('\n');

    const seasonal = c === 'Jela od riba'
      ? `\n  <p class="seasonal">${T('seasonal_h', 'strong')}${T('seasonal_p')}</p>`
      : '';

    const cn = CATEGORY_NOTES[c];
    const catNote = cn
      ? `\n  ${pair(cn.hr, cn.en, 'p', 'menu__note')}`
      : '';

    return `<div class="menu__cat" id="c-${slug(c)}">
  <h3>${pair(c, CATEGORIES_EN[c])}</h3>${seasonal}
  <ol class="dishes">
${rows}
  </ol>${catNote}
</div>`;
  }).join('\n\n');

  return `<section class="menu" id="jelovnik" aria-labelledby="jelovnik-h">
<div class="shell">
  <div class="section__head reveal">
    <p class="eyebrow">${esc(t('m_h2'))}</p>
    <h2 id="jelovnik-h" class="display">${pair('Jelovnik', 'The menu')}</h2>
    <p>${esc(t('m_sub'))}<span data-i18n="m_sub" hidden></span></p>
    <p class="menu__note"><span data-hr="${esc(I18N.m_updated.hr.replace('{d}', INFO.menuUpdated))}" data-en="${esc(I18N.m_updated.en.replace('{d}', INFO.menuUpdatedEn))}">${esc(I18N.m_updated.hr.replace('{d}', INFO.menuUpdated))}</span></p>
  </div>

  <div class="menu__tools">
    <div class="rail">
      <button type="button" class="rail__btn" data-dir="prev"
        aria-label="${esc(t('a_prev_cat'))}" data-i18n-attr="aria-label:a_prev_cat">&#8249;</button>
      <div class="rail__track">
${rail}
      </div>
      <button type="button" class="rail__btn" data-dir="next"
        aria-label="${esc(t('a_next_cat'))}" data-i18n-attr="aria-label:a_next_cat">&#8250;</button>
    </div>
    <div class="filters" role="group" aria-label="${esc(t('m_filter'))}" data-i18n-attr="aria-label:m_filter">
${filters}
    </div>
  </div>

  <!-- GENERATED FROM src/data.js — edit MENU there and re-run build-html.js.
       Do not hand-edit these rows. -->
  <div class="menu__body">
${cats}
  </div>

  <div class="menu__foot">
    ${T('m_fn1', 'p')}
    ${T('m_fn2', 'p')}
    ${T('m_fn3', 'p')}
  </div>
</div>
</section>

<div popover id="pop-kg" class="pop-kg">
  ${T('kg_h', 'h3')}
  ${T('kg_1', 'p')}
  ${T('kg_2', 'p')}
  <button type="button" class="btn btn--ghost pop-close" popovertarget="pop-kg"
    popovertargetaction="hide" data-i18n="a_close">${esc(t('a_close'))}</button>
</div>`;
}

/* ── hours table ──────────────────────────────────────────────────────── */
function hoursTable() {
  // Monday first: how a Croatian week is read.
  const order = [1, 2, 3, 4, 5, 6, 0];
  const rows = order.map(i => {
    const s = HOURS.week[i];
    const val = s
      ? `${s[0]} – ${s[1]}`
      : `<span class="shut" data-hr="zatvoreno" data-en="closed">zatvoreno</span>`;
    return `  <tr data-dow="${i}">
    <th scope="row">${pair(DAYS[i].hr, DAYS[i].en)}<span class="tag"></span></th>
    <td>${val}</td>
  </tr>`;
  }).join('\n');

  return `<table class="hours" data-hours-table>
  <caption class="vh" data-i18n="v_hours_cap">${esc(t('v_hours_cap'))}</caption>
${rows}
</table>`;
}

/* Condensed hours for the utility strip's expandable detail. */
function hoursMini() {
  const order = [1, 2, 3, 4, 5, 6, 0];
  return `<table>${order.map(i => {
    const s = HOURS.week[i];
    return `<tr><td>${pair(DAYS[i].hr, DAYS[i].en)}</td><td>${
      s ? `${s[0]}–${s[1]}` : pair('zatvoreno', 'closed')}</td></tr>`;
  }).join('')}</table>`;
}

/* ── gallery ──────────────────────────────────────────────────────────── */
function galleryGrid() {
  return GALLERY.map((g, idx) => {
    const widths = g.w >= 1900 ? [900, 1400, 1920]
                 : g.w >= 1200 ? [600, 900, 1200]
                 : [500, 750, 1000];
    const largest = widths[widths.length - 1];
    return `<figure class="frame reveal" style="--span:${g.span}">
  <button type="button" class="frame__btn"
    data-full="img/${g.slot}-${largest}.jpg"
    data-cap="${esc(g.cap_hr)}"
    data-hr-cap="${esc(g.cap_hr)}" data-en-cap="${esc(g.cap_en)}"
    aria-label="${esc(t('a_enlarge'))}: ${esc(g.cap_hr)}">
    <span class="frame__box" data-label="Mon Ami">
      ${picture(g.slot, widths, g.w, g.h, g.alt_hr, g.sizes,
        { attrs: ` data-hr-alt="${esc(g.alt_hr)}" data-en-alt="${esc(g.alt_en)}"` })}
    </span>
  </button>
  ${pair(g.cap_hr, g.cap_en, 'figcaption')}
</figure>`;
  }).join('\n');
}

/* ── search-engine data ───────────────────────────────────────────────────
   Built from the same HOURS and MENU objects the page renders from, so the
   two can never disagree.

   Deliberately no aggregateRating: when a business supplies ratings about
   itself in its own structured data, that makes the page ineligible for
   star results rather than earning them. The guide recognitions do that
   job legitimately, in plain text.
   ─────────────────────────────────────────────────────────────────────── */
function jsonLd() {
  const spec = [];
  const byRange = {};
  for (let i = 0; i < 7; i++) {
    const s = HOURS.week[i];
    if (!s) continue;
    const k = s.join('-');
    (byRange[k] = byRange[k] || []).push(DAYS[i].schema);
  }
  for (const k in byRange) {
    const [opens, closes] = k.split('-');
    spec.push({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: byRange[k].length === 1 ? byRange[k][0] : byRange[k],
      opens: opens + ':00',
      closes: closes + ':00',
    });
  }
  // State the closed day explicitly so nothing has to be inferred.
  const closed = [];
  for (let i = 0; i < 7; i++) if (!HOURS.week[i]) closed.push(DAYS[i].schema);
  if (closed.length) {
    spec.push({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: closed.length === 1 ? closed[0] : closed,
      opens: '00:00:00', closes: '00:00:00',
    });
  }

  const sections = CATEGORIES.map(c => {
    const items = MENU.filter(d => d.c === c && d.p).map(d => {
      const item = {
        '@type': 'MenuItem',
        name: d.hr,
        offers: {
          '@type': 'Offer',
          price: d.p.replace(',', '.'),
          priceCurrency: 'EUR',
        },
      };
      if (d.unit === 'kg') {
        item.description = 'Cijena po kilogramu.';
        item.offers.eligibleQuantity = {
          '@type': 'QuantitativeValue', unitCode: 'KGM', value: 1,
        };
      }
      return item;
    });
    return items.length
      ? { '@type': 'MenuSection', name: c, hasMenuItem: items }
      : null;
  }).filter(Boolean);

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: INFO.name,
    url: INFO.site,
    image: [INFO.site + 'img/og-1200.jpg', INFO.site + 'img/hero-1920.jpg'],
    telephone: '+' + INFO.telHref.replace('+', ''),
    email: INFO.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: INFO.street,
      addressLocality: INFO.city,
      postalCode: INFO.postal,
      addressRegion: INFO.region,
      addressCountry: 'HR',
    },
    geo: { '@type': 'GeoCoordinates', latitude: INFO.lat, longitude: INFO.lon },
    servesCuisine: ['Mediterranean', 'Seafood', 'Croatian'],
    priceRange: '€€€',
    currenciesAccepted: 'EUR',
    paymentAccepted: 'Cash, Visa, Mastercard, Maestro, Diners Club',
    acceptsReservations: 'True',
    menu: INFO.site + '#jelovnik',
    hasMap: `https://www.google.com/maps/search/?api=1&query=${INFO.lat},${INFO.lon}`,
    sameAs: [INFO.facebook, INFO.instagram],
    foundingDate: INFO.founded,
    openingHoursSpecification: spec,
    hasMenu: {
      '@type': 'Menu', name: 'Jelovnik', inLanguage: 'hr',
      hasMenuSection: sections,
    },
  };
  return JSON.stringify(data, null, 2);
}

/* ── mini map ─────────────────────────────────────────────────────────────
   Drawn inline instead of embedding a map iframe: no third-party request,
   no cookie, no API key, and it retints with the theme. It is an
   orientation diagram, not a survey — labelled as such.
   ─────────────────────────────────────────────────────────────────────── */
const MINIMAP = `<a class="minimap-link" href="https://www.google.com/maps/search/?api=1&amp;query=${INFO.lat},${INFO.lon}"
   target="_blank" rel="noopener">
<svg class="minimap" viewBox="0 0 400 240" role="img"
     aria-labelledby="mm-t" aria-describedby="mm-d">
  <title id="mm-t" data-i18n="v_map_title">${esc(t('v_map_title'))}</title>
  <desc id="mm-d" data-i18n="v_map_desc">${esc(t('v_map_desc'))}</desc>
  <!-- streets -->
  <rect x="0" y="96" width="400" height="22" fill="currentColor" opacity=".22"/>
  <rect x="236" y="0" width="20" height="240" fill="currentColor" opacity=".22"/>
  <!-- park with the playground, in front of the restaurant -->
  <rect x="150" y="140" width="150" height="66" rx="2" fill="currentColor" opacity=".14"/>
  <text x="225" y="178" text-anchor="middle" font-size="9" fill="currentColor"
        opacity=".55" letter-spacing="1.6" data-i18n="v_map_park">${esc(t('v_map_park'))}</text>
  <!-- three minute walk -->
  <path d="M74 107 H196" stroke="var(--claret)" stroke-width="2"
        stroke-dasharray="4 4" fill="none"/>
  <text x="135" y="99" text-anchor="middle" font-size="9.5" fill="var(--claret)"
        data-i18n="v_map_walk">${esc(t('v_map_walk'))}</text>
  <!-- bus station -->
  <rect x="56" y="94" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <text x="65" y="130" text-anchor="middle" font-size="8" fill="currentColor" opacity=".7"
        letter-spacing="1.1" data-i18n="v_map_bus">${esc(t('v_map_bus'))}</text>
  <!-- the restaurant -->
  <circle cx="206" cy="107" r="7" fill="var(--claret)"/>
  <path d="M206 116 l-5 -7 h10 Z" fill="var(--claret)"/>
  <text x="206" y="84" text-anchor="middle" font-size="11.5" font-weight="600"
        fill="currentColor">MON AMI</text>
  <!-- north arrow + coordinates -->
  <path d="M374 30 l0 -18 M374 12 l-4 6 M374 12 l4 6" stroke="currentColor"
        stroke-width="1.3" fill="none" opacity=".6"/>
  <text x="374" y="44" text-anchor="middle" font-size="8" fill="currentColor" opacity=".6">N</text>
  <text x="8" y="232" font-size="8.5" fill="currentColor" opacity=".55"
        style="font-variant-numeric:tabular-nums">45,71137° N · 16,07998° E</text>
</svg></a>`;

/* ── awards ───────────────────────────────────────────────────────────── */
function awardsGrid() {
  return AWARDS.map(a => {
    const line = a.lineEn
      ? pair(a.line, a.lineEn, 'p', 'awards__line display')
      : `<p class="awards__line display">${esc(a.line)}</p>`;
    const cap = pair(a.hr, a.en, 'p', 'awards__cap');
    const inner = `<span class="awards__yr">${esc(a.year)}</span>\n    ${line}\n    ${cap}`;
    return `<div class="awards__cell reveal">
    ${a.href
      ? `<a href="${a.href}" target="_blank" rel="noopener">${inner}</a>`
      : inner}
  </div>`;
  }).join('\n');
}

/* ── build ────────────────────────────────────────────────────────────── */
const css = fs.readFileSync(path.join(__dirname, 'src/style.css'), 'utf8');
const js  = fs.readFileSync(path.join(__dirname, 'src/app.js'), 'utf8');

/* ── generated filter rules ───────────────────────────────────────────────
   style.css hides every category chip as soon as a diet filter is on.
   These rules bring back the chips whose category still has a matching
   dish. Only the menu data knows that, so the CSS is derived from it
   rather than hand-maintained — otherwise adding one dish silently leaves
   a chip pointing at an empty category.
   ─────────────────────────────────────────────────────────────────────── */
function filterCss() {
  const DIETS = ['gf', 'veg', 'fish', 'meat'];
  const lines = [];
  for (const diet of DIETS) {
    const survivors = CATEGORIES.filter(c =>
      MENU.some(d => d.c === c && (d.diet || '').split(/\s+/).includes(diet)));
    if (!survivors.length) continue;
    const sel = survivors
      .map(c => `.menu:has(#f-${diet}:checked) .rail__track a[href="#c-${slug(c)}"]`)
      .join(',\n');
    lines.push(`${sel} { display:inline-flex; }`);
  }
  return '\n/* ── generated from the menu data — do not hand-edit ── */\n'
       + lines.join('\n') + '\n';
}

const html = `<!doctype html>
<!--
  Restoran Mon Ami — Velika Gorica
  Single self-contained page. Generated by build-html.js from src/.
  To change a price, an opening time or a caption: edit src/data.js and
  run "node build-html.js". Do not edit this file directly — it is output.
-->
<html lang="hr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<!-- Applied before the stylesheet so a chosen theme does not flash. -->
<script>try{var t=localStorage.getItem("ma-theme");
if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t;
document.documentElement.style.colorScheme="only "+t;}}catch(e){}</script>

<title>Restoran Mon Ami — jadranska riba u srcu Turopolja | Velika Gorica</title>
<meta name="description" content="Obiteljski restoran u Velikoj Gorici od 1997. Jadranska riba, turopoljski tartuf i vlastito maslinovo ulje iz Skradina. MICHELIN Guide 2026 · Selected. Jelovnik, radno vrijeme i rezervacije.">
<link rel="canonical" href="${INFO.site}">
<link rel="alternate" hreflang="hr" href="${INFO.site}">
<link rel="alternate" hreflang="en" href="${INFO.site}?lang=en">
<link rel="alternate" hreflang="x-default" href="${INFO.site}">

<meta property="og:type" content="restaurant">
<meta property="og:locale" content="hr_HR">
<meta property="og:locale:alternate" content="en_GB">
<meta property="og:site_name" content="Restoran Mon Ami">
<meta property="og:title" content="Restoran Mon Ami — jadranska riba u srcu Turopolja">
<meta property="og:description" content="Obiteljski restoran u Velikoj Gorici od 1997. MICHELIN Guide 2026 · Selected. Gault&amp;Millau 13,5/20.">
<meta property="og:url" content="${INFO.site}">
<meta property="og:image" content="${INFO.site}img/og-1200.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Carpaccio od tune s rikolom i ružičastim paprom na crnom tanjuru.">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#F9F6F0">
<meta name="theme-color" content="#F9F6F0" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#171310" media="(prefers-color-scheme: dark)">
<link rel="icon" href="img/icon.png" sizes="512x512">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..600;1,400..500&amp;family=Instrument+Serif:ital@0;1&amp;display=swap">

<!-- The hero is the largest paint on the page, so it is fetched at high
     priority and never lazily. -->
<link rel="preload" as="image" type="image/avif" fetchpriority="high"
      href="img/hero-1400.avif"
      imagesrcset="img/hero-900.avif 900w, img/hero-1400.avif 1400w, img/hero-1920.avif 1920w"
      imagesizes="100vw" media="(min-width: 40rem)">
<link rel="preload" as="image" type="image/avif" fetchpriority="high"
      href="img/hero-p-900.avif"
      imagesrcset="img/hero-p-600.avif 600w, img/hero-p-900.avif 900w"
      imagesizes="100vw" media="(max-width: 39.999rem)">

<style>
${css}
${filterCss()}
</style>

<script type="application/ld+json">
${jsonLd()}
</script>
</head>

<body>
<a class="btn btn--ghost vh" href="#main" data-i18n="skip">${esc(t('skip'))}</a>
<div id="top-sentinel" aria-hidden="true" style="position:absolute;top:0;height:1px;width:1px"></div>

<header class="hdr">
  <div class="hdr__in shell">
    <a href="#main" aria-label="Mon Ami">${WORDMARK}</a>

    <nav class="nav" aria-label="Sadržaj">
      <a href="#jelovnik" data-i18n="nav_menu">${esc(t('nav_menu'))}</a>
      <a href="#ulov"     data-i18n="nav_ulov">${esc(t('nav_ulov'))}</a>
      <a href="#prica"    data-i18n="nav_prica">${esc(t('nav_prica'))}</a>
      <a href="#ljudi"    data-i18n="nav_ljudi">${esc(t('nav_ljudi'))}</a>
      <a href="#galerija" data-i18n="nav_gal">${esc(t('nav_gal'))}</a>
      <a href="#posjet"   data-i18n="nav_visit">${esc(t('nav_visit'))}</a>
    </nav>

    <div class="hdr__right">
      <a class="chip" data-chip href="#posjet" data-state="shut">
        <span class="chip__dot" aria-hidden="true"></span>
        <span class="chip__txt"></span>
      </a>

      <div class="seg lang-seg" role="group"
           aria-label="${esc(t('a_lang'))}" data-i18n-attr="aria-label:a_lang">
        <button type="button" data-lang="hr" aria-pressed="true">HR</button>
        <button type="button" data-lang="en" aria-pressed="false">EN</button>
      </div>

      <button type="button" class="icon-btn" popovertarget="pop-theme"
        aria-label="${esc(t('a_theme'))}" data-i18n-attr="aria-label:a_theme">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"
             stroke-width="1.4" aria-hidden="true">
          <circle cx="8" cy="8" r="3.4"/>
          <path d="M8 1v1.6M8 13.4V15M1 8h1.6M13.4 8H15M3 3l1.1 1.1M11.9 11.9 13 13M13 3l-1.1 1.1M4.1 11.9 3 13"/>
        </svg>
      </button>

      <button type="button" class="icon-btn icon-btn--txt icon-btn--menu"
        popovertarget="pop-nav" data-i18n="btn_menu">${esc(t('btn_menu'))}</button>

      <button type="button" class="btn btn--ghost btn--book" data-open-booking
        data-i18n="cta_book_short">${esc(t('cta_book_short'))}</button>
    </div>
  </div>
</header>

<div popover id="pop-theme" class="pop-theme">
  <fieldset>
    <legend data-i18n="th_legend">${esc(t('th_legend'))}</legend>
    <label><input type="radio" name="theme" value="auto" checked>
      <span data-i18n="th_auto">${esc(t('th_auto'))}</span></label>
    <label><input type="radio" name="theme" value="light">
      <span data-i18n="th_light">${esc(t('th_light'))}</span></label>
    <label><input type="radio" name="theme" value="dark">
      <span data-i18n="th_dark">${esc(t('th_dark'))}</span></label>
  </fieldset>
</div>

<nav popover id="pop-nav" class="pop-nav" aria-label="Sadržaj">
  <a href="#jelovnik" data-i18n="nav_menu">${esc(t('nav_menu'))}</a>
  <a href="#ulov"     data-i18n="nav_ulov">${esc(t('nav_ulov'))}</a>
  <a href="#prica"    data-i18n="nav_prica">${esc(t('nav_prica'))}</a>
  <a href="#ljudi"    data-i18n="nav_ljudi">${esc(t('nav_ljudi'))}</a>
  <a href="#galerija" data-i18n="nav_gal">${esc(t('nav_gal'))}</a>
  <a href="#posjet"   data-i18n="nav_visit">${esc(t('nav_visit'))}</a>
</nav>

<main id="main">

<!-- ── Hero ─────────────────────────────────────────────────────────── -->
<section class="hero" aria-labelledby="hero-h">
  <div class="hero__type shell">
    <p class="hero__mast display">MON AMI</p>
    <hr class="hero__rule">
    <p class="eyebrow" data-i18n="hero_eyebrow">${esc(t('hero_eyebrow'))}</p>
    <h1 id="hero-h" class="display" data-i18n="hero_h1">${esc(t('hero_h1'))}</h1>
    <p class="lead hero__lede" data-i18n="hero_lede">${esc(t('hero_lede'))}</p>

    <div class="distinctions">
      <a href="${INFO.michelin}" target="_blank" rel="noopener">MICHELIN GUIDE HRVATSKA 2026 · SELECTED</a>
      <a href="${INFO.gaultmillau}" target="_blank" rel="noopener"
         data-i18n="d_gm">${esc(t('d_gm'))}</a>
      <span>RESTAURANT CROATICA 2024</span>
    </div>

    <a class="chip" data-chip href="#posjet" data-state="shut">
      <span class="chip__dot" aria-hidden="true"></span>
      <span class="chip__txt"></span>
    </a>

    <div class="hero__cta">
      <button type="button" class="btn btn--primary btn--lg" data-open-booking
        data-i18n="cta_book">${esc(t('cta_book'))}</button>
      <a class="btn btn--ghost btn--lg" href="tel:${INFO.telHref}">${INFO.telDisplay}</a>
    </div>
  </div>

  <figure class="hero__figure">
    <picture>
      <source type="image/avif" media="(max-width: 39.999rem)"
        srcset="img/hero-p-600.avif 600w, img/hero-p-900.avif 900w" sizes="100vw">
      <source type="image/webp" media="(max-width: 39.999rem)"
        srcset="img/hero-p-600.webp 600w, img/hero-p-900.webp 900w" sizes="100vw">
      <source type="image/jpeg" media="(max-width: 39.999rem)"
        srcset="img/hero-p-600.jpg 600w, img/hero-p-900.jpg 900w" sizes="100vw">
      <source type="image/avif"
        srcset="img/hero-900.avif 900w, img/hero-1400.avif 1400w, img/hero-1920.avif 1920w" sizes="100vw">
      <source type="image/webp"
        srcset="img/hero-900.webp 900w, img/hero-1400.webp 1400w, img/hero-1920.webp 1920w" sizes="100vw">
      <img src="img/hero-1920.jpg"
           srcset="img/hero-900.jpg 900w, img/hero-1400.jpg 1400w, img/hero-1920.jpg 1920w"
           sizes="100vw" width="1920" height="1080"
           alt="Jadranske lignje sa žara s blitvom i krumpirom na bijelom tanjuru, uz maslinovo ulje koje se preliva iz tamne boce."
           data-hr-alt="Jadranske lignje sa žara s blitvom i krumpirom na bijelom tanjuru, uz maslinovo ulje koje se preliva iz tamne boce."
           data-en-alt="Grilled Adriatic squid with Swiss chard and potatoes on a white plate, with olive oil being poured from a dark bottle."
           loading="eager" fetchpriority="high" decoding="sync">
    </picture>
    <figcaption class="hero__cap" data-i18n="hero_cap">${esc(t('hero_cap'))}</figcaption>
  </figure>
</section>

<!-- ── The four things a guest asks first ───────────────────────────── -->
<section class="facts" aria-label="${esc(t('f_hours'))}">
  <div class="shell">
  <div class="facts__grid">
    <div class="facts__cell">
      <span class="eyebrow" data-i18n="f_hours">${esc(t('f_hours'))}</span>
      <p class="facts__val num" data-i18n="f_hours_v">${esc(t('f_hours_v'))}</p>
      <details>
        <summary data-i18n="f_week">${esc(t('f_week'))}</summary>
        ${hoursMini()}
        <p class="facts__sub" data-i18n="f_noSun">${esc(t('f_noSun'))}</p>
      </details>
    </div>
    <div class="facts__cell">
      <span class="eyebrow" data-i18n="f_book">${esc(t('f_book'))}</span>
      <p class="facts__val"><a href="tel:${INFO.telHref}"><strong class="num">${INFO.telDisplay}</strong></a>
        <span class="facts__sub num"><a href="tel:${INFO.mobHref}">${INFO.mobDisplay}</a></span></p>
      <p class="facts__sub" data-i18n="f_book_s">${esc(t('f_book_s'))}</p>
    </div>
    <div class="facts__cell">
      <span class="eyebrow" data-i18n="f_addr">${esc(t('f_addr'))}</span>
      <p class="facts__val">${INFO.street},<br>${INFO.postal} ${INFO.city}</p>
      <p class="facts__sub"><a href="https://www.google.com/maps/search/?api=1&amp;query=${INFO.lat},${INFO.lon}"
        target="_blank" rel="noopener" data-i18n="f_dir">${esc(t('f_dir'))}</a></p>
    </div>
    <div class="facts__cell">
      <span class="eyebrow" data-i18n="f_cap">${esc(t('f_cap'))}</span>
      <p class="facts__val" data-i18n="f_cap_v">${esc(t('f_cap_v'))}</p>
    </div>
  </div>
  </div>
</section>

${menuSection()}

<!-- ── The catch: the only dark band on the page ────────────────────── -->
<section class="ulov" id="ulov" aria-labelledby="ulov-h">
  <div class="shell">
    <div class="ulov__grid">
      <figure class="reveal">
        ${picture('ulov', [600, 900, 1200], 1200, 1500, 'Bijeli tanjur sa svježom cijelom ribom — oradom, zubatcem i trljom — te škampima i limunom.', '(min-width:64rem) 40vw, 100vw', { attrs: ' data-hr-alt="Bijeli tanjur sa svježom cijelom ribom — oradom, zubatcem i trljom — te škampima i limunom." data-en-alt="A white platter of fresh whole fish — sea bream, dentex and red mullet — with langoustines and lemon."' })}
        <figcaption class="eyebrow" style="margin-block-start:var(--s-3)"
          data-i18n="u_cap">${esc(t('u_cap'))}</figcaption>
      </figure>

      <div class="ulov__text reveal">
        <p class="eyebrow" data-i18n="u_kicker">${esc(t('u_kicker'))}</p>
        <h2 id="ulov-h" class="display" data-i18n="u_h2">${esc(t('u_h2'))}</h2>
        <p data-i18n="u_p1">${esc(t('u_p1'))}</p>
        <p data-i18n="u_p2">${esc(t('u_p2'))}</p>
        <ul class="species">
${SPECIES.map(s => `          <li><b>${esc(s.hr)}</b><span>${esc(s.en)}</span></li>`).join('\n')}
        </ul>
        <p class="ulov__close display" data-i18n="u_close">${esc(t('u_close'))}</p>
      </div>
    </div>
  </div>
</section>

<!-- ── Recognition. Type only, never a borrowed badge. ──────────────── -->
<section class="awards section" aria-labelledby="aw-h">
  <div class="shell">
    <div class="section__head reveal">
      <p class="eyebrow" data-i18n="aw_h2">${esc(t('aw_h2'))}</p>
      <h2 id="aw-h" class="display">${pair('Priznanja', 'Recognition')}</h2>
    </div>
    <div class="awards__grid">
${awardsGrid()}
    </div>
    <p class="awards__close display" data-i18n="aw_close">${esc(t('aw_close'))}</p>
  </div>
</section>

<!-- ── Story ────────────────────────────────────────────────────────── -->
<section class="section" id="prica" aria-labelledby="prica-h">
  <div class="shell">
    <div class="story__grid">
      <div class="story__aside">
        <figure class="reveal">
          <p class="eyebrow" style="margin-block-end:var(--s-3)"
             data-i18n="s_kicker_sea">${esc(t('s_kicker_sea'))}</p>
          ${picture('chef', [500, 750, 1000], 1000, 1333, I18N.p_chef_alt.hr, '(min-width:64rem) 30vw, 100vw', { attrs: altPair('p_chef_alt') })}
          <figcaption data-i18n="s_cap">${esc(t('s_cap'))}</figcaption>
        </figure>
      </div>

      <div class="story__text reveal">
        <p class="eyebrow" data-i18n="s_kicker_land">${esc(t('s_kicker_land'))}</p>
        <h2 id="prica-h" class="display" data-i18n="s_h2">${esc(t('s_h2'))}</h2>
        <p data-i18n="s_p1">${esc(t('s_p1'))}</p>
        <p data-i18n="s_p2">${esc(t('s_p2'))}</p>
        <p data-i18n="s_p3">${esc(t('s_p3'))}</p>
        <p data-i18n="s_p4">${esc(t('s_p4'))}</p>

        <ol class="timeline">
${TIMELINE.map(x => `          <li><b>${esc(x.y)}</b>${pair(x.hr, x.en)}</li>`).join('\n')}
        </ol>

        <figure class="pull">
          <blockquote class="display" data-i18n="s_quote">${esc(t('s_quote'))}</blockquote>
          <figcaption data-i18n="s_cite">${esc(t('s_cite'))}</figcaption>
        </figure>
      </div>
    </div>
  </div>
</section>

<!-- ── People ───────────────────────────────────────────────────────── -->
<section class="section" id="ljudi" aria-labelledby="ljudi-h">
  <div class="shell">
    <div class="section__head reveal">
      <p class="eyebrow" data-i18n="p_h2">${esc(t('p_h2'))}</p>
      <h2 id="ljudi-h" class="display">${pair('Ljudi', 'People')}</h2>
      <p data-i18n="p_sub">${esc(t('p_sub'))}</p>
    </div>

    <div class="people__grid">
      <figure class="person people__a reveal">
        ${picture('chef4', [500, 750, 1000], 1000, 1250, I18N.p_chef_alt.hr, '(min-width:64rem) 46vw, 100vw', { attrs: altPair('p_chef_alt') })}
        <figcaption>
          <p class="person__name display">Goran Marko Beus</p>
          <p class="person__role" data-i18n="p_chef_role">${esc(t('p_chef_role'))}</p>
          <p class="person__bio" data-i18n="p_chef_bio">${esc(t('p_chef_bio'))}</p>
          <p class="person__quote display" data-i18n="p_chef_q">${esc(t('p_chef_q'))}</p>
        </figcaption>
      </figure>

      <figure class="person people__b reveal">
        <!-- No photograph of Bruno exists in the archive. Rather than leave a
             hole or borrow someone else's picture, the slot is a set initial
             until a portrait is taken. -->
        <div class="person--initial" aria-hidden="true"><span>B</span></div>
        <figcaption>
          <p class="person__name display">Bruno Ceronja</p>
          <p class="person__role" data-i18n="p_bruno_role">${esc(t('p_bruno_role'))}</p>
          <p class="person__bio" data-i18n="p_bruno_bio">${esc(t('p_bruno_bio'))}</p>
          <p class="person__quote display" data-i18n="p_bruno_q">${esc(t('p_bruno_q'))}</p>
        </figcaption>
      </figure>

      <figure class="person people__c reveal">
        ${picture('team', [900, 1400, 1920], 1920, 823, I18N.p_team_alt.hr, '100vw', { attrs: altPair('p_team_alt') })}
        <figcaption>
          <p class="person__bio" style="max-width:var(--measure)"
             data-i18n="p_team_cap">${esc(t('p_team_cap'))}</p>
        </figcaption>
      </figure>
    </div>
  </div>
</section>

<!-- ── Our own: oil, truffle, wine ──────────────────────────────────── -->
<section class="section" id="vlastito" aria-labelledby="own-h">
  <div class="shell">
    <div class="section__head reveal">
      <p class="eyebrow" data-i18n="o_kicker">${esc(t('o_kicker'))}</p>
      <h2 id="own-h" class="display" data-i18n="o_h2">${esc(t('o_h2'))}</h2>
    </div>

    <div class="own__grid">
      <div class="panel own__oil reveal">
        <figure>
          ${picture('ulje', [600, 900, 1200], 1200, 800, I18N.o_oil_alt.hr, '(min-width:64rem) 56vw, 100vw', { attrs: altPair('o_oil_alt') })}
        </figure>
        <h3 class="display" data-i18n="o_oil_h">${esc(t('o_oil_h'))}</h3>
        <p data-i18n="o_oil_p">${esc(t('o_oil_p'))}</p>
        <ul class="spec">
          <li><b data-i18n="o_oil_1">${esc(t('o_oil_1'))}</b><span data-i18n="o_oil_1v">${esc(t('o_oil_1v'))}</span></li>
          <li><b data-i18n="o_oil_2">${esc(t('o_oil_2'))}</b><span data-i18n="o_oil_2v">${esc(t('o_oil_2v'))}</span></li>
          <li><b data-i18n="o_oil_3">${esc(t('o_oil_3'))}</b><span data-i18n="o_oil_3v">${esc(t('o_oil_3v'))}</span></li>
        </ul>
        <p data-i18n="o_oil_buy">${esc(t('o_oil_buy'))}</p>
        <p class="quote-line display" data-i18n="o_oil_q">${esc(t('o_oil_q'))}
          <cite data-i18n="o_oil_qc">${esc(t('o_oil_qc'))}</cite></p>
        <p class="caveat" data-i18n="o_oil_cav">${esc(t('o_oil_cav'))}</p>
      </div>

      <div class="panel own__truf reveal">
        <!-- SWAP: a commissioned photograph of the truffle on a plate, 3:2.
             Replace this whole figure with a <picture> when it arrives.
             This is a placeholder, not a design feature. -->
        <figure>
          <div class="truf-plate"><span aria-hidden="true">TARTUF</span></div>
        </figure>
        <h3 class="display" data-i18n="o_tru_h">${esc(t('o_tru_h'))}</h3>
        <p data-i18n="o_tru_p">${esc(t('o_tru_p'))}</p>
        <p data-i18n="o_tru_p2">${esc(t('o_tru_p2'))}</p>
      </div>

      <div class="panel own__wine reveal">
        <figure>
          ${picture('vino', [900, 1400, 1920], 1920, 823, I18N.o_win_alt.hr, '100vw', { attrs: altPair('o_win_alt') })}
        </figure>
        <h3 class="display" data-i18n="o_win_h">${esc(t('o_win_h'))}</h3>
        <p data-i18n="o_win_p">${esc(t('o_win_p'))}</p>
        <details>
          <summary data-i18n="o_win_sum">${esc(t('o_win_sum'))}</summary>
          <ul class="spec" style="margin-block-start:var(--s-3)">
            <li><span data-i18n="o_win_1">${esc(t('o_win_1'))}</span></li>
            <li><span data-i18n="o_win_2">${esc(t('o_win_2'))}</span></li>
            <li><span data-i18n="o_win_3">${esc(t('o_win_3'))}</span></li>
          </ul>
        </details>
        <p data-i18n="o_win_cl">${esc(t('o_win_cl'))}</p>
      </div>
    </div>

    <div class="suppliers reveal">
      <h3 class="display" data-i18n="sup_h">${esc(t('sup_h'))}</h3>
      <div class="suppliers__grid">
${SUPPLIERS.map(s => `        <div class="suppliers__cell">
          <span class="suppliers__n">${s.n}</span>
          <span class="suppliers__name">${esc(s.name)}</span>
          ${pair(s.hr, s.en, 'span', 'suppliers__what')}
        </div>`).join('\n')}
      </div>
      <p class="suppliers__close" data-i18n="sup_cl">${esc(t('sup_cl'))}</p>
    </div>
  </div>
</section>

<!-- ── Room and occasions ───────────────────────────────────────────── -->
<section class="section" id="prostor" aria-labelledby="room-h">
  <figure class="room__hero reveal">
    ${picture('prostor', [900, 1400, 1920], 1920, 823, I18N.r_alt.hr, '100vw', { attrs: altPair('r_alt') })}
  </figure>
  <div class="shell">
    <div class="room__grid">
      <div class="room__text reveal">
        <h2 id="room-h" class="display" data-i18n="r_h2">${esc(t('r_h2'))}</h2>
        <p data-i18n="r_p1">${esc(t('r_p1'))}</p>

        <ul class="cap-table">
          <li><span data-i18n="r_cap1">${esc(t('r_cap1'))}</span><b class="num" data-i18n="r_cap1v">${esc(t('r_cap1v'))}</b></li>
          <li><span data-i18n="r_cap2">${esc(t('r_cap2'))}</span><b class="num" data-i18n="r_cap2v">${esc(t('r_cap2v'))}</b></li>
          <li><span data-i18n="r_cap3">${esc(t('r_cap3'))}</span><b class="num" data-i18n="r_cap3v">${esc(t('r_cap3v'))}</b></li>
        </ul>

        <p data-i18n="r_p2">${esc(t('r_p2'))}</p>
        <ul class="events">
          <li><span data-i18n="r_ev1">${esc(t('r_ev1'))}</span><span data-i18n="r_ev1n">${esc(t('r_ev1n'))}</span></li>
          <li><span data-i18n="r_ev2">${esc(t('r_ev2'))}</span><span data-i18n="r_ev2n">${esc(t('r_ev2n'))}</span></li>
          <li><span data-i18n="r_ev3">${esc(t('r_ev3'))}</span><span data-i18n="r_ev3n">${esc(t('r_ev3n'))}</span></li>
          <li><span data-i18n="r_ev4">${esc(t('r_ev4'))}</span><span data-i18n="r_ev4n">${esc(t('r_ev4n'))}</span></li>
        </ul>

        <p data-i18n="r_p3">${esc(t('r_p3'))}</p>
        <p><button type="button" class="btn btn--ghost" data-open-booking="prigoda"
          data-i18n="r_ask">${esc(t('r_ask'))}</button></p>
        <p class="house-rules" data-i18n="r_rules">${esc(t('r_rules'))}</p>
      </div>

      <figure class="room__img reveal">
        ${picture('prigode', [600, 900, 1200], 1200, 800, 'Dugi zajednički stol, ruke gostiju, čaše pjenušca i mali tanjuri s kruhom.', '(min-width:64rem) 40vw, 100vw', { attrs: ' data-hr-alt="Dugi zajednički stol, ruke gostiju, čaše pjenušca i mali tanjuri s kruhom." data-en-alt="A long shared table, guests\\u2019 hands, sparkling wine glasses and small plates of bread."' })}
      </figure>
    </div>
  </div>
</section>

<!-- ── Gallery ──────────────────────────────────────────────────────── -->
<section class="section gallery" id="galerija" aria-labelledby="gal-h">
  <div class="shell">
    <div class="section__head reveal">
      <p class="eyebrow" data-i18n="g_h2">${esc(t('g_h2'))}</p>
      <h2 id="gal-h" class="display">${pair('Galerija', 'Gallery')}</h2>
      <p data-i18n="g_sub">${esc(t('g_sub'))}</p>
    </div>
    <div class="gallery__grid">
${galleryGrid()}
    </div>
    <p class="gallery__credit" data-i18n="g_credit">${esc(t('g_credit'))}</p>
    <p class="gallery__more"><a href="${INFO.instagram}" target="_blank" rel="noopener"
      data-i18n="g_more">${esc(t('g_more'))}</a></p>
  </div>
</section>

<!-- ── Visit ────────────────────────────────────────────────────────── -->
<section class="visit section" id="posjet" aria-labelledby="visit-h">
  <div class="shell">
    <div class="section__head reveal">
      <p class="eyebrow" data-i18n="v_h2">${esc(t('v_h2'))}</p>
      <h2 id="visit-h" class="display">${pair('Posjet', 'Visit')}</h2>
    </div>

    <div class="visit__grid">
      <div class="visit__col">
        <h3 data-i18n="v_hours">${esc(t('v_hours'))}</h3>
        ${hoursTable()}
        <p class="facts__sub" data-i18n="v_holiday">${esc(t('v_holiday'))}</p>
      </div>

      <div class="visit__col">
        <h3 data-i18n="v_where">${esc(t('v_where'))}</h3>
        <div class="addr">
          <p>${INFO.street}<br>${INFO.postal} ${INFO.city}</p>
          <p><a href="tel:${INFO.telHref}" class="num">${INFO.telDisplay}</a></p>
          <p><a href="tel:${INFO.mobHref}" class="num">${INFO.mobDisplay}</a></p>
          <p><a href="mailto:${INFO.email}">${INFO.email}</a></p>
        </div>
        ${MINIMAP}
        <p><a href="https://www.google.com/maps/search/?api=1&amp;query=${INFO.lat},${INFO.lon}"
          target="_blank" rel="noopener" data-i18n="v_maps">${esc(t('v_maps'))}</a></p>
      </div>

      <div class="visit__col">
        <h3 data-i18n="v_arrive">${esc(t('v_arrive'))}</h3>
        <ul class="routes">
          <li><b data-i18n="v_car">${esc(t('v_car'))}</b><span class="num" data-i18n="v_car_v">${esc(t('v_car_v'))}</span></li>
          <li><b data-i18n="v_bus">${esc(t('v_bus'))}</b><span class="num" data-i18n="v_bus_v">${esc(t('v_bus_v'))}</span></li>
          <li><b data-i18n="v_zg">${esc(t('v_zg'))}</b><span class="num" data-i18n="v_zg_v">${esc(t('v_zg_v'))}</span></li>
          <li><b data-i18n="v_scoot">${esc(t('v_scoot'))}</b><span data-i18n="v_scoot_v">${esc(t('v_scoot_v'))}</span></li>
        </ul>
        <div class="amenities">
          <span data-i18n="v_am1">${esc(t('v_am1'))}</span>
          <span data-i18n="v_am2">${esc(t('v_am2'))}</span>
          <span data-i18n="v_am3">${esc(t('v_am3'))}</span>
          <span data-i18n="v_am4">${esc(t('v_am4'))}</span>
          <span class="no" data-i18n="v_am5">${esc(t('v_am5'))}</span>
          <span class="no" data-i18n="v_am6">${esc(t('v_am6'))}</span>
        </div>
      </div>
    </div>

    <div class="visit__book">
      <p data-i18n="v_book_p">${esc(t('v_book_p'))}</p>
      <div>
        <button type="button" class="btn btn--primary btn--lg" data-open-booking
          data-i18n="cta_book">${esc(t('cta_book'))}</button>
        <a class="btn btn--ghost btn--lg" href="tel:${INFO.telHref}"
          data-i18n="cta_call">${esc(t('cta_call'))}</a>
      </div>
    </div>
  </div>
</section>

</main>

<!-- ── Footer ───────────────────────────────────────────────────────── -->
<footer class="foot">
  <div class="shell">
    <div class="foot__grid">
      <div class="foot__col">
        ${WORDMARK}
        <p>${INFO.street}<br>${INFO.postal} ${INFO.city}</p>
      </div>
      <div class="foot__col">
        <h2 data-i18n="ft_contact">${esc(t('ft_contact'))}</h2>
        <a href="tel:${INFO.telHref}" class="num">${INFO.telDisplay}</a>
        <a href="tel:${INFO.mobHref}" class="num">${INFO.mobDisplay}</a>
        <a href="mailto:${INFO.email}">${INFO.email}</a>
      </div>
      <div class="foot__col">
        <h2 data-i18n="ft_hours">${esc(t('ft_hours'))}</h2>
        <p class="num" data-i18n="ft_mon">${esc(t('ft_mon'))}</p>
        <p class="num" data-i18n="ft_tue">${esc(t('ft_tue'))}</p>
        <p data-i18n="ft_sun">${esc(t('ft_sun'))}</p>
      </div>
      <div class="foot__col">
        <h2 data-i18n="ft_links">${esc(t('ft_links'))}</h2>
        <a href="${INFO.facebook}" target="_blank" rel="noopener">Facebook</a>
        <a href="${INFO.instagram}" target="_blank" rel="noopener">Instagram</a>
        <a href="${INFO.order}" target="_blank" rel="noopener"
          data-i18n="ft_order">${esc(t('ft_order'))}</a>
        <div class="foot__toggles">
          <div class="seg lang-seg" role="group"
               aria-label="${esc(t('a_lang'))}" data-i18n-attr="aria-label:a_lang">
            <button type="button" data-lang="hr" aria-pressed="true">HR</button>
            <button type="button" data-lang="en" aria-pressed="false">EN</button>
          </div>
        </div>
      </div>
    </div>

    <p class="foot__motto display" data-i18n="ft_motto">${esc(t('ft_motto'))}</p>

    <div class="foot__bar">
      <p>© <span id="year">2026</span> ${INFO.name}. <span data-i18n="ft_rights">${esc(t('ft_rights'))}</span></p>
    </div>
  </div>
</footer>

<!-- ── Mobile action bar. Always present: the two things a guest on a
     phone actually wants must never move or disappear. ──────────────── -->
<div class="actionbar">
  <button type="button" class="btn btn--primary" data-open-booking
    data-i18n="cta_book">${esc(t('cta_book'))}</button>
  <a class="btn btn--ghost" href="tel:${INFO.telHref}"
    data-i18n="cta_call_short">${esc(t('cta_call_short'))}</a>
</div>

<!-- ── Reservation ──────────────────────────────────────────────────── -->
<dialog id="rezervacija" aria-labelledby="dlg-h">
  <button type="button" class="dlg__close" data-close
    aria-label="${esc(t('a_close'))}" data-i18n-attr="aria-label:a_close">&#10005;</button>

  <div class="dlg__in">
    <div class="dlg__form">
      <div class="dlg__head">
        <h2 id="dlg-h" class="display" data-i18n="d_h">${esc(t('d_h'))}</h2>
        <p data-i18n="d_sub">${esc(t('d_sub'))}</p>
      </div>

      <form novalidate>
        <div class="fields">
          <div class="field">
            <label for="r-name" data-i18n="d_name">${esc(t('d_name'))}</label>
            <input id="r-name" name="ime" type="text" autocomplete="name" required>
          </div>
          <div class="field">
            <label for="r-tel" data-i18n="d_phone">${esc(t('d_phone'))}</label>
            <input id="r-tel" name="telefon" type="tel" autocomplete="tel" required>
          </div>
          <div class="field">
            <label for="r-mail" data-i18n="d_email">${esc(t('d_email'))}</label>
            <input id="r-mail" name="email" type="email" autocomplete="email">
          </div>
          <div class="field">
            <label for="r-date" data-i18n="d_date">${esc(t('d_date'))}</label>
            <input id="r-date" name="datum" type="date" required>
          </div>
          <div class="field">
            <label for="r-time" data-i18n="d_time">${esc(t('d_time'))}</label>
            <select id="r-time" name="vrijeme" required></select>
            <p class="field__err" id="r-closed" hidden></p>
          </div>
          <div class="field field--full">
            <label data-i18n="d_pax">${esc(t('d_pax'))}</label>
            <div class="pax">
${[1,2,3,4,5,6,7,8,'9+'].map((n, i) =>
`              <input type="radio" name="osobe" id="pax-${i}" value="${n}"${n === 2 ? ' checked' : ''}><label for="pax-${i}">${n}</label>`).join('\n')}
            </div>
          </div>
          <div class="field field--full">
            <label data-i18n="d_kind">${esc(t('d_kind'))}</label>
            <div class="radios">
              <input type="radio" name="prilika" id="r-kind-rucak" value="Ručak" checked>
              <label for="r-kind-rucak" data-i18n="d_lunch">${esc(t('d_lunch'))}</label>
              <input type="radio" name="prilika" id="r-kind-vecera" value="Večera">
              <label for="r-kind-vecera" data-i18n="d_dinner">${esc(t('d_dinner'))}</label>
              <input type="radio" name="prilika" id="r-kind-prigoda" value="Prigoda">
              <label for="r-kind-prigoda" data-i18n="d_occas">${esc(t('d_occas'))}</label>
            </div>
          </div>
          <div class="field field--full">
            <label for="r-note" data-i18n="d_note">${esc(t('d_note'))}</label>
            <textarea id="r-note" name="napomena" rows="2"
              placeholder="${esc(t('d_note_ph'))}"
              data-i18n-attr="placeholder:d_note_ph"></textarea>
          </div>
        </div>

        <ul class="reassure" style="margin-block-start:var(--s-5)">
          <li data-i18n="d_r1">${esc(t('d_r1'))}</li>
          <li data-i18n="d_r2">${esc(t('d_r2'))}</li>
          <li data-i18n="d_r3">${esc(t('d_r3'))}</li>
        </ul>

        <div class="dlg__actions" style="margin-block-start:var(--s-5)">
          <p class="dlg__phone"><span data-i18n="d_phone_l">${esc(t('d_phone_l'))}</span>
            <a href="tel:${INFO.telHref}" class="num">${INFO.telDisplay}</a></p>
          <button type="submit" class="btn btn--primary btn--lg"
            data-i18n="d_submit">${esc(t('d_submit'))}</button>
        </div>
      </form>
    </div>

    <div class="dlg__ok">
      <h2 class="display" data-i18n="d_ok_h">${esc(t('d_ok_h'))}</h2>
      <p data-i18n="d_ok_p">${esc(t('d_ok_p'))}</p>
      <button type="button" class="btn btn--ghost" data-close
        data-i18n="a_close">${esc(t('a_close'))}</button>
    </div>
  </div>
</dialog>

<!-- ── Lightbox ─────────────────────────────────────────────────────── -->
<dialog id="lightbox" aria-label="${esc(t('g_h2'))}">
  <div class="lb__in">
    <img src="" alt="">
    <div class="lb__bar">
      <p class="lb__cap"></p>
      <div class="lb__nav">
        <button type="button" data-lb="prev" aria-label="${esc(t('a_prev_img'))}"
          data-i18n-attr="aria-label:a_prev_img">&#8249;</button>
        <button type="button" data-lb="next" aria-label="${esc(t('a_next_img'))}"
          data-i18n-attr="aria-label:a_next_img">&#8250;</button>
        <button type="button" class="lb__close" data-close aria-label="${esc(t('a_close'))}"
          data-i18n-attr="aria-label:a_close">&#10005;</button>
      </div>
    </div>
  </div>
</dialog>

<script>
window.__MA_HOURS = ${JSON.stringify(HOURS)};
window.__MA_DAYS  = ${JSON.stringify(DAYS)};
window.__MA_I18N  = ${JSON.stringify(I18N)};
window.__MA_EMAIL = ${JSON.stringify(INFO.email)};
</script>
<script>
${js}
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf8');

const kb = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(1);
console.log(`index.html written — ${kb} KB`);
console.log(`  ${MENU.length} dishes in ${CATEGORIES.length} categories`);
console.log(`  ${GALLERY.length} gallery frames`);
console.log(`  ${Object.keys(I18N).length} translated strings`);
