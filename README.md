# Mon Ami redesign demo

This is a static, bilingual redesign preview for Restoran Mon Ami.

## Deploy the demo on Netlify

Import this GitHub repository in Netlify. Netlify reads `netlify.toml` and
runs `npm run build`; no manual build or publish settings are needed. The
build publishes only `dist/` (the page and its image assets), keeping source
research, screenshots, and working files out of the deployed site.

The deployed preview sends `X-Robots-Tag: noindex, nofollow, noarchive` so it
stays out of search results while it is being reviewed.

## Local build

Run `npm install`, then `npm run build`. The generated site is in `dist/`.
`npm run check:a11y` and `npm run check:contrast` run the browser checks; they
need the Playwright Chromium browser (`npx playwright install chromium`).

The reservation form currently prepares an email in the visitor's mail app.
That is intentional for this demo. Before an official launch, confirm photo
rights, menu prices, and the business details listed in [UPUTE.md](UPUTE.md).
