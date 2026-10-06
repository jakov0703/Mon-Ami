# Mon Ami redesign — paused 28 Sep 2026, resume notes

## Where we stopped
Research, design direction and all image assets are **done**.
The single `index.html` has **not been written yet** — that is the next step.

## What exists in this folder

| Path | What it is |
|---|---|
| `BRIEF.md` | **The build spec. ~1,230 lines. Read this first.** Section-by-section layout, every line of Croatian + English copy, design tokens, interaction spec, JSON-LD, accessibility + performance checklists. |
| `img/` | 153 optimized files, 9.24 MB. AVIF + WebP + JPEG at 2–3 widths for 18 slots. Ready to reference. |
| `raw/` | The 20 original downloads from monami.hr (keep — source of truth if a crop needs redoing). |
| `research/` | 15 JSON files, raw output of the research agents. `03-*` = the 72-dish priced menu. `07-*` = the photo audit. |
| `build-img.js` | The image pipeline. Re-run `node build-img.js` if any crop needs changing. |
| `dl.sh` | Re-downloads the originals (needs `curl -k`). |

## Key verified facts (do not re-research)
- **MICHELIN Guide Hrvatska 2026 · Selected** (the Plate — *not* a star, not Bib Gourmand). Listed since 2018. Review dated 25 Jun 2026.
- **Gault&Millau 2026: 13,5/20, two toques.** Chef's Restaurant. Sommelier Zlatko Šimac.
- Founded **1997** by Božo Ceronja (Skradin) + Barica (Turopolje). Son **Bruno Ceronja** runs it now.
- Chef **Goran Marko Beus**, from Split, ~17 years leading the kitchen.
- Hours: **Mon 11:00–16:30 · Tue–Sat 11:00–23:00 · Sun + holidays closed.**
- Trg kralja Tomislava 26, 10410 Velika Gorica · 01 6213 333 · 091 5444 715 · monamihr@gmail.com
- 70 seats + separe for 10 + covered heated terrace (~20).
- Motto: **„Kao prijatelj prijatelju."**
- Full 62-row menu with real EUR prices is in `BRIEF.md` §4.4 as a ready-to-use `MENU[]` array.

## Next step when we resume
Write `index.html` — one self-contained file, following `BRIEF.md`. Then open it in a browser and screenshot to check it actually looks good.

## Two things to ask Bruno before this ever goes live
(Full list in `BRIEF.md` §9 — "UNVERIFIED".)
1. **Photo rights** — the 40 images are credited to Josip Škof, Mario Žilec, Jakob Goldstein "on behalf of Mon Ami". Being on their server is not the same as cleared for a rebuild. **Blocking.**
2. **Re-check the 62 prices** the week of launch — they drifted hard in ~2 years (carpaccio €16→€18,50, scampi €80→€96/kg).

## Known gap
No exterior/facade photo exists anywhere, and no clean truffle shot. `BRIEF.md` §5 specifies CSS-only fallbacks so nothing breaks, but one morning with a photographer would fix both.
