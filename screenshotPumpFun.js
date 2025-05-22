const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function screenshotPumpFun() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const screenshotDir = path.join(__dirname, '../data/screenshots');
  const filePath = path.join(screenshotDir, `pumpfun-${timestamp}.png`);

  // Ensure the directory exists
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1024 });

    await page.goto('https://pump.fun', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    await page.screenshot({ path: filePath });
    console.log(`✅ Screenshot saved: ${filePath}`);

    await browser.close();
    return filePath;
  } catch (err) {
    console.error('❌ Screenshot failed:', err.message);
    return null;
  }
}

module.exports = screenshotPumpFun;
