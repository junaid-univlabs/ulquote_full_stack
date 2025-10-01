const express = require('express');
const router = express.Router();
//const { fetchAndNormalize } = require('.fetchSheetServer./utils/fetchSheetServer');
const fetchSheetServer = require('../utils/fetchSheetServer');
const { fetchAndNormalize } = fetchSheetServer;
const SHEET_URL = process.env.GSX2JSON_URL;
const TTL = Number(process.env.CACHE_TTL_SECONDS || 300);

let cache = { ts: 0, products: [] };

router.get('/', async (req, res) => {
  try {
    console.log('[products] request received');
    // quick sanity checks
    if (!SHEET_URL) {
      console.error('[products] GSX2JSON_URL not configured');
      return res.status(500).json({ error: 'SHEET URL not configured on server' });
    }

    const now = Date.now();
    if (cache.products.length && now - cache.ts < TTL * 1000) {
      console.log('[products] returning cached results');
      return res.json({ products: cache.products, categories: [...new Set(cache.products.map(p => (p.category || '').trim()))].filter(Boolean), cached: true });
    }

    console.log('[products] fetching sheet from', SHEET_URL);
    const products = await fetchAndNormalize(SHEET_URL);

    if (!Array.isArray(products)) {
      console.error('[products] fetchAndNormalize did not return an array:', products);
      return res.status(500).json({ error: 'Invalid products format from sheet' });
    }

    cache = { ts: now, products };
    const categories = [...new Set(products.map(p => (p.category || '').trim()))].filter(Boolean);
    console.log(`[products] loaded ${products.length} rows, ${categories.length} categories`);
    return res.json({ products, categories, cached: false });
  } catch (err) {
    console.error('[products] error', err && err.stack ? err.stack : err);
    return res.status(500).json({ error: 'Failed to fetch products', details: err && err.message });
  }
});

module.exports = router;
