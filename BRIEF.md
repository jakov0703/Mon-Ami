All contrast pairs verified. Writing the brief.

---

# MON AMI — DEFINITIVE BUILD BRIEF
**Single self-contained HTML file. Croatian primary, English toggle. No build step.**

**Spine:** CONCEPT 3 — *Otvoreno* (highest aggregate, 12.5/40) supplies the architecture, task ordering and the hours engine. Its art direction is replaced wholesale: the owner refused it (5/10), the art director called it "a very good product page for a restaurant and a weak restaurant page" (5.5/10). So Concept 2's *soul* (cream ground, two shores, named suppliers, price honesty) and Concept 1's *craft* (type-first beat, type-only awards, subgrid menu, people section, curated gallery, token discipline) are grafted in. Every named weakness is fixed in §8.

---

## 1. DIRECTION

A warm, limewashed page that behaves like an instrument. Mon Ami's own photographs are shot on near-black reflective surfaces, so the page ground is bone-cream and every plate becomes a dark object set into it — plates onto linen, which is the one argument that changed the owner's mind. Onto that calm ground we bolt the only genuinely new mechanism anyone proposed: a single hours object that computes today's open/closed state, highlights today's row in the hours table, generates the reservation time slots and emits the `openingHoursSpecification` JSON-LD, so the page, the header and Google can never again send someone to a locked door on a Monday evening. The order of the page is the order a guest actually asks: who are you, what do you cook and what does it cost, are you open, how do I get there, book me. But the family is not a closing argument — Božo from Skradin, Barica from Turopolje, and a town that ate grilled meat until 1997 is *why* the fish is good, so the story, the faces and the olive grove sit in the middle of the page at full weight, not beneath a conversion layer. Restraint carries the prestige: awards are letterspaced type and never a borrowed mark, prices align like a wine list, the page goes dark exactly once — at the sea — and nothing on it is round, glowing, or monospaced.

---

## 2. DESIGN TOKENS

Every hex below was computed from its oklch value; every ratio was measured. Do not substitute approximations.

```css
:root {
  color-scheme: light dark;           /* MANDATORY — light-dark() is inert without it */

  /* ─────────── GROUNDS ─────────── */
  --paper:        light-dark(oklch(0.974 0.008 85),  oklch(0.190 0.008 55));  /* #F9F6F0 / #171310 */
  --paper-2:      light-dark(oklch(0.952 0.010 82),  oklch(0.235 0.010 58));  /* #F2EFE8 / #221D1A */
  --paper-3:      light-dark(oklch(0.925 0.013 80),  oklch(0.275 0.012 58));  /* #EBE5DD / #2C2622 */

  /* ─────────── RULES ─────────── */
  --rule:         light-dark(oklch(0.880 0.008 80),  oklch(0.340 0.010 60));  /* #DAD7D2 / #3C3733  decorative */
  --rule-strong:  light-dark(oklch(0.620 0.016 76),  oklch(0.560 0.014 62));  /* #8C857C / #7B736C  meaning-bearing, 1.4.11 */

  /* ─────────── TYPE ─────────── */
  --ink:          light-dark(oklch(0.220 0.012 60),  oklch(0.930 0.006 85));  /* #1F1915 / #EAE8E3 */
  --stone:        light-dark(oklch(0.505 0.014 68),  oklch(0.720 0.010 70));  /* #6A635C / #A9A49E */

  /* ─────────── ACCENT: CLARET (the only accent) ─────────── */
  --claret:       light-dark(oklch(0.420 0.130 14),  oklch(0.660 0.150 16));  /* #852537 / #DE6672 */
  --claret-deep:  light-dark(oklch(0.360 0.135 14),  oklch(0.740 0.140 18));  /* #730B27 / #F68389  hover/active */
  --claret-wash:  light-dark(oklch(0.945 0.022 14),  oklch(0.285 0.045 14));  /* #FBE7E8 / #3D2023  tint block */
  --on-claret:    light-dark(oklch(0.974 0.008 85),  oklch(0.190 0.008 55));  /* text ON a claret fill */

  /* ─────────── GOLD: PAIRED TOKEN (C2's best a11y idea) ─────────── */
  --gold:         light-dark(oklch(0.745 0.088 92),  oklch(0.800 0.090 88));  /* #C0AB6A / #D6BB79 */
  --gold-text:    light-dark(oklch(0.505 0.105 78),  oklch(0.800 0.090 88));  /* #855C01 / #D6BB79 */
  /* HARD RULE: --gold is DECORATIVE ONLY in light mode (2.10:1 on paper). Never set it on text.
     Any gold that must be READ uses --gold-text (5.54:1 light / 9.88:1 dark). Enforce in review. */

  /* ─────────── STATUS: fixed pair, theme-independent (safety-critical) ─────────── */
  --state-open:   oklch(0.550 0.140 152);   /* #108846 — 3.95:1 vs paper-2, 3.67:1 vs dark paper-2. DOT ONLY. */
  --state-soon:   var(--claret);            /* closing within 60 min. NEVER amber. */
  --state-shut:   var(--stone);             /* closed. NEVER red. */
  /* The chip's TEXT is always --ink. Only the 8px dot carries state colour. */

  /* ─────────── FOCUS ─────────── */
  --focus:        light-dark(oklch(0.500 0.160 250), oklch(0.720 0.150 245)); /* #0064B9 / #43ACFB
                     5.51:1 on paper · 7.53:1 on night — clears 1.4.11 in both themes */

  /* ─────────── SPACING (4px base) ─────────── */
  --s-1: 0.25rem;  --s-2: 0.5rem;   --s-3: 0.75rem;  --s-4: 1rem;
  --s-5: 1.5rem;   --s-6: 2rem;     --s-7: 3rem;     --s-8: 4rem;
  --s-9: 6rem;     --s-10: 8rem;    --s-11: 12rem;

  --gutter:  clamp(1.25rem, 4vw, 3rem);
  --measure: 62ch;
  --shell:   78rem;
  --section-y: clamp(3.5rem, 2rem + 7.5vw, 7.5rem);

  /* ─────────── RADII — printed objects, not software ─────────── */
  --r-0: 0;        /* buttons, cards, the menu sheet, the dialog, the hours table */
  --r-1: 2px;      /* images, chips, badges */
  --r-2: 4px;      /* the ONLY larger radius; reserved for the status chip */
  /* There is no pill radius on this page. No 999px. No 48px. */

  /* ─────────── SHADOWS — defined, used in exactly two places ─────────── */
  --shadow-none: none;                                         /* every card, panel, image, button */
  --shadow-bar:  0 -1px 0 0 var(--rule);                       /* mobile action bar top edge (a hairline) */
  --shadow-dialog: 0 24px 64px -24px light-dark(oklch(0.22 0.012 60 / 0.28), oklch(0 0 0 / 0.6));
  /* Separation elsewhere comes from ground steps and hairlines, never from elevation. */

  /* ─────────── MOTION ─────────── */
  --ease-out:    cubic-bezier(0.2, 0, 0, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-exit:   cubic-bezier(0.4, 0, 1, 1);
  --t-fast: 120ms;  --t-base: 180ms;  --t-slow: 240ms;  --t-vt: 200ms;

  /* ─────────── FLUID TYPE — 360px (22.5rem) → 1440px (90rem) ───────────
     Every preferred value carries a rem term (Roselli): never a bare vw,
     or browser text-zoom at 200% stops scaling. Verified px at 360/768/1440. */
  --step-masthead: clamp(2.75rem,   1.0000rem + 7.7778vw, 8rem);      /*  44 →  76 → 128 */
  --step-h1:       clamp(2.375rem,  1.6667rem + 3.1481vw, 4.5rem);    /*  38 →  51 →  72 */
  --step-h2:       clamp(1.875rem,  1.3750rem + 2.2222vw, 3.375rem);  /*  30 →  39 →  54 */
  --step-h3:       clamp(1.375rem,  1.2083rem + 0.7407vw, 1.875rem);  /*  22 →  25 →  30 */
  --step-lead:     clamp(1.25rem,   1.1250rem + 0.5556vw, 1.625rem);  /*  20 →  22 →  26 */
  --step-body:     clamp(1.0625rem, 1.0208rem + 0.1852vw, 1.1875rem); /*  17 →  18 →  19 */
  --step-small:    clamp(0.875rem,  0.8542rem + 0.0926vw, 0.9375rem); /*  14 →  14 →  15 */
  --step-micro:    clamp(0.7813rem, 0.7708rem + 0.0463vw, 0.8125rem); /* 12.5 → 12.7 → 13 */

  --lh-display: 0.96;  --lh-h2: 1.06;  --lh-h3: 1.2;
  --lh-lead: 1.45;     --lh-body: 1.6; --lh-small: 1.45;
  --track-micro: 0.16em;   /* uppercase eyebrows */
  --track-mast:  0.02em;

  scroll-padding-block-start: 7rem;  /* header + rail — WCAG 2.4.11 technique C43 */
  scroll-padding-block-end:   5.5rem;/* mobile action bar */
}

/* Theme override written by the toggle — makes native controls, scrollbars and
   the date picker follow. Without `only`, the UA ignores the override. */
html[data-theme="light"] { color-scheme: only light; }
html[data-theme="dark"]  { color-scheme: only dark;  }

@media (prefers-contrast: more) {
  :root { --rule: var(--rule-strong); }
  :focus-visible { outline-width: 3px; }
  .site-header { backdrop-filter: none; background: var(--paper); }
}
```

### Verified contrast table — do not re-tune without re-measuring

| Pair | Light | Dark | Requirement |
|---|---|---|---|
| ink on paper | **16.09** | 15.04 | 1.4.3 ≥4.5 |
| stone on paper | **5.46** | 7.44 | 1.4.3 ≥4.5 |
| stone on paper-2 | **5.12** | 6.72 | ≥4.5 |
| stone on paper-3 | **4.72** | 5.98 | ≥4.5 |
| claret on paper | **8.42** | 5.53 | ≥4.5 |
| claret on paper-3 | **7.27** | 4.99 | ≥4.5 |
| gold-text on paper | **5.54** | 9.88 | ≥4.5 |
| on-claret on claret (button) | **8.42** | 5.53 | ≥4.5 |
| on-claret on claret-deep (hover) | **10.79** | 7.53 | ≥4.5 |
| ink on claret-wash | **14.65** | 11.90 | ≥4.5 |
| rule-strong on paper | **3.38** | 3.96 | 1.4.11 ≥3 |
| state-open dot on paper-2 | **3.95** | 3.67 | 1.4.11 ≥3 |
| focus ring on paper | **5.51** | 7.53 | 1.4.11 ≥3 |
| **gold on paper (DECORATIVE)** | **2.10** | — | ✗ text — banned |

**Hero scrim maths (measured):** over the worst case — a pure-white blown highlight in the photograph — a `--paper`-on-scrim headline needs the scrim at ≥0.78 alpha to clear 7.5:1. Spec is **0.82 at the text anchor**, ramping to 0.12 at the top. Do not thin it for aesthetics.

---

## 3. FONTS

**Two families, one superfamily, zero monospace.** Geist Mono is deleted — three of four judges attacked it independently (the owner: "Geist Mono says startup, not a family house on the main square since 1997"; the art director: "a category error"; the engineer: **it is not on Google Fonts at all, so the specified single combined link cannot be constructed**). Numerals come from `font-variant-numeric: tabular-nums` on Instrument Sans.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..600;1,400..500&family=Instrument+Serif:ital@0;1&display=swap">
```

Preload exactly one face — the one the LCP text uses:

```html
<link rel="preload" as="font" type="font/woff2" crossorigin
      href="https://fonts.gstatic.com/s/instrumentserif/v4/jizBRFtNs2ka5fXjeivQ4LroWlx-6zATLg.woff2">
```
*(Resolve the live URL from the css2 response at build time; the hash changes. If it cannot be pinned, drop the preload rather than ship a stale hash.)*

**latin-ext is non-negotiable.** Croatian č ć đ š ž sit at U+010D, U+0107, U+0111, U+0161, U+017E — all above U+00FF, therefore outside Google's `latin` subset. The css2 endpoint emits separate `@font-face` blocks per subset with `unicode-range`, so the browser fetches latin-ext automatically. **Do not hand-write `@font-face` with only the latin `unicode-range`** — Škampi, Škrpina, Vukomeričke, Žumberak and Beus all break.

### Fallback metrics (Fontaine-generated, not guessed)

```css
@font-face { font-family: "IS-fallback"; src: local("Georgia"); size-adjust: 101%;
             ascent-override: 95%; descent-override: 24%; line-gap-override: 0%; }
@font-face { font-family: "ISans-fallback"; src: local("Arial"); size-adjust: 97%;
             ascent-override: 96%; descent-override: 25%; line-gap-override: 0%; }
body    { font-family: "Instrument Sans", "ISans-fallback", system-ui, sans-serif; }
.display{ font-family: "Instrument Serif", "IS-fallback", Georgia, serif; font-weight: 400; }
```

### Type rules — enforce in review

1. **Instrument Serif never below 20px and never for running copy.** This is C1's discipline and C3 violated it (serif italic at 13–14px for English dish names). English dish names are **Instrument Sans italic** at `--step-small` in `--stone`.
2. Instrument Sans never above `--step-h3` (30px).
3. All prices, times, capacities, coordinates: `font-variant-numeric: tabular-nums lining-nums`. Belt and braces — the price column is also a fixed `8ch` track with `text-align: end`, so alignment holds even if the face lacks tnum.
4. `text-wrap: balance` on h1/h2/h3 and dish names. `text-wrap: pretty` on `p` — absent in Firefox at every version, fails safe, no `@supports` needed.
5. In dark mode the serif keeps weight 400 (Instrument Serif ships only one weight); compensate for optical thinning with `letter-spacing: 0.005em` on `.display` inside the dark theme.

---

## 4. SECTION-BY-SECTION SPEC

Thirteen sections. Section 5 (`#ulov`) is **the only dark band on the page** — the art director's "exactly one tonal event" rule, grafted from Concept 2 to fix Concept 1's metronome of three ink bands.

---

### 4.0 `<head>` — theme boot

An inline, blocking, four-line script before any stylesheet, to avoid a flash:

```html
<script>try{var t=localStorage.getItem("ma-theme");
if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t;
document.documentElement.style.colorScheme="only "+t;}}catch(e){}</script>
```

`<html lang="hr">` — the current site wrongly declares `en-US` over Croatian text. The toggle updates `documentElement.lang`.

---

### 4.1 `#chrome` — sticky header + mobile action bar

**Layout.** Header `position: sticky; inset-block-start: 0; z-index: 90`. Height `4.5rem` at ≥64rem, `3.5rem` below. Ground `color-mix(in oklch, var(--paper) 84%, transparent)` with `backdrop-filter: blur(14px) saturate(1.1)` **and the `-webkit-` prefix**. A 1px `--rule` bottom hairline appears only after scroll, toggled by an `IntersectionObserver` on a 1px sentinel — not a scroll listener.

Three-zone grid `auto 1fr auto`:
- **Left** — inline SVG wordmark. **Redraw required.** `sp.png` in the live header is a 115-byte transparent spacer containing no artwork, and `logo-monami.png` is a 576×298 raster on an opaque cream wood-grain ground. **Do not attempt Concept 3's CSS-mask trick** — `mask-image` keys off alpha, that PNG has full alpha everywhere, so the mask paints a solid rectangle. Draw `MON AMI` as paths with the **O as a plate ring** (a circle with a concentric inner circle, 1px stroke), `fill: currentColor`, above `RESTORAN` at 0.22em tracking. 28px tall.
- **Centre (≥64rem only)** — six anchors: `Jelovnik · Ulov · Priča · Ljudi · Galerija · Posjet`, Instrument Sans 500 at `--step-micro`, uppercase, `--track-micro`. Underline is a registered `@property --sweep <percentage>` driving a `linear-gradient` `background-size`, 0%→100% over `--t-base`. (Gradients cannot be transitioned directly; the registered property is what makes the sweep possible. `@property` is at 95.01% — the highest-support modern feature used here.)
- **Right** — the live status chip (§6.2), an `HR|EN` segmented toggle with `aria-pressed`, a theme button opening a popover with three radios (Auto / Svijetlo / Tamno), and `Rezerviraj` — 40px tall, `--r-0`, 1px `--claret` border, transparent fill.

Below 64rem the centre links move into a `popover` sheet opened by a 44×44 **text** button labelled `Izbornik` — never icon-only.

**Mobile action bar.** `position: fixed; inset-block-end: 0`, two equal columns, gap `--s-2`, `padding: var(--s-3)`, `padding-block-end: max(var(--s-3), env(safe-area-inset-bottom))`. Ground `color-mix(in oklch, var(--paper-2) 88%, transparent)` + backdrop blur + `--shadow-bar`. Left: `Rezerviraj stol`, filled `--claret`, 48px. Right: `Nazovi`, 1px outline, `href="tel:+38516213333"`, 48px. Hidden at ≥48rem. `body { padding-block-end: 5.5rem }` below 48rem so the footer is never covered.

> **It never hides.** Delete Concept 3's hide-on-scroll-down entirely. The phone guest: *"friction invented for elegance; there was no reason to take the button away."* The engineer flagged it as a recurring 2.4.11 regression source.

**Copy**

| | HR | EN |
|---|---|---|
| Nav | Jelovnik · Ulov · Priča · Ljudi · Galerija · Posjet | Menu · Catch · Story · People · Gallery · Visit |
| Primary CTA | `Rezerviraj stol` (≥64rem) / `Rezerviraj` | `Book a table` / `Book` |
| Phone CTA | `Nazovi 01 6213 333` | `Call 01 6213 333` |
| Menu button | `Izbornik` | `Menu` |
| Toggle a11y label | `Promijeni jezik` | `Change language` |
| Theme radios | `Automatski · Svijetlo · Tamno` | `Auto · Light · Dark` |

Never `Naslovnica` — this is a one-pager.

---

### 4.2 `#naslov` — Hero: type first, then the photograph

The compromise that satisfies all four judges. Concept 1's "type before photograph" won praise from the owner *and* the art director ("the one compositional decision a Wix theme structurally cannot make"), but the phone guest was right that 34vh of blank cream before any food is a failure at 390px. **Resolution: the type block is genuinely first, and it carries the status chip and both CTAs — so on a phone the guest gets the masthead, the open state and both buttons above the fold, and the photograph begins immediately below.**

**Layout — Block A (`--paper`, no image):**
- Padding `clamp(2.5rem, 6vh, 5rem)` block-start.
- `MON AMI` centred, `.display` at `--step-masthead`, `--lh-display`, `--track-mast`.
- Beneath: a 120px × 1px `--claret` rule.
- Beneath: `RESTORAN · VELIKA GORICA · OD 1997.` at `--step-micro`, `--track-micro`, `--stone`.
- H1 (`.display`, `--step-h1`, `text-wrap: balance`): **`Dvije obale, jedan stol.`**
- Lede, `--step-lead`, max `46ch`, `--stone`.
- The **distinction rule**: a 1px `--rule` line carrying three inline text items at `--step-micro` in `--gold-text`, gap `--s-5`, each an outbound link to its source. No logos, no star device, no toque graphic, no TripAdvisor owl. Below 40rem they stack.
- The **status chip** (§6.2).
- Action row: `Rezerviraj stol` filled `--claret` at 52px; `01 6213 333` ghost outline at 52px.

**Block B — the photograph.** Full-bleed, `height: min(60vh, 680px)` desktop / `aspect-ratio: 4/5` below 40rem. `object-fit: cover; object-position: center 45%`. This is the LCP element. `<picture>` AVIF→WebP→JPEG, explicit `width`/`height`, `loading="eager"`, `fetchpriority="high"` — **the only image on the page with it** — plus a matching `<link rel="preload" as="image" type="image/avif" fetchpriority="high">`. Never lazy. Bottom-left, over a `linear-gradient(to top, oklch(0.19 0.008 55 / 0.82) 0%, … / 0.35 40%, transparent 100%)`, a caption at `--step-micro` in `--paper`.

**Mobile height budget — a hard build gate.** At 390×844 with the browser chrome, the masthead + rule + eyebrow + H1 + lede + distinction rule + chip + both CTAs must fit above the fold. Measure it. If it overflows: drop the lede to two lines, then collapse the distinction rule to two items. **Do not shrink the CTAs below 48px and do not move them below the photograph.**

**Copy**

> **HR — H1:** `Dvije obale, jedan stol.`
> **EN — H1:** `Two shores, one table.`

> **HR — lede:** `Obiteljski restoran u srcu Velike Gorice. Od 1997. jadranska riba i turopoljsko polje na istom jelovniku — desetak minuta vožnje od Zračne luke Zagreb.`
> **EN — lede:** `A family restaurant in the heart of Velika Gorica. Since 1997, Adriatic fish and the fields of Turopolje on one menu — about ten minutes' drive from Zagreb Airport.`

> **Distinction rule (identical in both languages, they are proper nouns):**
> `MICHELIN GUIDE HRVATSKA 2026 · SELECTED` — `GAULT&MILLAU 13,5/20 · DVIJE KAPE` — `RESTAURANT CROATICA 2024`
> EN third item: `RESTAURANT CROATICA 2024` (unchanged); EN second item: `GAULT&MILLAU 13,5/20 · TWO TOQUES`

> **HR — hero caption:** `Jadranske lignje sa žara, s blitvom i krumpirom.`
> **EN:** `Grilled Adriatic squid with Swiss chard and potatoes.`

**No welcome sentence. No "dobrodošli". No "Tradicija duga 25 godina" — it is five years wrong.**

---

### 4.3 `#brzo` — Utility strip

Concept 3's single best structural decision: four answers as the *second* thing on the page. Four columns `repeat(4, 1fr)` with a 1px gap over a `--rule` background so the cells read as one ruled table. 2×2 below 48rem, 2×2 on the smallest phones. Ground `--paper-2`. Padding `--s-5` per cell. Label at `--step-micro`/`--track-micro`/`--stone`; value at `--step-h3` with `tabular-nums`. `content-visibility: auto; contain-intrinsic-size: auto 220px`.

| Cell | HR | EN |
|---|---|---|
| **RADNO VRIJEME** | `uto–sub 11–23 · pon 11–16:30 · ned zatvoreno` + a `<details>` chevron `Cijeli tjedan` expanding the per-day table inline | `Tue–Sat 11–23 · Mon 11–16:30 · Sun closed` / `Full week` |
| **REZERVACIJE** | `01 6213 333` (tel link), beneath at `--step-small`: `091 5444 715` | same |
| **ADRESA** | `Trg kralja Tomislava 26, Velika Gorica` (selectable) + link `Upute` | `… ` + `Directions` |
| **KAPACITET** | `70 mjesta · separe za 10 · natkrivena terasa` | `70 seats · private room for 10 · covered terrace` |

Line under the expanded table: `Nedjeljom i blagdanom ne radimo.` / `We are closed on Sundays and public holidays.`
Line under Rezervacije: `Za grupe veće od 10 osoba javite se telefonom.` / `For parties over 10, please call us.`

---

### 4.4 `#jelovnik` — The menu

The single biggest failure on the live site: `/jelovnik/` returns 404 and the real menu is trapped in a third-party iframe. This section is the fix.

**Ground.** A full-bleed **paper sheet** that stays light in both themes via a local `color-scheme: light` on the section, so a 62-row price column always scans dark-on-light. **Corners are square (`--r-0`) and it bleeds to both viewport edges.** Concept 3's 48px rounded floating island is deleted — the owner: *"the most software-looking element proposed anywhere"*; the art director: *"the one place the concept designs for the screenshot."* A 1px `--rule-strong` hairline marks its top and bottom edge. It is a sheet laid on the page, not a card in a dashboard.

**Rendering — hard requirement from the engineering judge.** The dish rows are **static HTML inlined at author time**. The JS array is the *documented edit surface* and lives in one clearly commented block at the top of the file; a small comment above the markup states `<!-- GENERATED FROM MENU[] — edit MENU[], then re-paste. Do not hand-edit rows. -->`. Client-rendering 62 rows costs CLS and undercuts the indexability that is this section's entire justification.

**Category rail.** Sticky at `inset-block-start: var(--header-h)` (a variable, not a literal — the header is 4.5rem/3.5rem across the breakpoint). Eleven chips, `scroll-snap-type: x proximity`, edge fade masks, each ≥24×24 with 8px spacing (2.5.8). **Visible `‹` and `›` buttons flank the rail at every viewport** — 44×44, real `<button>`s, `aria-label="Prethodna kategorija"` / `"Sljedeća kategorija"`. Swipe-only fails WCAG 2.5.7; Concept 2 was the only concept that got this right and it is grafted here. Active chip filled `--claret`, tracked by `IntersectionObserver` with `rootMargin: -140px 0px -70% 0px`.

Categories, in order: `Preporuka kuće · Hladna predjela · Topla predjela i rižota · Jela od mesa · Jela od riba · Prilozi · Salate · Slastice · Bez glutena · Vegetarijanski · Kruh i umaci`

**Diet filters.** A second row of four `<input type="checkbox">` toggle chips — `Bez glutena · Vegetarijanski · Riba · Meso` — driving a `:has()` selector on the list container. Zero JS, zero INP, keyboard-accessible for free, and degrades to "everything visible" where `:has()` is absent (94.82% support).

```css
.menu:has(#f-gf:checked) li:not([data-diet~="gf"]) { display: none; }
```

**Dish row.** Each `<li>` inherits its parent's tracks:

```css
.menu ol { display: grid;
  grid-template-columns: [name] minmax(0,1fr) [lead] auto [price] 8ch; }
.menu li { display: grid; grid-template-columns: subgrid; grid-column: 1 / -1;
  align-items: baseline; padding-block: var(--s-3);
  border-block-end: 1px solid var(--rule); }
```
- Name: Instrument Sans 600, `--step-body`, `--ink`.
- English beneath: Instrument Sans **italic** 400, `--step-small`, `--stone`. (Swaps to primary under `lang=en`, Croatian becomes the secondary line.)
- Leader: 1px `repeating-linear-gradient` dot row, `align-self: end`.
- Price: `tabular-nums`, `--claret`, `text-align: end`, format `26,50 €`.
- Badges after the name, `--step-micro` in a 1px `--rule-strong` pill at `--r-1`, **always with text, never icon-only**: `bez glutena` · `vegetarijansko` · `preporuka šefa` · `posebna ponuda` · `po kilogramu` · `privremeno nedostupno`.
- Chef-recommendation rows get a `--claret-wash` ground bleeding the full row width.

Each `<section>` gets `content-visibility: auto; contain-intrinsic-size: auto 900px`. Note: verify that in-page anchor jumps and browser find-in-page still reach skipped subtrees before shipping.

**Per-kilogram treatment — the defuser, with the instrument removed.** Four dishes are by weight. Each shows `96,00 €` with a `--claret` `/kg` suffix and a `po kilogramu` badge that is a real `<button popovertarget>`. **The popover contains text only.** Delete Concept 3's 0,2–1,2 kg range slider. The owner: *"That is a butcher's scale in a shop window, not a fish vitrine in a Michelin-recommended dining room. We weigh the fish in front of you, at the table, and we tell you the price ourselves. Say that in one sentence and delete the instrument."* The phone guest's real need — answer the fear at the row where it happens — is met by the popover's placement and its copy, which includes Concept 2's decode sentence:

> **HR popover:** `Cijena je po kilogramu. Ribu i školjke iz vitrine vagamo pred vama i cijenu vam kažemo prije pripreme.`
> `Oznaka 8–12 kom/kg označava veličinu: osam do dvanaest škampa čini jedan kilogram. Veći škamp, manje komada.`
> `Uobičajena porcija za jednu osobu je oko 0,3 do 0,4 kg.`
> **EN:** `Priced per kilogram. Fish and shellfish are weighed in front of you and we tell you the price before we cook.`
> `8–12 kom/kg is a size grade: eight to twelve langoustines make one kilogram. Larger langoustine, fewer pieces.`
> `A usual portion for one person is about 0.3 to 0.4 kg.`

*(The 0,3–0,4 kg guidance is a reasonable serving convention, not a restaurant statement — see §9.)*

**Pinned seasonal note** at the top of `Jela od riba`, in a 1px `--rule-strong` box:

> **HR:** `Svježa divlja bijela riba mijenja se prema dnevnom ulovu — škrpina, brancin, kovač, zubatac, crna orada. Vrste ovise o danu: pitajte osoblje što je jutros stiglo.`
> **EN:** `The fresh wild white fish changes with the daily catch — scorpionfish, sea bass, John Dory, dentex, black sea bream. Species depend on the day: ask our staff what arrived this morning.`

**Section head and footnotes.**

> **HR heading:** `Jelovnik`
> **HR subline:** `Zadnji put ažurirano [DATUM]. Cijene su u eurima i mogu se promijeniti.`
> **Footnotes, four lines at `--step-small` in `--stone`, above a `--rule-strong` hairline:**
> 1. `Za alergene pitajte osoblje — vodimo evidenciju svih 14 skupina.`
> 2. `Oznaka po kilogramu odnosi se na ribu i školjke koje se vagaju pred vama.`
> 3. `Jelovnik se mijenja sa sezonom i s ulovom. Dnevnu ponudu ribe pitajte osoblje.`
> 4. `Vinsku kartu ne objavljujemo — za preporuku uz vaš izbor nazovite nas.`
>
> **EN:** `Ask our staff about allergens — we keep a record of all 14 groups.` / `Per-kilogram pricing applies to fish and shellfish, weighed in front of you.` / `The menu changes with the season and the catch. Ask our staff about today's fish.` / `The wine list is not published online — call us for a recommendation to match your choice.`

**The data.** All 62 verified rows, with the English rewritten from scratch. The ordering platform currently ships `Prshutto`, `cackerels`, `french frie`, `homemaid`, `bouzzara`, and a truffle pasta labelled `Beefsteak salad` on a menu belonging to a MICHELIN-listed restaurant. Every string below replaces one of those.

```js
/* ══════════════════════════════════════════════════════════════════
   MENU — THE ONLY PLACE TO EDIT DISHES AND PRICES.
   Change a value here, regenerate the HTML rows, re-paste.
   price: string exactly as printed, Croatian comma decimal.
   unit:  "" | "kg"
   diet:  space-separated: gf | veg | fish | meat
   tag:   "" | "chef" | "offer"
   out:   true = currently unavailable
   ══════════════════════════════════════════════════════════════════ */
const MENU = [
{c:"Preporuka kuće", hr:"File brancina uz ražnjić od škampa s blitvom i krumpirom", en:"Sea bass fillet with a scampi skewer, Swiss chard and potatoes", p:"26,50 €", diet:"fish"},
{c:"Preporuka kuće", hr:"Lignje sa žara — paket (blitva s krumpirom, kruh)", en:"Grilled squid set — Swiss chard with potatoes, bread", p:"16,60 €", diet:"fish"},
{c:"Preporuka kuće", hr:"Riblja plata Mon Ami (za dvoje) — jadranska riba, lignje, kozice, blitva s krumpirom", en:"Mon Ami seafood platter for two — grilled Adriatic fish, squid, shrimp, Swiss chard with potatoes", p:"42,00 €", diet:"fish"},
{c:"Preporuka kuće", hr:"Pržene lignje — paket (pomfrit, tartar umak, kruh)", en:"Fried squid set — fries, tartar sauce, bread", p:"14,90 €", diet:"fish"},
{c:"Preporuka kuće", hr:"Istarski fuži s beefsteakom i crnim tartufom", en:"Istrian fuži with beefsteak and black truffle", p:"27,50 €", diet:"meat"},
{c:"Preporuka kuće", hr:"Ramsteak sa žara", en:"Grilled rump steak", p:"23,50 €", diet:"meat"},
{c:"Preporuka kuće", hr:"Losos sa žara glaziran teriyaki umakom, s pireom od celera i povrćem na pari", en:"Grilled salmon glazed with teriyaki, celery purée and steamed vegetables", p:"23,00 €", diet:"fish"},
{c:"Preporuka kuće", hr:"Pačji batak i zabatak s pireom od češnjaka, na redukciji od naranče i crnog vina", en:"Duck leg and thigh with garlic purée, orange and red wine reduction", p:"26,00 €", diet:"meat", out:true},

{c:"Hladna predjela", hr:"Carpaccio od tune s crnim tartufom", en:"Tuna carpaccio with black truffle", p:"18,50 €", diet:"fish", tag:"chef"},
{c:"Hladna predjela", hr:"Pršut, 50 g", en:"Dry-cured prosciutto, 50 g", p:"5,20 €", diet:"meat"},
{c:"Hladna predjela", hr:"Istarska kobasica s ružmarinom, 50 g", en:"Istrian sausage with rosemary, 50 g", p:"3,75 €", diet:"meat", out:true},
{c:"Hladna predjela", hr:"Paški sir Gligora, 50 g", en:"Gligora Pag sheep's cheese, 50 g", p:"7,25 €", diet:"veg"},
{c:"Hladna predjela", hr:"Težački sir Gligora, 50 g", en:"Gligora 'Težački' cheese, 50 g", p:"3,40 €", diet:"veg", out:true},
{c:"Hladna predjela", hr:"Dimljene dagnje na rikoli", en:"Smoked mussels on rocket", p:"14,50 €", diet:"fish"},
{c:"Hladna predjela", hr:"File inćuna (slani)", en:"Salted anchovy fillet", p:"1,50 €", diet:"fish"},
{c:"Hladna predjela", hr:"Pašteta od kozica", en:"Shrimp pâté", p:"9,50 €", diet:"fish"},

{c:"Topla predjela i rižota", hr:"Bijeli rižoto s kozicama", en:"White risotto with shrimp", p:"13,80 €", diet:"fish"},
{c:"Topla predjela i rižota", hr:"Pljukanci od špinata sa škampima, pestom od sušenih rajčica i tostiranim pistacijom", en:"Spinach pljukanci with scampi, sun-dried tomato pesto and toasted pistachio", p:"22,80 €", diet:"fish"},
{c:"Topla predjela i rižota", hr:"Pohane kozice s tartar umakom", en:"Breaded shrimp with tartar sauce", p:"17,50 €", diet:"fish", out:true},
{c:"Topla predjela i rižota", hr:"Prženi gavuni", en:"Fried sand smelt", p:"12,00 €", diet:"fish"},
{c:"Topla predjela i rižota", hr:"Crni rižoto od sipe", en:"Black cuttlefish risotto", p:"14,80 €", diet:"fish", tag:"chef"},
{c:"Topla predjela i rižota", hr:"Zeleni rezanci s kozicama na temeljcu od škampa", en:"Green tagliatelle with shrimp in scampi bisque", p:"14,00 €", diet:"fish"},
{c:"Topla predjela i rižota", hr:"Fuži s tartufatom, tartufima i pršutom", en:"Fuži with truffle cream, truffle and prosciutto", p:"17,80 €", diet:"meat", tag:"chef"},
{c:"Topla predjela i rižota", hr:"Pljukanci s kozicama", en:"Pljukanci — hand-rolled pasta — with shrimp", p:"15,00 €", diet:"fish"},

{c:"Jela od mesa", hr:"Beefsteak u umaku od zelenog papra", en:"Beefsteak in green peppercorn sauce", p:"42,00 €", diet:"meat"},
{c:"Jela od mesa", hr:"Beefsteak sa žara", en:"Grilled beefsteak", p:"39,00 €", diet:"meat"},
{c:"Jela od mesa", hr:"Beefsteak u umaku od tartufa", en:"Beefsteak in truffle sauce", p:"42,00 €", diet:"meat", tag:"offer"},
{c:"Jela od mesa", hr:"Pureći odrezak zagrebački", en:"Turkey escalope Zagreb style", p:"14,50 €", diet:"meat", out:true},
{c:"Jela od mesa", hr:"Pureći odrezak Mon Ami", en:"Turkey escalope Mon Ami style", p:"14,00 €", diet:"meat", tag:"chef"},
{c:"Jela od mesa", hr:"Punjeni lungić", en:"Stuffed pork loin", p:"13,50 €", diet:"meat"},
{c:"Jela od mesa", hr:"Mesna plata Mon Ami (za dvoje) — beefsteak, otkošteni pileći zabatak, lungić sa žara, puretina punjena sirom i lax kareom", en:"Mon Ami meat platter for two — beefsteak, deboned chicken thigh, grilled pork loin, turkey stuffed with cheese and smoked loin", p:"39,00 €", diet:"meat"},
{c:"Jela od mesa", hr:"Lungić sa žara s krumpirovim ploškama", en:"Grilled pork loin with homemade potato slices", p:"14,00 €", diet:"meat"},
{c:"Jela od mesa", hr:"Lungić sa žara i pečeni krumpir s ružmarinom", en:"Grilled pork loin with rosemary roast potatoes", p:"14,00 €", diet:"meat"},

{c:"Jela od riba", hr:"Jadranske lignje sa žara", en:"Grilled Adriatic squid", p:"62,00 €", unit:"kg", diet:"fish"},
{c:"Jela od riba", hr:"Škampi sa žara (8–12 kom/kg)", en:"Grilled scampi (8–12 per kg)", p:"96,00 €", unit:"kg", diet:"fish", tag:"offer"},
{c:"Jela od riba", hr:"Škampi na buzaru", en:"Scampi buzara", p:"96,00 €", unit:"kg", diet:"fish"},
{c:"Jela od riba", hr:"Školjke na buzaru", en:"Shellfish buzara", p:"63,00 €", unit:"kg", diet:"fish"},

{c:"Prilozi", hr:"Domaći kroketi", en:"Homemade potato croquettes", p:"6,00 €", diet:"veg"},
{c:"Prilozi", hr:"Domaće pržene šnite krumpira", en:"Homemade fried potato slices", p:"5,80 €", diet:"veg"},
{c:"Prilozi", hr:"Pomfrit", en:"French fries", p:"4,20 €", diet:"veg"},
{c:"Prilozi", hr:"Blitva s krumpirom", en:"Swiss chard with potatoes", p:"6,50 €", diet:"veg gf"},
{c:"Prilozi", hr:"Blitva", en:"Swiss chard", p:"7,00 €", diet:"veg gf"},
{c:"Prilozi", hr:"Pečeni krumpir s ružmarinom", en:"Rosemary roast potatoes", p:"4,50 €", diet:"veg gf"},
{c:"Prilozi", hr:"Domaći njoki", en:"Homemade gnocchi", p:"5,50 €", diet:"veg"},
{c:"Prilozi", hr:"Povrće sa žara", en:"Grilled vegetables", p:"5,80 €", diet:"veg gf"},

{c:"Salate", hr:"Salata od matovilca", en:"Lamb's lettuce salad", p:"4,40 €", diet:"veg gf"},
{c:"Salate", hr:"Salata od rikole", en:"Rocket salad", p:"4,40 €", diet:"veg gf"},
{c:"Salate", hr:"Zelena salata", en:"Green salad", p:"3,60 €", diet:"veg gf"},
{c:"Salate", hr:"Salata od zelja", en:"Cabbage salad", p:"3,60 €", diet:"veg gf"},
{c:"Salate", hr:"Miješana salata", en:"Mixed salad", p:"3,80 €", diet:"veg gf"},
{c:"Salate", hr:"Šopska salata", en:"Šopska salad — tomato, cucumber, pepper, grated cheese", p:"6,00 €", diet:"veg gf"},
{c:"Salate", hr:"Pečena paprika", en:"Roasted peppers", p:"5,00 €", diet:"veg gf"},

{c:"Slastice", hr:"Čokoladni souffle", en:"Chocolate soufflé", p:"5,00 €", diet:"veg"},
{c:"Slastice", hr:"Skradinska torta", en:"Skradin cake — almonds, orange and walnuts", p:"4,00 €", diet:"veg gf",
  note_hr:"Bez brašna, s bademima, narančom i orasima — po kraju iz kojeg dolazi naša obitelj.",
  note_en:"No flour: almonds, orange and walnuts — from the region our family comes from."},

{c:"Bez glutena", hr:"Lignje Mon Ami s prosom", en:"Mon Ami squid with millet", p:"16,50 €", diet:"gf fish", out:true},
{c:"Bez glutena", hr:"Riba sa žara s blitvom i krumpirom", en:"Grilled Adriatic fish with Swiss chard and potatoes", p:"21,50 €", diet:"gf fish"},

{c:"Vegetarijanski", hr:"Zelene tagliatelle u umaku od šumskih gljiva", en:"Green tagliatelle in wild mushroom sauce", p:"12,50 €", diet:"veg"},
{c:"Vegetarijanski", hr:"Rižoto od povrća", en:"Vegetable risotto", p:"11,00 €", diet:"veg gf"},

{c:"Kruh i umaci", hr:"Domaći kruh, 3 kriške", en:"Homemade bread, 3 slices", p:"1,50 €", diet:"veg"},
{c:"Kruh i umaci", hr:"Tartar umak", en:"Tartar sauce", p:"2,20 €", diet:"veg"},
{c:"Kruh i umaci", hr:"Umak od šampinjona", en:"Button mushroom sauce", p:"5,00 €", diet:"veg gf"},
{c:"Kruh i umaci", hr:"Umak od vrganja", en:"Porcini sauce", p:"6,50 €", diet:"veg gf"},
];
```

The `Skradinska torta` note renders as a two-line `--step-small` `--stone` block under its row — the owner's favourite detail and the phone guest's: *"One dessert that carries the whole family story; cheap, and it is what I will order."*

Diet tags marked `gf` on side dishes are inference from composition, **not** a kitchen statement — see §9.

---

### 4.5 `#ulov` — Dnevni ulov (THE ONE DARK BAND)

The page's single tonal event. Ground `oklch(0.190 0.008 55)` (`#171310`) in **both** themes — in dark mode it inverts to `--paper-2` so the rhythm holds either way. Full-bleed, `padding-block: clamp(4rem, 9vw, 9rem)`. Every rule inside becomes `--night-rule`; every heading `--night-ink`; the closing line `--night-gold` (9.88:1). `content-visibility: auto; contain-intrinsic-size: auto 700px`.

**Layout.** 12-col grid. Left (`1 / 6`): `gallery/05.jpg` bleeding off the viewport's left edge. Right (`7 / 13`): `--step-h2` heading, two short paragraphs, then the species list as a two-column typographic list with 1px `--night-rule` separators — Croatian name in Instrument Sans 500 at `--step-body`, English beneath at `--step-small` in `--night-stone`. Stacks below 64rem.

**Species:** škrpina / scorpionfish · brancin / sea bass · kovač / John Dory · zubatac / dentex · crna orada / black sea bream · sabljarka / swordfish · kvarnerski škampi / Kvarner langoustines · jastog / lobster

**Copy**

> **HR — kicker:** `RIBA`
> **HR — H2:** `Riba stiže tri puta tjedno.`
> **HR:** `Brodovi ne isplovljavaju svaki dan, pa radimo s više ribara. Ljeti meduze zatrpaju mreže i ulov padne — zato nikada ne ovisimo o jednom izvoru.`
> **HR:** `Ribu i školjke iz vitrine vagamo pred vama. Cijena se određuje po kilogramu i mijenja se s ulovom — reći ćemo vam je prije nego što krenemo u pripremu.`
> **HR — closing line, `--night-gold`, set apart above a hairline:** `Vrste ovise o danu. Pitajte što je jutros stiglo.`

> **EN — kicker:** `THE CATCH`
> **EN — H2:** `The fish arrives three times a week.`
> **EN:** `The boats do not sail every day, so we work with several fishermen. In summer the jellyfish clog the nets and the catch falls — which is why we never depend on a single source.`
> **EN:** `Fish and shellfish from the display are weighed in front of you. The price is per kilogram and moves with the catch — we will tell you before we start cooking.`
> **EN — closing:** `The species depend on the day. Ask what came in this morning.`

---

### 4.6 `#priznanja` — Priznanja

Concept 1's type-only awards band, the owner's second graft — **but ink-on-paper, not a full-bleed dark ground.** The art director: *"Cut Concept 1's three full-bleed ink bands to ONE. The page gains a climax instead of a metronome."*

**Layout.** Ground `--paper-2`. Four columns at ≥64rem (2×2 below), separated by 1px `--rule-strong` verticals. Each column: year at `--step-micro` in `--gold-text`; one line in `.display` at `--step-h3` in `--ink`; one caption at `--step-small` in `--stone`. Below the four, a centred single line at `--step-small`. **No MICHELIN device, no Gault&Millau toque graphic, no TripAdvisor owl, no star, no Bib.**

| Year | Line | Caption HR | Caption EN |
|---|---|---|---|
| `2026` | `MICHELIN Guide Hrvatska` | `Selected · u vodiču od 2018.` | `Selected · in the guide since 2018` |
| `2026` | `Gault&Millau 13,5/20` | `dvije kape · Chef's Restaurant` | `two toques · Chef's Restaurant` |
| `2024` | `Restaurant Croatica` | `među 100 vodećih hrvatskih restorana` | `among Croatia's 100 leading restaurants` |
| `1999.–2025.` | `23 puta` | `na listi 100 najboljih u Hrvatskoj` | `on Croatia's top-100 list` |

Closing line, centred, `--stone`:
> **HR:** `…a naša najvažnija preporuka su naši gosti.`
> **EN:** `…and our most important recommendation is our guests.`

> **Do not write "bez zvjezdice".** Concept 1 proposed glossing `Selected` as *"preporuka, bez zvjezdice"* and the owner refused it outright: *"No proprietor announces on his own front page what he has not won."* The phone guest's legitimate concern — that someone arrives expecting a starred room — is answered by never showing a star device and by writing `Selected` plainly. Say `MICHELIN Guide Hrvatska 2026 · Selected` and stop the sentence there.

Assert **no consecutive-year ordinal.** Sources report three, six and seven years depending on article date. `u vodiču od 2018.` is the only defensible formulation.

---

### 4.7 `#prica` — Priča

**Layout.** 12-col asymmetric. Left (`1 / 5`, `position: sticky; top: 7rem`): kicker `MORE`, then the portrait-orientation `gallery/30.jpg` at 3:4 — the only vertical frame in the entire 40-image library — then a four-line caption. Right (`7 / 13`, scrolls past): kicker `KOPNO`, `--step-h2` heading, four paragraphs at `--measure`, then an inline timeline of four hairline-separated dated rows. Below, full width, Bruno's quote centred in `.display` at `--step-h2`. Below 64rem: stacks, sticky removed.

**Timeline rows:** `1997. — osnutak` · `2008. — Goran Marko Beus preuzima kuhinju` · `2018. — prva MICHELIN preporuka` · `2026. — MICHELIN Selected i Gault&Millau 13,5/20`

**Copy**

> **HR — H2:** `Skradin i Turopolje, pod istim krovom.`
> **HR:** `Božo Ceronja došao je iz skradinskoga kraja. Barica je rođena Turopoljka. Kad su 1997. otvorili restoran na glavnom trgu Velike Gorice i stavili jadransku ribu na jelovnik u gradu koji je jeo s roštilja, to nije bila gesta — bio je to rizik.`
> **HR:** `Ideja je bila jednostavna i tvrdoglava: dvije kuhinje pod istim krovom, mediteranska i kontinentalna, na istom jelovniku, bez kompromisa ni prema jednoj strani. Riba s Jadrana, tartuf i meso iz Turopolja, ulje iz vlastitog maslinika u Skradinu.`
> **HR:** `Danas restoran vodi njihov sin Bruno, zajedno s majkom. Kuhinju već sedamnaest godina vodi chef Goran Marko Beus, rodom Splićanin, s karijerom na dalmatinskoj obali i na brodovima.`
> **HR:** `Ono što se od 1997. nije promijenilo: kvaliteta namirnice i njezina izvornost. Većina onoga što kuhamo dolazi iz kruga do stotinu kilometara.`
> **HR — pull-quote, `.display`, with a 2px `--claret` left rule on a `--claret-wash` block:** `„Prava mala revolucija.“ — Bruno Ceronja, o odluci svog oca da u Velikoj Gorici stavi ribu na jelovnik`

> **EN — H2:** `Skradin and Turopolje, under one roof.`
> **EN:** `Božo Ceronja came from the Skradin region. Barica was born in Turopolje. When they opened a restaurant on Velika Gorica's main square in 1997 and put Adriatic fish on the menu in a town that ate grilled meat, it was not a gesture — it was a risk.`
> **EN:** `The idea was simple and stubborn: two kitchens under one roof, Mediterranean and continental, on the same menu, with no concession to either side. Fish from the Adriatic, truffle and meat from Turopolje, oil from our own grove in Skradin.`
> **EN:** `Today their son Bruno runs the restaurant with his mother. The kitchen has been led for seventeen years by chef Goran Marko Beus, born in Split, with a career along the Dalmatian coast and on ships.`
> **EN:** `What has not changed since 1997: the quality of the ingredient and where it truly comes from. Most of what we cook travels less than a hundred kilometres.`
> **EN — pull-quote:** `"A real little revolution." — Bruno Ceronja, on his father's decision to put fish on a menu in Velika Gorica`

Never write `Tradicija duga 25 godina`. If a duration is needed, compute it: `Od 1997. — gotovo trideset godina.`

---

### 4.8 `#ljudi` — Ljudi

Concept 1's section, the owner's single highest-priority graft: *"Twenty-nine years and our website currently shows nobody. That is what a family restaurant is."* Concept 3 has no people section at all.

**Layout — deliberately unequal, never a three-card row.** Chef large (`1 / 7`, 3:4). Bruno medium (`8 / 11`, 3:4, `margin-block-start: 6rem`). Team wide (`1 / 13`, 21:9, below both). Each caption block: name in `.display` at `--step-h3`; role at `--step-micro`/`--track-micro`/`--stone`; one quote in `.display` at `--step-lead` with a 32px `--claret` rule above it. Portraits get `filter: saturate(0.94)` so three sources match tonally.

| | HR | EN |
|---|---|---|
| Chef name | `Goran Marko Beus` | same |
| Chef role | `šef kuhinje od 2008.` | `head chef since 2008` |
| Chef bio | `Rodom Splićanin. Karijeru je gradio na dalmatinskoj obali i na brodovima. Mediteransku kuhinju definira s tri stvari: kvalitetno ulje, svježe voće i povrće, i što manje termičke obrade.` | `Born in Split. He built his career along the Dalmatian coast and on ships. He defines Mediterranean cooking by three things: good oil, fresh fruit and vegetables, and as little heat as possible.` |
| Chef quote | `„Ne znaš tko ti sjedi za stolom.“` | `"You never know who is sitting at your table."` |
| Bruno name | `Bruno Ceronja` | same |
| Bruno role | `vlasnik i domaćin` | `owner and host` |
| Bruno quote | `„Sve što može biti lokalno koristimo u kuhinji.“` | `"Whatever can be local, we use in the kitchen."` |
| Team caption | `Vinsku kartu vodi sommelier Zlatko Šimac. U kuhinji nas je desetak. Zapošljavamo lokalne ljude, a berbu maslina i grožđa odradimo zajedno.` | `The wine list is in the hands of sommelier Zlatko Šimac. There are about ten of us in the kitchen. We employ local people, and we do the olive and grape harvests together.` |

---

### 4.9 `#vlastito` — Vlastito: ulje, tartuf, vino

Three asymmetric editorial panels, deliberately unequal, the page's hairline threading through all three.

- **Panel 1 — Ulje** (`1 / 8`): `gallery/14.jpg` bleeding off the left edge, text block right.
- **Panel 2 — Tartuf** (`6 / 13`, `margin-block-start: -6rem` so it overlaps Panel 1 across the column rule).
- **Panel 3 — Vino** (full 12 cols): `onama1.jpg` at 21:9 with a `--paper` card overlapping its lower-left at `inset-block-end: -3rem`.

> **On the truffle panel.** Concept 1 proposed shipping no photograph and setting `TARTUF` at display size in gold at 18% opacity, calling it "absence as composition." The art director called it the only genuinely original image in all three concepts. **The owner vetoed it:** *"That is a designer solving his own problem in public. We grate that truffle at the table every day of the year. Photographing it costs me twenty minutes and a clean plate. Do not turn a gap in the archive into the most striking panel on my website; fill the gap."*
>
> **Build it as a designed CSS panel with an explicit, marked swap-in point.** The `.panel-tartuf` figure carries the typographic treatment as its `background` (§5, `--fallback-truffle`) and an empty `<picture>` slot commented `<!-- SWAP: commissioned truffle-on-plate frame, 3:2. Remove .is-typeset when filled. -->`. The handover instructs the client to send a photographer for one morning: **the facade, the terrace, and the truffle on a plate.** This is a placeholder, not a permanent feature.

**Copy**

> **Ulje — HR:** kicker `VLASTITA PROIZVODNJA`, H3 `Ulje iz našeg maslinika u Skradinu`
> `Maslinik je obiteljski, u skradinskom kraju, pretežno sorta oblica. Ulje punimo pod etiketom Mon Ami i koristimo ga gotovo u svemu što kuhamo — od prženih gavuna do dimljenih dagnji.`
> Three-row spec table in subgrid with hairline dividers: `Sorta — Oblica` · `Maslinik — Skradin, OPG Ceronja` · `Priznanje — zlatno odličje, 96,42 boda, Dani mladih maslinovih ulja, Vodice`
> `Ulje, hrvatske zelene masline i čaj od maslina možete kupiti kod nas.`
> Chef quote, `.display`: `„Bez njega ne možemo ni zamisliti kuhinju.“ — chef Goran Marko Beus`
> **Boxed caveat**, `--step-small`, `--stone`, 1px `--rule-strong` box: `Maslinik, ulje i njegova priznanja isključivo su naši. MICHELIN i Gault&Millau u svojim tekstovima ne spominju naše ulje.`

> **Ulje — EN:** `Oil from our grove in Skradin` / `The grove is the family's, in the Skradin region, mostly the oblica variety. We bottle the oil under the Mon Ami label and use it in almost everything we cook — from fried sand smelt to smoked mussels.` / `Variety — Oblica` · `Grove — Skradin, OPG Ceronja` · `Award — gold, 96.42 points, Dani mladih maslinovih ulja, Vodice` / `The oil, Croatian green olives and olive-leaf tea can be bought here.` / `"We cannot even imagine the kitchen without it." — chef Goran Marko Beus` / **Caveat:** `The grove, the oil and its awards are entirely our own. Neither MICHELIN nor Gault&Millau mention our oil in their write-ups.`

> **Tartuf — HR:** H3 `Crni turopoljski tartuf, svaki dan u godini`
> `Godinama smo tartuf dovozili iz Istre. Danas ga vadimo ovdje — svježi autohtoni crni turopoljski tartuf, cijele godine, naribati pred vama za stolom, najčešće preko carpaccia od tune.`
> `Ako nas nazovete dan ranije, možete ga i kupiti i naribati sami.`
> **EN:** `Black Turopolje truffle, every day of the year` / `For years we brought truffle from Istria. Today we dig it here — fresh native black Turopolje truffle, all year round, grated at your table, most often over the tuna carpaccio.` / `Call a day ahead and you can buy it and grate it yourself.`

> **Vino — HR:** H3 `Šezdeset etiketa i jedno naše`
> `Vinska karta broji 60 etiketa, poglavito hrvatskih proizvođača. Vino kuće proizvodimo sami: cuvée Chardonnay i Graševina iz podregije Pokuplje, vinogorje Vukomeričke gorice. Kartu vodi sommelier Zlatko Šimac.`
> A `<details><summary>Nekoliko etiketa s karte</summary>` disclosing exactly the three documented wines, **with no prices**: `Vino kuće — cuvée Chardonnay-Graševina, Vukomeričke gorice` · `Krauthaker Graševina Mitrovac, Kutjevo` · `Pjenušac Poy, Mladina, Plešivica`
> Closing: `Cijelu kartu ne objavljujemo. Za preporuku uz vaš izbor — nazovite nas.`
> **EN:** `Sixty labels, and one of our own` / `The wine list runs to 60 labels, predominantly Croatian producers. The house wine we make ourselves: a Chardonnay–Graševina cuvée from the Pokuplje subregion, Vukomeričke gorice. The list is in the hands of sommelier Zlatko Šimac.` / `A few labels from the list` / `We do not publish the full list. For a recommendation to match your choice — call us.`

**Named-supplier strip**, full width beneath the three panels: a 1px `--rule-strong` top hairline, three cells in subgrid with numerals `01 / 02 / 03` in `.display` `--gold-text`, producer in Instrument Sans 600, what they supply and where at `--step-small` `--stone`. **No photograph** — this is the page's rest beat between two image-heavy bands.

> **HR heading:** `Većina namirnica dolazi iz kruga do stotinu kilometara.`
> `01 · OPG Balić — med, Žumberačko gorje` · `02 · OPG Haha — lješnjaci i pasta od lješnjaka, Turopolje` · `03 · OPG Goga — kruške, Turopolje`
> `Od njih troje chef slaže semifreddo od vanilije i meda sa slanom kremom od lješnjaka i coulisom od kruške — „pravo slavlje kraja oko nas“.`
> **EN:** `Most of what we cook travels less than a hundred kilometres.` / `01 · OPG Balić — honey, Žumberak Highlands` / `02 · OPG Haha — hazelnuts and hazelnut paste, Turopolje` / `03 · OPG Goga — pears, Turopolje` / `From those three the chef builds a vanilla-and-honey semifreddo with salted hazelnut cream and pear coulis — "a true celebration of the land around us."`

---

### 4.10 `#prostor` — Prostor i prigode

Merges Concept 1's capacity table with Concept 3's events section and enquiry route.

**Layout.** Full-bleed `gallery/01.jpg` at 21:9. Beneath, on `--paper`: a three-column capacity table built on subgrid so the numerals align. Then events as a hairline-separated list, one per row, label left and a one-line note right. `onama2.jpg` at `grid-column: 7 / 13` beside the list — an empty room sells the design, a full room sells the dinner. Right-aligned: a secondary button `Upit za prigodu` opening the `<dialog>` with the `Prigoda` radio preselected and `broj osoba` starting at 10.

**Capacity table** (the phone guest's graft — prose does not answer a christening enquiry in one glance):

| HR | EN |
|---|---|
| `Glavna dvorana — 70 mjesta` | `Main room — 70 seats` |
| `Separe — 10 mjesta · zatvorena poslovna druženja` | `Private room — 10 seats · closed business gatherings` |
| `Natkrivena terasa — oko 20 mjesta · grijana` | `Covered terrace — about 20 seats · heated` |

**Events list:** `Svadbe i krštenja` · `Pričesti i krizme` · `Poslovni ručkovi u separeu` · `Tematske večeri i sezonski dani`

**Copy**

> **HR — H2:** `Prostor i prigode`
> **HR, verbatim from the restaurant:** `Interijer je sadržan od prirodnih materijala koji predstavljaju naš pristup življenju i poslovanju.` Followed by: `Hrastovi stolovi, mramor i kamen. Sala s bijelim stolnjacima i natkrivena terasa, nešto opuštenija.`
> **HR:** `Mon Ami je idealno mjesto za poslovna druženja, svadbe, pričesti, krizme i krštenja.`
> **HR — the constraint, stated plainly:** `Restoran prima do 70 gostiju u dvorani i 10 u separeu. Za veće skupine i svadbe javite se najmanje tjedan dana unaprijed kako bismo dogovorili detalje.`
> **HR — house rules, once, quietly, `--step-small` `--stone`:** `Ulaz kućnih ljubimaca nije dozvoljen. U prostoru se ne puši.`

> **EN — H2:** `The room, and the occasions`
> **EN:** `The interior is made of natural materials that represent our approach to living and to business.` / `Oak tables, marble and stone. A room with white tablecloths, and a covered terrace that is a little more relaxed.`
> **EN:** `Mon Ami is an ideal place for business gatherings, weddings, first communions, confirmations and christenings.`
> **EN:** `The restaurant seats up to 70 guests in the main room and 10 in the private room. For larger parties and weddings, please contact us at least a week ahead so we can arrange the details.`
> **EN:** `No pets. No smoking indoors.`

---

### 4.11 `#galerija` — Galerija

Concept 1's curated sequence, the owner's third graft. **Not a forty-thumbnail grid.** Seven frames in a 12-col `grid-auto-flow: dense` layout with deliberately varied spans: `[7 cols 3:2][5 cols 4:5]` / `[12 cols 21:9]` / `[4][4][4] all 1:1` / `[6 cols 4:5][6 cols 3:2]`.

Every image `loading="lazy"`, `decoding="async"`, inside `content-visibility: auto`. Each tile: `--r-1`, a 1px inset ring (`box-shadow: inset 0 0 0 1px var(--rule)`) so black-ground photographs do not bleed into the page in dark mode. Caption beneath at `--step-small` `--stone`. `alt` describes the photograph for someone who cannot see it and **is different from the caption** — all forty images currently have `alt=""`.

**Lightbox.** A `<dialog>` opened with `showModal()` — focus trapping and inertness come free. Real `‹ Prethodna` / `Sljedeća ›` **buttons** (44×44), plus ArrowLeft/ArrowRight and Escape. Swipe-only fails WCAG 2.5.7. `view-transition-name` assigned to the clicked `<img>` in JS and cleared on `finished` — duplicate names break the transition.

| # | File | Caption HR | Caption EN | alt HR |
|---|---|---|---|---|
| 1 | `gallery/28.jpg` | `Riba na žaru na drveni ugljen` | `Fish on the charcoal grill` | `Odresci ribe na rešetki roštilja, plamen i dim ispod njih.` |
| 2 | `gallery/25.jpg` | `Hobotnica se raspoređuje na tanjur` | `Octopus being plated` | `Kuharica u crnoj jakni i kapi viljuškom slaže hobotnicu s roštilja na bijeli tanjur.` |
| 3 | `gallery/33.jpg` | `Škrpina ide u lonac` | `Scorpionfish into the pot` | `Dvodijelna slika: ruka spušta cijelu škrpinu u lonac, zatim ista riba krčka u ulju i začinskom bilju nad otvorenim plamenom.` |
| 4 | `gallery/37.jpg` | `Živi jastog iz vitrine` | `A live lobster from the display` | `Krupni plan živog jastoga tamnoplave ljuske s krem i narančastim šarama, na zelenoj salati.` |
| 5 | `gallery/18.jpg` | `Rolana teletina punjena sirom` | `Rolled veal stuffed with cheese` | `Tri kriške rolane teletine na crnom sjajnom tanjuru, sa svijetlim umakom, glaziranim batatom i vlascem.` |
| 6 | `gallery/03.jpg` | `Naše maslinovo ulje iz Skradina` | `Our olive oil from Skradin` | `Dvije boce ekstra djevičanskog maslinovog ulja s etiketom Mon Ami, ispred zida od opeke i starog drvenog ormara.` |
| 7 | `gallery/40.jpg` | `Čokoladna torta s orasima i sladoledom` | `Chocolate and walnut torte with ice cream` | `Kriška čokoladom glazirane torte s orasima, kriškama naranče i kuglicom sladoleda prelivenom karamelom i pistacijama, na tamnom tanjuru.` |

**Section copy**

> **HR — H2:** `Galerija`
> **HR — subline:** `Dvadeset ovih fotografija godinama je stajalo na našem poslužitelju i nikada se nije pojavilo na stranici.`
> **HR — credit, `--step-micro`, `--track-micro`:** `FOTOGRAFIJE: JOSIP ŠKOF, MARIO ŽILEC, JAKOB GOLDSTEIN`
> **HR — closing text link (not pagination):** `Pogledajte nas na Instagramu`
> **EN:** `Gallery` / `Twenty of these photographs sat on our server for years and never appeared on the site.` / `PHOTOGRAPHS: JOSIP ŠKOF, MARIO ŽILEC, JAKOB GOLDSTEIN` / `See more on Instagram`

---

### 4.12 `#posjet` — Posjet

Fixes the most damaging failure on the live site: hours that exist on exactly one page, phrased so a guest arrives Monday at 19:00 to a locked door.

**Layout.** Three columns at ≥64rem, one below.

**Column 1 — the hours table.** A real `<table>` with a `<caption class="visually-hidden">`, one `<tr>` per day, hairline-separated, times in `tabular-nums`. Today's row gets a 2px `--claret` left border, `--paper-2` ground, `aria-current="date"` and a `danas` tag. The row and the header chip read from **one** function, so they can never disagree.

| HR | Hours | EN |
|---|---|---|
| Ponedjeljak | 11:00 – 16:30 | Monday |
| Utorak | 11:00 – 23:00 | Tuesday |
| Srijeda | 11:00 – 23:00 | Wednesday |
| Četvrtak | 11:00 – 23:00 | Thursday |
| Petak | 11:00 – 23:00 | Friday |
| Subota | 11:00 – 23:00 | Saturday |
| Nedjelja | `zatvoreno` | Sunday — `closed` |

Below: `Blagdanom ne radimo.` / `We are closed on public holidays.`
Plus an **empty seasonal-notice slot** (§6.2, `HOURS.notice`) rendered only when non-empty, for the owner to fill by phone without touching layout.

**Column 2 — address and map.** Address as selectable text. Both numbers as `tel:` links with 44px targets. Email as `mailto:`. An `Otvori u Google kartama` outbound text link. **No Maps iframe** — an LCP liability and a third-party-cookie problem. In its place, an **inline SVG mini-map** (§5): the square, the bus station, and a three-minute walk line. Zero licensed raster, no API key, scales to any DPR.

**Column 3 — arrival, as three concrete routes** (Concept 3, the owner's graft), each a hairline row with a `tabular-nums` figure:

| HR | EN |
|---|---|
| `AUTOMOBILOM — 8 do 12 minuta od Zračne luke Zagreb, oko 6 km` | `BY CAR — 8 to 12 minutes from Zagreb Airport, about 6 km` |
| `AUTOBUSOM — polasci sa Zračne luke svakih 35 minuta, oko 2 €, pa 3 minute hoda od autobusnog kolodvora` | `BY BUS — departures from the airport every 35 minutes, about €2, then a 3-minute walk from the bus station` |
| `IZ ZAGREBA — linija 290 s Kvaternikova trga, oko 30 minuta` | `FROM ZAGREB — line 290 from Kvaternikov trg, about 30 minutes` |
| `ROMOBILOM — gradski električni romobili u neposrednoj blizini` | `BY SCOOTER — city e-scooters in the immediate vicinity` |

**Amenity chips**, 1px outline, `--r-1`, always with text: `Parking` · `Klima` · `Pristupačan ulaz` · `Wi-Fi` — plus two honest negatives in `--stone`: `Bez kućnih ljubimaca` · `Zabranjeno pušenje`.

**Closing booking block**, spanning all three columns: `Rezerviraj stol` filled `--claret` at 56px, and beside it `Nazovi 01 6213 333`.

> **HR:** `Rezervacije primamo telefonom i putem obrasca. Rezervacija je poželjna, osobito vikendom. Za veće skupine i proslave javite se ranije.`
> **EN:** `We take reservations by telephone and through the form. A reservation is advisable, especially at weekends. For larger parties and celebrations, please contact us in advance.`

**Never reuse the sentence `11:00 – 23:00 svaki dan osim nedjelje i blagdana`.** The Monday line overrides it, and a guest who reads it arrives Monday evening to a locked door. The table replaces it entirely.

---

### 4.13 `#rezervacija` — The dialog

A native `<dialog>` opened with `showModal()`. Width `min(36rem, calc(100vw - 2rem))`, ground `--paper`, `--r-0`, 1px `--rule-strong` border, `--shadow-dialog`. Backdrop `oklch(0.19 0.008 55 / 0.45)` with `backdrop-filter: blur(6px)`.

Fields on a two-column subgrid collapsing to one below 30rem:
- `Ime i prezime` (required)
- `Telefon` — `type="tel"` (required)
- `E-mail` — `type="email"`
- `Datum` — `type="date"`, `min` set to today in Europe/Zagreb
- `Vrijeme` — a `<select>` **populated by JS from the hours object**, so Monday never offers 19:00 and Sunday is disabled outright. 30-minute slots, last slot 90 minutes before close.
- `Broj osoba` — segmented control 1–8 plus `9+`
- Radio group: `Ručak` / `Večera` / `Prigoda`
- `Napomena` — `<textarea field-sizing: content>` (purely cosmetic, fails safe)

Validation is **native constraint validation** styled with `:user-invalid`. No JS validator.

Submit posts to a simple form endpoint with a `mailto:` fallback. **The phone number sits permanently beside the submit button, never behind it.**

Three reassurance rows, hairline-separated, right column (above the submit on mobile):

> `Za 9 i više osoba, separe za 10 ili svadbu — nazovite nas.`
> `Vegetarijanska, veganska i bezglutenska jela pripremamo svaki dan.`
> `Terasa je natkrivena i grijana.`

**Copy**

| | HR | EN |
|---|---|---|
| Heading | `Rezervirajte stol` | `Book a table` |
| Sub | `Rezervacija je poželjna, osobito vikendom.` | `A reservation is advisable, especially at weekends.` |
| >10 note | `Za više od 10 osoba nazovite nas — dogovorit ćemo separe ili dvoranu.` | `For more than 10 guests, please call — we will arrange the private room or the main room.` |
| Napomena placeholder | `alergije, bezglutenska jela, dječja stolica, poslovni sastanak` | `allergies, gluten-free dishes, high chair, business meeting` |
| Submit | `Pošalji zahtjev za rezervaciju` | `Send reservation request` |
| Success | `Hvala. Javit ćemo vam se telefonom radi potvrde — obično isti dan. Ako vam se žuri, nazovite 01 6213 333.` | `Thank you. We will call you to confirm — usually the same day. If you are in a hurry, call 01 6213 333.` |

Explicitly a **request**, not a confirmation — bookings are handled by phone. Focus returns to the triggering button on close.

---

### 4.14 `#podnozje` — Podnožje

Ground `--paper-2`, a `--rule-strong` hairline above. Four columns at ≥64rem, two below:

1. The SVG wordmark + `MON AMI · RESTORAN` + `Trg kralja Tomislava 26, 10410 Velika Gorica`
2. Contact — both `tel:` links, `mailto:`, `Rezervacije telefonom i obrascem`
3. Hours, condensed to three lines, today's marked
4. `Facebook` · `MICHELIN Guide` · `Gault&Millau` · `Online naručivanje` · `Politika kolačića`, plus the HR|EN and theme toggles repeated

Bottom bar: the year **rendered from JS** (`new Date().getFullYear()`) with a static fallback in the markup so it can never freeze at 2020 again.

> **Motto**, centred above the bottom rule, `.display` at `--step-lead`: `Kao prijatelj prijatelju.`
> **EN:** `As a friend to a friend.`
> **Copyright:** `© 2026 Restoran Mon Ami. Sva prava pridržana.` / `© 2026 Restoran Mon Ami. All rights reserved.`

Footer copy is addresses and numbers only. No marketing sentence.

---

## 5. IMAGERY PLAN

### Pre-processing — mandatory, before any HTML is written

The 40 gallery originals are **500 KB – 1.5 MB unoptimised JPEGs with no WebP or AVIF anywhere**. Shipping them as-is destroys LCP regardless of how clean the code is. For each slot below, generate locally: **AVIF + WebP + JPEG at 640 / 1280 / 1920 px**, into `./img/`, with `width`/`height` on every `<img>` and a `srcset`/`sizes` pair. Reference relative paths. **Do not hotlink `monami.hr` in production** — it is an unoptimised origin and the certificate chain failed revocation checking during research (`CRYPT_E_NO_REVOCATION_CHECK`); test the chain and any missing intermediate during rebuild.

### Slot map

| Slot | Source URL | Notes |
|---|---|---|
| **Hero (LCP)** | `…/wp-content/gallery/monami/02.jpg` | Grilled squid, blitva, oil poured, near-black ground. The only `fetchpriority="high"` on the page. `object-position: center 45%`. |
| `#ulov` left | `…/gallery/05.jpg` | Whole bream, dentex, red mullet, langoustines on a white platter. |
| `#prica` left (portrait) | `…/gallery/30.jpg` | Chef holding a whole octopus, ~675×1200 — **the only vertical frame in the library**. |
| `#ljudi` chef | crop from `…/uploads/2024/08/bg3D3-08-24.jpg` | Chef in black jacket and toque against black. **Must be cropped**: the frame carries a QR code, an "I love VG" overlay, an OKUSI logo and dated 2024 Croatian text. Crop to the portrait only. |
| `#ljudi` Bruno | **none available** | → `--fallback-portrait`. Commission. |
| `#ljudi` team | `…/uploads/2020/02/onama2.jpg` | Waiter in white gloves serving, guests toasting. Warmest human frame in the library. |
| `#vlastito` panel 1 (oil) | `…/gallery/14.jpg` | Oil poured from a dark amphora, lobster and scorpionfish behind. Richest frame available. |
| `#vlastito` panel 2 (truffle) | **none exists** | → `--fallback-truffle`. **Commission — see §4.9.** |
| `#vlastito` panel 3 (wine) | `…/uploads/2020/02/onama1.jpg` | Sommelier before the wine wall. In the media library, **never used on the live site**. |
| `#prostor` wide | `…/gallery/01.jpg` | Empty dining room, pendant lamps, oak beams, grey leather chairs. |
| `#prostor` inset | `…/uploads/2019/11/0010.jpg` | Long communal table, hands, flutes, **no identifiable faces** — the right choice for an events band. |
| `#galerija` ×7 | `28, 25, 33, 37, 18, 03, 40` | All from the unpublished 21–40 range except 03 and 18. |
| Exterior / facade | **none exists anywhere** | No shot of the building, entrance, signage or terrace on their server or any source. → `--fallback-facade`. **Commission.** |
| OG card | pre-crop `gallery/21.jpg` to 1200×630 | Beef carpaccio cone on black — the strongest editorial frame. |

**Do not use** `sp.png` (115-byte spacer), `black.jpg` (a placeholder strip), any `restaumatic-production.imgix.net` URL, any `prod-pics.guide.michelin.com` or `d3h1lg3ksw6i6b.cloudfront.net` URL, any `assets.gaultmillau.com` URL, any `putnikofer.hr` or `eatoutzagreb.com` URL. These are third-party licensed; some are explicitly all-rights-reserved. Reference brief only.

### CSS-only fallbacks — the page never shows a broken image

Every image sits in a `<figure class="frame">` whose `background` already paints a designed surface. If the file is absent, blocked, or uncleared, the slot reads as a deliberate tonal panel.

```css
.frame { position: relative; overflow: hidden; border-radius: var(--r-1);
  box-shadow: inset 0 0 0 1px var(--rule); background: var(--fallback, var(--paper-3)); }
.frame img { display:block; width:100%; height:100%; object-fit:cover; }
.frame img[data-failed] { display: none; }
.frame::after { /* caption-only treatment when empty */
  content: attr(data-label); position:absolute; inset-block-end: var(--s-4);
  inset-inline-start: var(--s-4); font-size: var(--step-micro);
  letter-spacing: var(--track-micro); text-transform: uppercase; color: var(--stone); }
.frame:has(img:not([data-failed]))::after { content: none; }
```

```js
/* One delegated handler; no per-image inline onerror. */
document.querySelectorAll('.frame img').forEach(img => {
  img.addEventListener('error', () => img.dataset.failed = '', { once: true });
  if (img.complete && img.naturalWidth === 0) img.dataset.failed = '';
});
```

```css
/* PLATE — a dark plate on linen. Default for any food slot. */
--fallback-plate:
  radial-gradient(ellipse 70% 55% at 50% 48%,
    oklch(0.26 0.010 58) 0%, oklch(0.20 0.008 55) 62%, oklch(0.17 0.006 52) 100%),
  var(--paper-3);

/* LINEN — ruled paper. For interiors and rooms. */
--fallback-linen:
  repeating-linear-gradient(112deg,
    transparent 0 11px, color-mix(in oklch, var(--rule) 55%, transparent) 11px 12px),
  linear-gradient(168deg, var(--paper-2), var(--paper-3));

/* SEA — for #ulov if gallery/05 is unavailable. */
--fallback-sea:
  linear-gradient(to bottom,
    oklch(0.30 0.012 58) 0%, oklch(0.22 0.009 56) 46%, oklch(0.17 0.006 52) 100%);

/* GROVE — olive-gold wash for the oil panel. */
--fallback-grove:
  radial-gradient(circle at 26% 30%,
    color-mix(in oklch, var(--gold) 26%, transparent) 0%, transparent 58%),
  linear-gradient(150deg, var(--paper-2), var(--paper-3));

/* TRUFFLE — the designed placeholder. Typographic, with an explicit swap point. */
--fallback-truffle:
  radial-gradient(circle at 50% 46%,
    color-mix(in oklch, var(--gold) 20%, transparent) 0%, transparent 54%),
  linear-gradient(200deg, var(--paper-2), var(--paper-3));
/* .panel-tartuf.is-typeset::before sets the word TARTUF in .display at --step-masthead,
   color: var(--gold), opacity: .18, centred, aria-hidden, pointer-events:none.
   Remove .is-typeset the moment the commissioned frame arrives. */

/* PORTRAIT — a set initial on paper, for any missing face. */
--fallback-portrait: linear-gradient(190deg, var(--paper-2), var(--paper-3));
/* .frame.is-portrait::before { content: attr(data-initial); font-family: "Instrument Serif";
   font-size: clamp(5rem, 22cqi, 12rem); color: var(--rule-strong); opacity: .5; } */

/* FACADE — a drawn elevation, if an exterior slot is ever added. */
--fallback-facade:
  linear-gradient(to bottom, var(--paper-2) 0 62%, var(--paper-3) 62% 100%),
  repeating-linear-gradient(90deg, transparent 0 46px,
    color-mix(in oklch, var(--rule) 60%, transparent) 46px 47px);
```

**No tiled grain overlay.** Concept 2 proposed a 4%-opacity salt-grain SVG across the whole page; the art director called it correctly — *"texture-as-alibi. Warm paper does not need noise; if the colour is right, the grain is an admission that it is not."* `--paper` at `oklch(0.974 0.008 85)` is already unmistakably not `#FFF`. Skip it and save the bytes.

### Inline SVG mini-map — `#posjet`

Zero licensed raster, no API key, no third-party cookie, scales to any DPR. Concept 2's idea; the engineer judged it strictly better than a static tile (*"the only arrival visual that ships without a photographer or a mapping account"*).

- `viewBox="0 0 400 260"`, `role="img"`, `<title>` and `<desc>` in the active language.
- A `--paper-3` rounded-rect ground at `--r-1`.
- Two grey `--rule-strong` bands for Trg kralja Tomislava and the cross street, 10px wide.
- A green `--rule` rectangle for the park with the playground, in front of the restaurant.
- A `--claret` pin (circle + tapered triangle) at the restaurant, labelled `MON AMI` in Instrument Sans 600 at 11px.
- A hollow `--ink` square at the bus station labelled `AUTOBUSNI KOLODVOR`.
- A `--claret` dashed path between them (`stroke-dasharray: 4 4`), labelled `3 min hoda` / `3 min walk`.
- A north arrow and `45,71137° N · 16,07998° E` at 9px `tabular-nums`.
- All strokes `stroke="currentColor"` or a token, so it retints with the theme.
- The whole SVG is wrapped in `<a href="https://www.google.com/maps/search/?api=1&query=45.71137,16.07998" target="_blank" rel="noopener">`.
- **The geometry is schematic, not surveyed.** Label it as an orientation diagram, never as a scale map.

---

## 6. INTERACTION SPEC

### 6.1 Language toggle

One inline dictionary keyed by `data-i18n`, plus `data-i18n-attr` for `aria-label`, `placeholder`, `alt` and `title`. On switch: swap `textContent`, set `documentElement.lang`, flip `aria-pressed`, write `localStorage['ma-lang']`, and push `?lang=en` with `history.replaceState`. Menu dish rows carry both strings in the DOM already; the toggle swaps which line is `.is-primary` — no re-render, so the menu never reflows.

```js
if (document.startViewTransition && !mqReduce.matches) document.startViewTransition(swap);
else swap();
```
`view-transition-name` on the header and the hero H1 only — those two morph, everything else cross-fades over `--t-vt`. 91.75% support (Firefox 144+); where absent it degrades to an instant swap, which is the correct fallback.

> **This is not SEO.** A JS `textContent` swap gives visitors English and gives Google nothing — there is no second URL for `hreflang` to point at. Set `lang="hr"`, ship the `hreflang` reciprocals as §7 specifies, and flag the two-URL build as phase two. Do not pretend otherwise to the client.

### 6.2 Live open/closed status — the page's spine

**The single most valuable mechanism proposed anywhere** (owner's words). One object; four consumers; they cannot contradict each other.

```js
/* ══════════════════════════════════════════════════════════════════
   HOURS — EDIT NOTHING ELSE ABOUT TIME ANYWHERE IN THIS FILE.
   Drives: (1) the header status chip, (2) today's row in the hours
   table, (3) the reservation dialog's time <select>, and
   (4) the openingHoursSpecification in the JSON-LD.
   0 = Sunday … 6 = Saturday. null = closed all day.
   notice: leave "" unless the owner confirms a seasonal closure.
   ══════════════════════════════════════════════════════════════════ */
const HOURS = {
  tz: "Europe/Zagreb",
  week: [ null,            // 0 nedjelja — zatvoreno
          ["11:00","16:30"], // 1 ponedjeljak
          ["11:00","23:00"], // 2 utorak
          ["11:00","23:00"], // 3 srijeda
          ["11:00","23:00"], // 4 četvrtak
          ["11:00","23:00"], // 5 petak
          ["11:00","23:00"]  // 6 subota
  ],
  holidays: [],   // "YYYY-MM-DD" — closed. Fill from the Croatian calendar.
  notice: { hr: "", en: "" }   // e.g. "Godišnji odmor 1.–21. kolovoza" — DO NOT FILL until confirmed
};
```

**Timezone.** Read the visitor-independent Zagreb wall clock with `Intl.DateTimeFormat(…, { timeZone: HOURS.tz, weekday, hour, minute, hourCycle:'h23' }).formatToParts()`. Never `new Date().getHours()` — a guest in the departure lounge may be on any clock.

**Three states:**

| State | HR | EN |
|---|---|---|
| Open, >60 min left | `Otvoreno — danas do 23:00` | `Open — until 23:00 today` |
| Open, ≤60 min left | `Otvoreno — zatvaramo za 45 min` | `Open — closing in 45 min` |
| Closed, opens later today | `Zatvoreno — otvaramo danas u 11:00` | `Closed — we open today at 11:00` |
| Closed, opens tomorrow | `Zatvoreno — otvaramo sutra u 11:00` | `Closed — we open tomorrow at 11:00` |
| Closed, opens another day | `Zatvoreno — otvaramo u utorak u 11:00` | `Closed — we open Tuesday at 11:00` |

Croatian day forms after `u` take the accusative: `u ponedjeljak · u utorak · u srijedu · u četvrtak · u petak · u subotu · u nedjelju`. Hard-code the seven strings; do not derive them from `Intl` weekday names, which return the nominative.

**Chip markup.** A `<button>` (it scroll-links to `#posjet`), `--r-2`, 40px, `--paper-2` ground, 1px `--rule-strong` border, `aria-live="polite"`. An 8px dot: `--state-open` (green, 3.95:1 / 3.67:1 — verified against both grounds because this is safety-critical information and must not depend on theme state), `--state-soon` (claret), `--state-shut` (stone). **The chip's text is always `--ink`.** No amber. No red — red on a restaurant site reads as an error, not a schedule.

**First paint.** Render the chip from a tiny inline script in the markup so it is never a layout-shifting hydration artefact. Re-evaluate on a 60 s `setInterval` and on `visibilitychange`.

**Time `<select>`.** Generated from the same object: 30-minute slots from opening to 90 minutes before close, for the selected date's weekday. Sunday and any `holidays` entry disables the control and shows `Nedjeljom i blagdanom ne radimo.`

**JSON-LD.** Emitted from the same object at author time into a static `<script type="application/ld+json">`. Do not generate it at runtime — Google's renderer will see it either way, but a static block is cheaper and cannot break.

### 6.3 Mobile sticky action bar

Two actions, 48px each, `env(safe-area-inset-bottom)`, matching `body` padding, `scroll-padding-block-end: 5.5rem`. **It never hides.** It must remain visible whenever a form field in the viewport has focus (WCAG 2.4.11 — F110 is the failure, C43 the fix).

### 6.4 Header on scroll

An `IntersectionObserver` on a 1px sentinel at the top of the hero adds `.is-stuck`, which transitions in the `backdrop-filter` and the bottom hairline over 200 ms. A state change, not an animation loop. **No scroll event handler anywhere on the page.**

### 6.5 Menu filtering and the rail

Filtering is CSS-only (`:has()` on checked checkboxes) — zero handlers, zero re-render, zero INP, keyboard-accessible for free. INP is the most commonly failed Core Web Vital (~43% of sites); this section is where a naive build would fail it.

The rail's active chip is tracked by `IntersectionObserver` (`rootMargin: -140px 0px -70% 0px`) and centred with `scrollIntoView({ inline:'center', behavior:'smooth' })`. Chip taps rely on `scroll-margin-block-start` + native `scroll-behavior: smooth`, inside `prefers-reduced-motion: no-preference` only. **No JS scroll-jacking.** Prev/next buttons scroll the rail by one chip width.

### 6.6 Reveal animations — progressive enhancement only

**This is the easiest way to break the page.** Scroll-driven animations are **not Baseline**: raw `mdn/browser-compat-data` lists Firefox `version_added` as the literal string `"preview"` (Nightly only; flag `layout.css.scroll-driven-animations.enabled` in stable). ~82% global. **Any base rule containing `opacity: 0` permanently hides content for a fifth of visitors.**

```css
/* BASE — always visible, always finished. This is what Firefox gets. */
.reveal { opacity: 1; transform: none; }

@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .reveal {
      animation: rise linear both;
      animation-timeline: view();
      animation-range: entry 10% cover 34%;
      /* animation-duration is IGNORED on a view() timeline — range is the control. */
    }
    @keyframes rise { from { opacity: 0; transform: translateY(18px); } }
  }
}
```

Applied to: section kicker+heading pairs, the `#priznanja` columns, the three `#vlastito` panels, the `#galerija` tiles.

**Hairline draw.** Section rules animate `transform: scaleX(0) → 1`, `transform-origin: left`, on the same guarded timeline. Base state is `scaleX(1)`.

**Hero settle.** `object-position: center 45% → center 50%` across the hero's own `view()` range — a 5% shift, not parallax. Slow enough to read as a camera settling. Dies gracefully where `view()` is unsupported. Concept 3's 6% figure is right; 30% is 2014.

**Nav underline.** `@property --sweep { syntax: '<percentage>'; inherits: false; initial-value: 0%; }` driving a `linear-gradient` `background-size` over `--t-base`. Gradients cannot be transitioned directly; the registered property is what makes it possible.

**Dialog and lightbox entry.**
```css
dialog { opacity: 1; transform: none;
  transition: opacity var(--t-slow) var(--ease-out),
              transform var(--t-slow) var(--ease-out),
              display var(--t-slow) allow-discrete,
              overlay var(--t-slow) allow-discrete; }
@starting-style { dialog[open] { opacity: 0; transform: translateY(14px) scale(0.985); } }
dialog:not([open]) { opacity: 0; transform: translateY(14px) scale(0.985); }
```
`allow-discrete` on **`overlay` as well as `display`** is the half everyone forgets — without it the top-layer element vanishes instantly on exit instead of animating out. The `::backdrop` gets its own `@starting-style` opacity fade.

**Button press.** `transform` over `--t-fast`, `background-color` over 160 ms, `scale(0.97)` on `:active`. Hover tints computed as `color-mix(in oklch, var(--claret) 88%, white)` — mixing in oklch rather than sRGB is what stops hover states going muddy.

**Status dot pulse.** `box-shadow` spread from a 0-spread ring out to 8px transparent over 2 s, infinite. Animating spread on an 8px element is cheap and does not affect the pill's layout. **The only thing on the page that moves without user input.**

### 6.7 Reduced motion

Everything above lives inside `@media (prefers-reduced-motion: no-preference)`. With reduced motion requested: all transitions collapse to `0.01ms`, `view()` blocks are skipped, `startViewTransition` is not called, the dot does not pulse, and `scroll-behavior` stays `auto`. The page is fully functional and visually identical at rest.

### 6.8 Focus

```css
:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }
/* Inside a claret fill, the ring needs its own offset colour: */
.btn-primary:focus-visible { outline-color: var(--on-claret); outline-offset: 3px; }
```

---

## 7. TECHNICAL REQUIREMENTS

### 7.1 JSON-LD

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "Restoran Mon Ami",
  "url": "https://www.monami.hr/",
  "image": [
    "https://www.monami.hr/img/og-1200x630.jpg",
    "https://www.monami.hr/img/hero-1920.jpg"
  ],
  "telephone": "+38516213333",
  "email": "monamihr@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Trg kralja Tomislava 26",
    "addressLocality": "Velika Gorica",
    "postalCode": "10410",
    "addressRegion": "Zagrebačka županija",
    "addressCountry": "HR"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": 45.71137, "longitude": 16.07998 },
  "servesCuisine": ["Mediterranean", "Seafood", "Croatian"],
  "priceRange": "€€€",
  "currenciesAccepted": "EUR",
  "paymentAccepted": "Cash, Visa, Mastercard, Maestro, Diners Club",
  "acceptsReservations": "True",
  "menu": "https://www.monami.hr/#jelovnik",
  "hasMap": "https://www.google.com/maps/search/?api=1&query=45.71137,16.07998",
  "sameAs": ["https://www.facebook.com/monamihr/"],
  "foundingDate": "1997",
  "openingHoursSpecification": [
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Monday",
      "opens": "11:00:00", "closes": "16:30:00" },
    { "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Tuesday","Wednesday","Thursday","Friday","Saturday"],
      "opens": "11:00:00", "closes": "23:00:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Sunday",
      "opens": "00:00:00", "closes": "00:00:00" }
  ],
  "hasMenu": {
    "@type": "Menu", "name": "Jelovnik", "inLanguage": "hr",
    "hasMenuSection": [
      { "@type": "MenuSection", "name": "Hladna predjela", "hasMenuItem": [
        { "@type": "MenuItem", "name": "Carpaccio od tune s crnim tartufom",
          "offers": { "@type": "Offer", "price": "18.50", "priceCurrency": "EUR" } },
        { "@type": "MenuItem", "name": "Dimljene dagnje na rikoli",
          "offers": { "@type": "Offer", "price": "14.50", "priceCurrency": "EUR" } }
      ]},
      { "@type": "MenuSection", "name": "Topla predjela i rižota", "hasMenuItem": [
        { "@type": "MenuItem", "name": "Crni rižoto od sipe",
          "offers": { "@type": "Offer", "price": "14.80", "priceCurrency": "EUR" } }
      ]},
      { "@type": "MenuSection", "name": "Jela od mesa", "hasMenuItem": [
        { "@type": "MenuItem", "name": "Beefsteak u umaku od tartufa",
          "offers": { "@type": "Offer", "price": "42.00", "priceCurrency": "EUR" } }
      ]},
      { "@type": "MenuSection", "name": "Jela od riba", "hasMenuItem": [
        { "@type": "MenuItem", "name": "Škampi sa žara (8–12 kom/kg)",
          "description": "Cijena po kilogramu.",
          "offers": { "@type": "Offer", "price": "96.00", "priceCurrency": "EUR",
                      "eligibleQuantity": { "@type": "QuantitativeValue", "unitCode": "KGM", "value": 1 } } }
      ]},
      { "@type": "MenuSection", "name": "Slastice", "hasMenuItem": [
        { "@type": "MenuItem", "name": "Skradinska torta",
          "offers": { "@type": "Offer", "price": "4.00", "priceCurrency": "EUR" } }
      ]}
    ]
  }
}
</script>
```

Generate the full `hasMenuSection` tree from `MENU[]` at author time — the five sections above are the shape, not the whole. **Prices use a dot in JSON-LD (`"18.50"`) and a comma on the page (`18,50 €`).** Both are correct for their context.

**Deliberately NO `aggregateRating`.** Google: *"If the entity that's being reviewed controls the reviews about itself, their pages that use LocalBusiness or any other type of Organization structured data are ineligible for star review feature."* Restaurant inherits from LocalBusiness. Putting the 4,8 Google score in structured data makes the page **ineligible** for star results — the guide badges do the same job legitimately. Showing "#1 u Velikoj Gorici" as plain linked text would be fine; putting it in schema is not. The owner may push for stars; explain why they backfire.

Do **not** mirror MICHELIN's `acceptsReservations: "No"` — it is a data-entry artefact on their side. The restaurant takes bookings.

`geo` at five decimals is Google's stated minimum. These coordinates sit inside a ~40 m cluster across three sources (see §9).

### 7.2 Head

```html
<html lang="hr">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Restoran Mon Ami — jadranska riba u srcu Turopolja | Velika Gorica</title>
<meta name="description" content="Obiteljski restoran u Velikoj Gorici od 1997. Jadranska riba, turopoljski tartuf i vlastito maslinovo ulje iz Skradina. MICHELIN Guide 2026 · Selected. Jelovnik, radno vrijeme i rezervacije.">
<link rel="canonical" href="https://www.monami.hr/">
<link rel="alternate" hreflang="hr" href="https://www.monami.hr/">
<link rel="alternate" hreflang="en" href="https://www.monami.hr/?lang=en">
<link rel="alternate" hreflang="x-default" href="https://www.monami.hr/">

<meta property="og:type" content="restaurant">
<meta property="og:locale" content="hr_HR">
<meta property="og:locale:alternate" content="en_GB">
<meta property="og:site_name" content="Restoran Mon Ami">
<meta property="og:title" content="Restoran Mon Ami — jadranska riba u srcu Turopolja">
<meta property="og:description" content="Obiteljski restoran u Velikoj Gorici od 1997. MICHELIN Guide 2026 · Selected. Gault&Millau 13,5/20.">
<meta property="og:url" content="https://www.monami.hr/">
<meta property="og:image" content="https://www.monami.hr/img/og-1200x630.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Carpaccio od tune s rikolom i ružičastim paprom na crnom tanjuru.">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#F9F6F0" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#171310" media="(prefers-color-scheme: dark)">
<link rel="icon" href="/img/monami_icon.png" sizes="512x512">
```

The current site has **no meta description, no Open Graph tags and no structured data** — any link shared to Facebook, WhatsApp or Viber renders with no title card, no description and no image. The `hreflang` pair must be reciprocal or Google ignores both. URLs must be fully qualified. Pick **one** mechanism (head tags here); using head tags *and* headers *and* the sitemap has no benefit.

### 7.3 Accessibility checklist

- [ ] `<html lang="hr">`, updated to `en` on toggle.
- [ ] Every image has `alt`; decorative SVG has `aria-hidden="true"`; the mini-map has `role="img"` + `<title>` + `<desc>`.
- [ ] **1.4.3** — every text/ground pair from §2's table. Ratios are not rounded: 4.499:1 fails.
- [ ] **1.4.11** — `--rule-strong` (3.38 / 3.96) on every meaning-bearing divider; `--focus` (5.51 / 7.53) on every ring; the status dot (3.95 / 3.67).
- [ ] **2.4.11** — `scroll-padding-block-start: 7rem` **and** `scroll-padding-block-end: 5.5rem` on `:root` (technique C43). Test: Tab through the whole page at 390px with the action bar present.
- [ ] **2.5.7** — prev/next buttons on the category rail and the lightbox. No drag-only interaction anywhere.
- [ ] **2.5.8** — every target ≥24×24 CSS px; interactive buttons 44×44 in practice. Note rounded corners can disqualify a target — at `--r-0`/`--r-1` this is a non-issue, which is a second reason for the squared radii.
- [ ] Real `<table>` for hours with `<caption>` and `aria-current="date"`.
- [ ] `<dialog>` + `showModal()` for the reservation form and the lightbox — focus trapping and inertness come free; focus returns to the trigger on close.
- [ ] `popover` for the nav sheet, the theme picker and the per-kg note — light-dismiss, non-modal, correct for those.
- [ ] Diet/allergen chips carry **text**, never icon-only.
- [ ] `aria-live="polite"` on the status chip only. Nothing else is live.
- [ ] `prefers-reduced-motion` honoured throughout; `prefers-contrast: more` raises hairlines and thickens the ring to 3px.
- [ ] Test at **200% browser text zoom at 1440px** — every clamp carries a rem term, so nothing should stop scaling.
- [ ] Test in **Firefox stable with the scroll-driven-animations flag off**. All content must be visible and finished.

### 7.4 Performance checklist

Thresholds at CrUX p75, unchanged for 2026: **LCP ≤ 2.5 s · INP ≤ 200 ms · CLS ≤ 0.1.**

- [ ] Hero image: AVIF/WebP/JPEG `<picture>`, explicit `width`/`height`, `loading="eager"`, `fetchpriority="high"`, matching `<link rel="preload">`. **Never lazy-load the LCP image** — it always causes unnecessary resource load delay. Do not stash its URL in `data-src`; that hides it from the preload scanner entirely.
- [ ] `fetchpriority="high"` on **exactly one** image. More than one or two destroys the signal.
- [ ] Every other image `loading="lazy" decoding="async"`.
- [ ] `content-visibility: auto` + `contain-intrinsic-size` on `#brzo`, every menu category, `#ulov`, `#galerija`.
- [ ] All CSS inline in `<style>`; all JS inline in one `<script>` at the end of `<body>` (the theme boot and the chip's first paint are the only two exceptions, and both are tiny).
- [ ] **No jQuery, no jquery-migrate, no NextGEN, no preloader animation** — the current site ships all four.
- [ ] Two font families only. Preload one face. `display=swap`. Fontaine-generated `size-adjust` fallbacks to hold CLS near zero.
- [ ] Zero third-party requests on load. No Maps iframe, no analytics, no reservation widget. If a widget is ever added, inject it **only on dialog open**, to protect both INP and LCP.
- [ ] No scroll event handlers. `IntersectionObserver` for every scroll-derived state.
- [ ] Filtering is CSS-only — zero INP cost on the heaviest interaction on the page.
- [ ] Keep the DOM small; rendering cost scales non-linearly with DOM size.
- [ ] Avoid layout thrashing — never write a style then read a layout property in the same task.
- [ ] Lighthouse 100/100/100/100 is achievable here and worth showing the owner, but it is lab data. The number that determines Search treatment is CrUX p75 on mid-range Android.

### 7.5 Handover — the reason the last site died

The previous site died because an external contractor (`mpecko`) owned it and walked away. The deliverable must include a **one-page Croatian guide** covering exactly four operations: change a price, change a closing time, change a gallery caption, fill the seasonal-notice slot. Every editable value lives in one commented configuration block at the top of the file: `HOURS`, `MENU`, `GALLERY`, `I18N`, `MENU_UPDATED`. Agree with the client **who** updates it before launch.

Recommend moving from `monamihr@gmail.com` to `info@monami.hr`. A free Gmail address under a €42 beefsteak is the cheapest thing on the website. Show the real address until it is done.

---

## 8. WHAT NOT TO DO

Every item is a specific failure a judge named.

**Typography**
1. **No monospace face.** Geist Mono is not on Google Fonts — the specified single combined link cannot be constructed, and self-hosting means base64-inlining a woff2, which is the byte cost the concept claimed to be avoiding. And it *sounds* wrong: *"Geist Mono says startup. It does not say a family house on the main square since 1997."* Use `tabular-nums`.
2. **Never set the display serif below 20px and never for running copy.** Concept 3's serif-italic English dish names at 13–14px break exactly this rule. English dish names are Instrument Sans italic.
3. Do not set `--gold` on text in light mode. 2.10:1. That is what `--gold-text` exists for.
4. Do not hand-write `@font-face` with only the latin `unicode-range`. Š, ž, č, ć, đ all live in latin-ext.

**Colour and surface**
5. **No status-semantic amber and no red.** The art director: *"green and amber on a fine-dining page is the single most Wix-adjacent decision in all three concepts."* One green dot for open; claret for closing-soon; stone for closed.
6. **No 48px rounded cream island floating on black.** Squared corners, full-bleed edges, a sheet laid on the page.
7. **No 999px pill radii.** Concept 2's pills fought its own stated 2px stone radius — the art director caught the inconsistency. There is no pill radius here.
8. **Do not go to five hues.** Gold *and* deep blue *and* shallow blue *and* claret *and* olive is a Mediterranean-themed template no matter how well the tokens are named. One accent (claret) plus a paired gold.
9. **No tiled grain overlay.** Noise-as-alibi.
10. **More than one full-bleed dark band.** Concept 1's three ink bands became a metronome. `#ulov` is the only one. The awards band is ink-on-paper.
11. **No shadows** on cards, panels, images or buttons. Hairlines and ground steps do the work.

**Copy and claims**
12. **Never write "bez zvjezdice" or otherwise apologise for Selected.** *"No proprietor announces on his own front page what he has not won."* Write `MICHELIN Guide Hrvatska 2026 · Selected` and stop.
13. **No MICHELIN star device, no Bib Gourmand, no Green Star, no toque graphic, no TripAdvisor owl.** The guide's own dataLayer records `distinction=plate`, `greenstar=False`, `award_type=false`. Awards are letterspaced type.
14. **Assert no consecutive-year ordinal.** Sources report three, six and seven. `u vodiču od 2018.` is defensible; *"osmu godinu zaredom"* is not.
15. **Never attribute the olive oil, the wine or the truffle to MICHELIN.** MICHELIN mentions none of them. The boxed caveat in `#vlastito` exists precisely to make that separation visible on the page, not just in a brief.
16. **Never write "Tradicija duga 25 godina."** It is five years wrong. Compute it or write `Od 1997.`
17. **Never reuse "11:00 – 23:00 svaki dan osim nedjelje i blagdana."** The Monday line overrides it. The per-day table replaces it.
18. **Do not ship the platform's English.** `Prshutto`, `cackerels`, `french frie`, `homemaid`, `bouzzara`, and a truffle pasta labelled `Beefsteak salad` are currently on a MICHELIN-listed restaurant's menu. §4.4 replaces every one.
19. **Do not frame the family story as a conversion device.** Concept 3's own rationale placed it *"below the conversion layer where they close the sale rather than block it."* The owner: *"My father's kitchen is not a conversion blocker. Reading that sentence tells me exactly how this concept regards my restaurant."*

**Layout and interaction**
20. **No weight slider on the scampi.** *"That is a butcher's scale in a shop window, not a fish vitrine in a Michelin-recommended dining room."* Keep the pill, the popover and the sentence.
21. **Do not hide the mobile action bar on scroll.** Friction invented for elegance, and a 2.4.11 regression source.
22. **Do not ship "absence as composition" as a permanent feature.** The truffle panel is a marked placeholder with a commission attached.
23. **No swipe-only rail and no swipe-only lightbox.** 2.5.7 requires a single-pointer alternative.
24. **No Google Maps iframe.** LCP liability plus third-party cookies. And no static map *tile* either — that needs an API key or a licensed basemap nobody has. Inline SVG.
25. **Do not try to strip the logo PNG's background with a CSS mask.** `mask-image` keys off alpha; `logo-monami.png` has an opaque cream ground, so the mask paints a solid rectangle and `mask-mode: luminance` renders a ghost-negative. This fails on first contact. Redraw as inline SVG.
26. **Do not use `sp.png` as a logo.** 115 bytes, transparent, no artwork.
27. **Do not client-render the 62 menu rows.** It costs CLS and it undercuts the indexability claim the section exists to make. Inline static; keep `MENU[]` as the edit surface.
28. **Do not rely on one fixed hairline at `z-index: 0` to show through the page.** It will be occluded by the `#ulov` band and will interact badly with the `backdrop-filter` header, which creates its own stacking context. Each band gets its own rule segment.
29. **Do not put `opacity: 0` in any base rule.** Firefox users get permanently invisible content. The `@supports` guard is not optional — test in Firefox stable with the flag off.
30. **Do not put `aggregateRating` in the JSON-LD.** It makes the page ineligible for star results.
31. **Do not hotlink or copy** MICHELIN CDN, Gault&Millau, PutniKofer, Eat Out Zagreb or Luxury Living Croatia images. Third-party licensed; some explicitly all-rights-reserved.

---

## 9. UNVERIFIED — DO NOT PUBLISH AS FACT

Mark every item below as a placeholder in code comments. Each needs a phone call to Bruno Ceronja before it goes live.

**Must be confirmed before launch — the page states them:**

| Item | Status | Action |
|---|---|---|
| **Photography rights** | **BLOCKING.** All 40 gallery images and the O-nama files are credited to Josip Škof, Mario Žilec and Jakob Goldstein *"on behalf of Mon Ami."* Reachable on the restaurant's own server ≠ cleared for a rebuild. | Written clearance from all three, via Bruno, before launch. If it fails, every slot degrades to its §5 CSS fallback — which is why the fallbacks exist. |
| **All 62 prices** | From the live Restaumatic system as of 27 Sept 2026. Drift is documented and hard: carpaccio €16→€18,50, mussels €12→€14,50, squid €53→€62/kg, scampi €80→€96/kg in roughly two years. Six dishes flagged *privremeno nedostupan*. | Re-verify the whole list the week of launch. Set `MENU_UPDATED` to that date. |
| **The 1997 founding year** | Well attested — the restaurant's own copy, MICHELIN, PutniKofer, Tjedan restorana. **But** a May 2020 *Kronike Velike Gorice* piece says the family restaurant opened in **1994**. | Confirm. If unresolved, the page reads `OD 1997.` and no computed duration is set anywhere. |
| **Chef's name form** | The restaurant's site says **Goran Marko Beus**; Gault&Millau says **Marko Beus**. | Settle with him personally before it is set in display type. |
| **Chef's tenure** | 15 years (2023 source), 16 (2025 PutniKofer), 17 (2025 MICHELIN). The brief writes "sedamnaest godina" and "od 2008." | Confirm one figure; these two must agree. |
| **Coordinates 45.71137 / 16.07998** | Three sources cluster within ~40 m: RestaurantGuru 45.7113686/16.0799713, Gault&Millau 45.7113901/16.0799934, MICHELIN 45.7112127/16.0801126. | Drop a pin with the owner and lock the exact value. |
| **"Riba stiže tri puta tjedno"** | Sourced to Bruno Ceronja via PutniKofer, not to the restaurant's own published copy. | Confirm the page may state it. |
| **Olive oil result: 10th place, 96,42 boda, gold, Dani mladih maslinovih ulja, Vodice** | Single-source. Other gold medals are asserted in the plural with no body or year named. | Get the certificate or drop the numeric detail and write only `nagrađivano zlatnim medaljama`. |
| **"Gotovo trideset godina" / any duration** | Depends entirely on the 1994-vs-1997 question. | Do not compute a number until the year is settled. |
| **Gluten-free tags on side dishes and salads** | Inferred from composition, **not** a kitchen statement. The kitchen's own dedicated GF section contains only two dishes. | Have the chef confirm each `diet:"gf"` tag, or strip them from everything outside the `Bez glutena` section. |
| **"Uobičajena porcija je oko 0,3 do 0,4 kg"** in the per-kg popover | A reasonable serving convention, **not** a Mon Ami statement. | Confirm with the kitchen or delete the line; the rest of the popover stands without it. |

**Must stay OFF the page until confirmed:**

| Item | Why |
|---|---|
| **The 1–21 August annual closure** | Single source (Gastronaut.hr), absent from the restaurant's own site and every other source. `HOURS.notice` is built as an empty slot for exactly this. **Filling it wrongly silently tells guests the restaurant is shut for three weeks.** |
| **Any star rating or review count** | Google 4,8/1445 vs 1355 (two irreconcilable snapshots, and no numeric average on the Croatian mirror); TripAdvisor 4,7/99–100 (fetched 403 — search-snapshot only); Facebook 4,9/69 (second-hand). None first-hand. And none may go in the JSON-LD regardless. |
| **Instagram handle** | `@monami.hr` and `@restoranmonami` both appear across sources; the account is behind a login wall. **Ship Facebook only** until confirmed, then add Instagram to `sameAs` and the footer. |
| **Parking specifics** | okusi.hr lists unlabelled numbers `5` and `15` with no explanation. The amenity chip says only `Parking` — do not add a count, a price, or "free". |
| **Wine list contents and any wine price** | Not published anywhere: not on the site, not in the ordering system, not in any guide. Only three labels are documented and **none with a price**. Do not invent a list. The two orphaned scanned menu PDFs (`jelovnik-11.05.2024.b.pdf`, `jelovnik-12.12.2023.B.pdf`) are the highest-value unexplored lead — OCR them first. |
| **The salmon-with-teriyaki dish as a hero** | MICHELIN's inspector singles it out and it is on the ordering menu at €23,00, but the restaurant's own About copy never mentions it. It stays a normal row in `Preporuka kuće`. If a hero dish is ever needed, lead with **crni rižoto od sipe**, which every single source agrees on. |
| **Wedding capacity beyond 70 seats** | The restaurant advertises weddings; no source states a maximum party size or confirms buyouts. The page states 70 + 10 and asks larger groups to call. Do not imply more. |
| **Whether online ordering and delivery are still live** | The Restaumatic page exists; its live status, delivery zone, minimum order and fee all render client-side and were never confirmed. The footer links it as `Online naručivanje` with no claim attached. |
| **Owner's mother's first name** | Barica in most sources, Barbara in the Eat Out Zagreb review. The page writes **Barica**. Confirm. |
| **Wine list size** | The restaurant's own site, Visit Zagreb County and okusi.hr say **60**; Gastronaut says 65. The page writes 60 — the restaurant's own published figure. |
| **Seating: 70 vs MICHELIN's ~60+20** | The page uses the restaurant's own numbers (70 + separe for 10 + ~20 terrace). MICHELIN's figures appear only if their article is quoted. |
| **Croatian legal footer requirements** | OIB, court of registration, share capital and the EU FIC 1169/2011 allergen-disclosure obligation were never researched. **Get a legal check before launch** and add whatever the footer is required to carry. |
| **Cookie consent** | `/cookie-policy-eu/` exists but is unlinked and no consent mechanism loads. Dropping the Maps iframe removes the third-party cookie problem entirely — so the page as specified sets none, and the consent question is nearly moot. If analytics or a reservation widget are ever added, a consent layer becomes mandatory. |

**Structural limitation to state plainly to the client, not to work around:** the HR/EN toggle in a single file cannot produce two indexable URLs. English content will not rank independently in v1. `lang="hr"` is set, `lang` updates on toggle, and reciprocal `hreflang` tags ship — but the two-URL build is phase two, and it matters if airport traffic and English-language MICHELIN readers are a real audience.