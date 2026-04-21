/**
 * Renders public/og/home.png (1200×628) for Open Graph / LinkedIn previews.
 * Run: node scripts/generate-og-home.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, '../public/og/home.png');
const outDir = path.dirname(outPath);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px;
    height: 628px;
    background: #000000;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 72px 96px;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .name {
    font-size: 104px;
    font-weight: 300;
    color: #ffffff;
    letter-spacing: -0.02em;
    line-height: 1.06;
    margin-bottom: 26px;
  }
  .name em {
    font-style: italic;
    font-weight: 300;
    color: #ffffff;
  }
  .title {
    font-size: 18px;
    font-weight: 500;
    letter-spacing: 0.06em;
    color: #ffffff;
    max-width: 28em;
    line-height: 1.5;
  }
</style>
</head>
<body>
  <h1 class="name">Benn <em>Pattara</em></h1>
  <p class="title">Product Design &amp; Brand Strategy</p>
</body>
</html>`;

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 628, deviceScaleFactor: 2 });
await page.setContent(html, { waitUntil: 'networkidle0' });
await page.screenshot({
  path: outPath,
  type: 'png',
  clip: { x: 0, y: 0, width: 1200, height: 628 },
});
await browser.close();

console.log('Wrote', outPath);
