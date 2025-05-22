const { logEvent } = require('./utils/logger');
const { saveTokenArchive } = require('./archiveWriter');
const scrapePumpFunTokens = require('./utils/tokenScanner');
const runJupiterChecker = require('./utils/puppeteerCheck');
const runTracker = require('./utils/tracker');
const runPerformanceEvaluator = require('./utils/performanceEvaluator');
const runEntryEvaluator = require('./utils/entryEvaluator');
const screenshotPumpFun = require('./screenshotPumpFun');

async function runSniperPipeline() {
  console.log(`🔄 [SNIPER] Running full pipeline: ${new Date().toLocaleTimeString()}`);
  logEvent('SNIPER', 'Running full pipeline');

  try {
    const newTokens = await scrapePumpFunTokens();
    if (newTokens.length > 0) {
      const screenshotPath = await screenshotPumpFun();
      console.log(`📦 Screenshot Function Ran`);

      console.log(`📦 Found ${newTokens.length} new tokens → checking Jupiter...`);
      logEvent('SCRAPER', `Scraped ${newTokens.length} token(s)`);
      await runJupiterChecker();
      logEvent('JUPITER', 'Checker complete');
    } else {
      console.log('🔍 No new tokens found, skipping Jupiter check.');
    }

    await runTracker();
    logEvent('TRACKER', 'Price tracking complete');

    await runPerformanceEvaluator();
    logEvent('EVALUATOR', 'Performance check complete');

    runEntryEvaluator(); // not async, safe to run at the end
    logEvent('ENTRY', 'Entry evaluation complete');

    console.log('✅ [SNIPER] Pipeline complete\n');
    logEvent('SNIPER', '✅ Full pipeline complete');
  } catch (err) {
    console.error('❌ [SNIPER] Pipeline error:', err.message);
    logEvent('ERROR', `❌ Pipeline failed: ${err.message}`);
  }
}

module.exports = runSniperPipeline;
