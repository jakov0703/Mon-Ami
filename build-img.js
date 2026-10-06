const sharp = require('sharp');
const fs = require('fs');
fs.mkdirSync('img', { recursive: true });

// slot -> {src, crop?, ratio, widths, pos}
// ratio: target aspect (w/h). Images are cover-cropped to it.
const SLOTS = [
  // hero: grilled squid, oil pour. Wide on desktop, 4:5 on mobile -> ship two crops.
  { out:'hero',        src:'g02.jpg', ratio:16/9,  widths:[900,1400,1920], pos:'center' },
  { out:'hero-p',      src:'g02.jpg', ratio:4/5,   widths:[600,900],       pos:'attention' },
  { out:'ulov',        src:'g05.jpg', ratio:4/5,   widths:[600,900,1200],  pos:'center' },
  { out:'chef',        src:'g30.jpg', ratio:3/4,   widths:[500,750,1000],  pos:'north' },
  { out:'team',        src:'onama2.jpg', ratio:21/9, widths:[900,1400,1920], pos:'center' },
  { out:'ulje',        src:'g03.jpg', ratio:3/2,   widths:[600,900,1200],  pos:'center' },
  { out:'vino',        src:'onama1.jpg', ratio:21/9, widths:[900,1400,1920], pos:'center' },
  { out:'prostor',     src:'g01.jpg', ratio:21/9,  widths:[900,1400,1920], pos:'center' },
  { out:'prigode',     src:'p0010.jpg', ratio:3/2, widths:[600,900,1200],  pos:'center' },
  // gallery
  { out:'gal-grill',   src:'g28.jpg', ratio:3/2,   widths:[600,900,1200],  pos:'center' },
  { out:'gal-hobotnica',src:'g25.jpg',ratio:4/5,   widths:[500,750,1000],  pos:'attention' },
  { out:'gal-skrpina', src:'g33.jpg', ratio:21/9,  widths:[900,1400,1920], pos:'center' },
  { out:'gal-jastog',  src:'g37.jpg', ratio:1,     widths:[500,750,1000],  pos:'center' },
  { out:'gal-teletina',src:'g18.jpg', ratio:1,     widths:[500,750,1000],  pos:'center' },
  { out:'gal-ulje',    src:'g03.jpg', ratio:1,     widths:[500,750,1000],  pos:'attention' },
  { out:'gal-torta',   src:'g40.jpg', ratio:4/5,   widths:[500,750,1000],  pos:'center' },
  { out:'gal-lignje',  src:'g12.jpg', ratio:3/2,   widths:[600,900,1200],  pos:'center' },
  // social card
  { out:'og',          src:'g21.jpg', ratio:1200/630, widths:[1200],       pos:'center' },
];

const POS = { center:'center', attention:sharp.strategy.attention, north:'north' };

(async () => {
  let total = 0;
  for (const s of SLOTS) {
    const meta = await sharp('raw/' + s.src).metadata();
    for (const w of s.widths) {
      const h = Math.round(w / s.ratio);
      const base = sharp('raw/' + s.src).resize(w, h, {
        fit: 'cover',
        position: POS[s.pos] || 'center',
        withoutEnlargement: false,
      });
      const stem = `img/${s.out}-${w}`;
      await base.clone().avif({ quality: 58, effort: 6 }).toFile(stem + '.avif');
      await base.clone().webp({ quality: 76 }).toFile(stem + '.webp');
      await base.clone().jpeg({ quality: 80, mozjpeg: true, progressive: true }).toFile(stem + '.jpg');
      for (const ext of ['avif','webp','jpg']) total += fs.statSync(stem + '.' + ext).size;
    }
    console.log(`${s.out.padEnd(16)} ${s.src.padEnd(12)} ${meta.width}x${meta.height} -> ${s.widths.join(',')} @ ${s.ratio.toFixed(2)}`);
  }
  console.log('\nTOTAL img/ =', (total/1048576).toFixed(2), 'MB across', fs.readdirSync('img').length, 'files');
})();
