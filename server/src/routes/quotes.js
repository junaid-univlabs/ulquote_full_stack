// server/src/routes/quotes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';

// in-memory quotes store (replace with DB later)
const quotes = [];

// simple auth middleware
function auth(req, res, next) {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ error: 'Missing auth' });
  const token = h.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

router.post('/', auth, (req, res) => {
  const { items = [], meta = {} } = req.body;
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'No items' });

  const q = {
    id: Math.random().toString(36).slice(2,9),
    userId: req.user.sub,
    items,
    meta,
    createdAt: new Date().toISOString()
  };
  quotes.push(q);
  res.json({ ok: true, quote: q });
});

router.get('/', auth, (req, res) => {
  const userQuotes = quotes.filter(q => q.userId === req.user.sub);
  res.json({ quotes: userQuotes });
});

module.exports = router;
