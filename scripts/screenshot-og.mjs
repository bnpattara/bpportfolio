import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ogDir = path.join(__dirname, "../public/og");

const files = ["nike", "saks", "carolyn", "on", "diesel", "stylect"];

const browser = await puppeteer.launch({ headless: true });

for (const name of files) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });

  const filePath = `file://${ogDir}/${name}.html`;
  await page.goto(filePath, { waitUntil: "networkidle0" });

  // Wait for Google Fonts to load
  await page.waitForFunction(() => document.fonts.ready);

  const outputPath = path.join(ogDir, `${name}.jpg`);
  await page.screenshot({
    path: outputPath,
    type: "jpeg",
    quality: 95,
    clip: { x: 0, y: 0, width: 1200, height: 630 },
  });

  console.log(`✓ ${name}.jpg`);
  await page.close();
}

await browser.close();
console.log("Done.");
