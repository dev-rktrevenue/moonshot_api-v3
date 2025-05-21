const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const DATA_DIR = path.join(__dirname, '../data/tokens');

function getLast14Days() {
  return fs.readdirSync(DATA_DIR)
    .filter(name => /^\d{4}-\d{2}-\d{2}$/.test(name))
    .sort((a, b) => b.localeCompare(a)) // Descending
    .slice(0, 14);
}

function loadTokens(date) {
  const folder = path.join(DATA_DIR, date);
  if (!fs.existsSync(folder)) return [];

  return fs.readdirSync(folder)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      try {
        return JSON.parse(fs.readFileSync(path.join(folder, f), 'utf-8'));
      } catch (e) {
        console.warn(`⚠️ Could not read ${f}`);
        return null;
      }
    })
    .filter(Boolean);
}

function tokensToCSV(tokens) {
  const headers = ['name', 'mint', 'createdAt', 'latestPrice', 'checkCount'];
  const rows = tokens.map(t => {
    const latest = t.checkHistory?.[t.checkHistory.length - 1] || {};
    return [
      `"${t.name}"`,
      t.mint,
      t.createdAt,
      latest.price ?? '',
      t.checkHistory?.length ?? 0
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

router.get('/export', (req, res) => {
  const availableDates = getLast14Days();
  const selectedDate = req.query.date || availableDates[0];
  const tokens = loadTokens(selectedDate);
  const jsonData = JSON.stringify(tokens, null, 2);
  const csvData = tokensToCSV(tokens);

  res.render('export', {
    dates: availableDates,
    selectedDate,
    tokens,
    jsonData,
    csvData
  });
});

module.exports = router;