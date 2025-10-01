// server/src/utils/fetchSheetServer.js
const fetch = require('node-fetch');

async function fetchAndNormalize(url) {
  if (!url) throw new Error('No URL provided to fetchAndNormalize');
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sheet fetch failed ${res.status}`);
  const json = await res.json();
  const rows = Array.isArray(json.rows) ? json.rows : [];

  const normalized = rows.map(r => {
    const out = {};
    Object.keys(r).forEach(k => {
      const key = String(k || '').trim().toLowerCase();
      const val = r[k];
      out[key] = typeof val === 'string' ? val.trim() : val;
    });
    return out;
  });

  return normalized;
}

module.exports = { fetchAndNormalize };
// server/src/utils/fetchSheetServer.js
module.exports = async function fetchSheetServer(/* sheetId */) {
  return []; // temporary sample data
};
