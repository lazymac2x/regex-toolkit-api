const express = require('express');
const cors = require('cors');
const {
  PATTERNS,
  testRegex,
  replaceRegex,
  splitRegex,
  validateRegex,
  escapeRegex,
  benchmarkRegex,
  explainRegex
} = require('./regex');

const app = express();
const PORT = process.env.PORT || 4200;

app.use(cors());
app.use(express.json());

// ─── Health ─────────────────────────────────────────────────────────────────

app.get('/', (_req, res) => {
  res.json({
    name: 'regex-toolkit-api',
    version: '1.0.0',
    description: 'Regex testing, explanation, and generation REST API',
    endpoints: [
      'POST /api/v1/test',
      'POST /api/v1/replace',
      'POST /api/v1/split',
      'POST /api/v1/validate',
      'GET  /api/v1/patterns',
      'GET  /api/v1/patterns/:name',
      'POST /api/v1/explain',
      'POST /api/v1/escape',
      'POST /api/v1/benchmark'
    ]
  });
});

// ─── Helpers ────────────────────────────────────────────────────────────────

function requireBody(req, res, ...fields) {
  for (const f of fields) {
    if (req.body[f] === undefined) {
      res.status(400).json({ error: `Missing required field: ${f}` });
      return false;
    }
  }
  return true;
}

// ─── POST /api/v1/test ──────────────────────────────────────────────────────

app.post('/api/v1/test', (req, res) => {
  if (!requireBody(req, res, 'pattern', 'text')) return;
  const { pattern, text, flags } = req.body;
  try {
    res.json(testRegex(pattern, text, flags));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ─── POST /api/v1/replace ───────────────────────────────────────────────────

app.post('/api/v1/replace', (req, res) => {
  if (!requireBody(req, res, 'pattern', 'text', 'replacement')) return;
  const { pattern, text, replacement, flags } = req.body;
  try {
    res.json(replaceRegex(pattern, text, replacement, flags));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ─── POST /api/v1/split ────────────────────────────────────────────────────

app.post('/api/v1/split', (req, res) => {
  if (!requireBody(req, res, 'pattern', 'text')) return;
  const { pattern, text, flags, limit } = req.body;
  try {
    res.json(splitRegex(pattern, text, flags, limit));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ─── POST /api/v1/validate ──────────────────────────────────────────────────

app.post('/api/v1/validate', (req, res) => {
  if (!requireBody(req, res, 'pattern')) return;
  const { pattern, flags } = req.body;
  res.json(validateRegex(pattern, flags));
});

// ─── GET /api/v1/patterns ───────────────────────────────────────────────────

app.get('/api/v1/patterns', (_req, res) => {
  const list = Object.values(PATTERNS).map(({ name, description, examples }) => ({
    name, description, examples
  }));
  res.json({ count: list.length, patterns: list });
});

// ─── GET /api/v1/patterns/:name ─────────────────────────────────────────────

app.get('/api/v1/patterns/:name', (req, res) => {
  const p = PATTERNS[req.params.name];
  if (!p) {
    return res.status(404).json({
      error: `Pattern "${req.params.name}" not found`,
      available: Object.keys(PATTERNS)
    });
  }
  res.json(p);
});

// ─── POST /api/v1/explain ───────────────────────────────────────────────────

app.post('/api/v1/explain', (req, res) => {
  if (!requireBody(req, res, 'pattern')) return;
  const { pattern, flags } = req.body;
  try {
    res.json(explainRegex(pattern, flags));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ─── POST /api/v1/escape ───────────────────────────────────────────────────

app.post('/api/v1/escape', (req, res) => {
  if (!requireBody(req, res, 'text')) return;
  res.json(escapeRegex(req.body.text));
});

// ─── POST /api/v1/benchmark ────────────────────────────────────────────────

app.post('/api/v1/benchmark', (req, res) => {
  if (!requireBody(req, res, 'pattern', 'text')) return;
  const { pattern, text, flags, iterations } = req.body;
  try {
    res.json(benchmarkRegex(pattern, text, flags, iterations));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ─── Start ──────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`regex-toolkit-api running on http://localhost:${PORT}`);
});

module.exports = app;
