/* Prepare the Netlify publish directory with only the finished site and its assets. */
const fs = require('fs');
const path = require('path');

const root = __dirname;
const dist = path.join(root, 'dist');
if (dist !== path.resolve(root, 'dist')) {
  throw new Error('Refusing to write outside the project dist directory.');
}

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
fs.copyFileSync(path.join(root, 'index.html'), path.join(dist, 'index.html'));
fs.cpSync(path.join(root, 'img'), path.join(dist, 'img'), { recursive: true });
fs.writeFileSync(path.join(dist, '_headers'), '/*\n  X-Robots-Tag: noindex, nofollow, noarchive\n');

console.log('Prepared dist/ with index.html, img/, and demo no-index headers.');
