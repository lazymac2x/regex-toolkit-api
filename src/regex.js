// ─── Common Regex Patterns Library ───────────────────────────────────────────

const PATTERNS = {
  email: {
    name: 'email',
    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    flags: 'i',
    description: 'Matches standard email addresses',
    examples: ['user@example.com', 'first.last@company.co.uk']
  },
  url: {
    name: 'url',
    pattern: 'https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)',
    flags: 'gi',
    description: 'Matches HTTP and HTTPS URLs',
    examples: ['https://example.com', 'http://www.test.org/path?q=1']
  },
  phone: {
    name: 'phone',
    pattern: '(?:\\+?1[-.\\s]?)?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}',
    flags: 'g',
    description: 'Matches US/international phone numbers',
    examples: ['+1 (555) 123-4567', '555-123-4567']
  },
  ipv4: {
    name: 'ipv4',
    pattern: '(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)',
    flags: 'g',
    description: 'Matches IPv4 addresses (0.0.0.0 – 255.255.255.255)',
    examples: ['192.168.1.1', '10.0.0.255']
  },
  ipv6: {
    name: 'ipv6',
    pattern: '(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}',
    flags: 'gi',
    description: 'Matches full IPv6 addresses',
    examples: ['2001:0db8:85a3:0000:0000:8a2e:0370:7334']
  },
  date_iso: {
    name: 'date_iso',
    pattern: '\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])',
    flags: 'g',
    description: 'Matches ISO 8601 dates (YYYY-MM-DD)',
    examples: ['2026-03-21', '2000-12-31']
  },
  date_us: {
    name: 'date_us',
    pattern: '(?:0[1-9]|1[0-2])\\/(?:0[1-9]|[12]\\d|3[01])\\/\\d{4}',
    flags: 'g',
    description: 'Matches US-format dates (MM/DD/YYYY)',
    examples: ['03/21/2026', '12/31/2000']
  },
  credit_card: {
    name: 'credit_card',
    pattern: '(?:4\\d{3}|5[1-5]\\d{2}|6011|3[47]\\d{2})[- ]?\\d{4}[- ]?\\d{4}[- ]?\\d{1,4}',
    flags: 'g',
    description: 'Matches Visa, MasterCard, Discover, and Amex card numbers',
    examples: ['4111-1111-1111-1111', '5500 0000 0000 0004']
  },
  hex_color: {
    name: 'hex_color',
    pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\b',
    flags: 'gi',
    description: 'Matches hex color codes (#RGB or #RRGGBB)',
    examples: ['#fff', '#1a2b3c']
  },
  uuid: {
    name: 'uuid',
    pattern: '[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}',
    flags: 'gi',
    description: 'Matches UUID v1–v5',
    examples: ['550e8400-e29b-41d4-a716-446655440000']
  },
  mac_address: {
    name: 'mac_address',
    pattern: '(?:[0-9a-fA-F]{2}[:-]){5}[0-9a-fA-F]{2}',
    flags: 'gi',
    description: 'Matches MAC addresses',
    examples: ['01:23:45:67:89:AB']
  },
  slug: {
    name: 'slug',
    pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
    flags: '',
    description: 'Matches URL-safe slugs',
    examples: ['my-blog-post', 'hello-world-123']
  },
  semver: {
    name: 'semver',
    pattern: '\\bv?(?:0|[1-9]\\d*)\\.(?:0|[1-9]\\d*)\\.(?:0|[1-9]\\d*)(?:-[\\da-zA-Z-]+(?:\\.[\\da-zA-Z-]+)*)?(?:\\+[\\da-zA-Z-]+(?:\\.[\\da-zA-Z-]+)*)?\\b',
    flags: 'g',
    description: 'Matches semantic version strings',
    examples: ['1.0.0', 'v2.3.1-beta.1']
  },
  jwt: {
    name: 'jwt',
    pattern: 'eyJ[a-zA-Z0-9_-]+\\.eyJ[a-zA-Z0-9_-]+\\.[a-zA-Z0-9_-]+',
    flags: 'g',
    description: 'Matches JSON Web Tokens',
    examples: ['eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.abc123']
  },
  html_tag: {
    name: 'html_tag',
    pattern: '<\\/?[a-zA-Z][a-zA-Z0-9]*(?:\\s[^>]*)?\\/?>',
    flags: 'g',
    description: 'Matches HTML/XML tags',
    examples: ['<div>', '<img src="x" />', '</p>']
  },
  username: {
    name: 'username',
    pattern: '^[a-zA-Z0-9_-]{3,20}$',
    flags: '',
    description: 'Matches typical usernames (3–20 alphanumeric, _, -)',
    examples: ['cool_user', 'dev-123']
  },
  strong_password: {
    name: 'strong_password',
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$',
    flags: '',
    description: 'Enforces strong passwords (8+ chars, upper, lower, digit, special)',
    examples: ['P@ssw0rd!']
  }
};

// ─── Core Functions ─────────────────────────────────────────────────────────

function buildRegex(pattern, flags = '') {
  return new RegExp(pattern, flags);
}

/**
 * Test regex against text — return all matches with groups and indices.
 */
function testRegex(pattern, text, flags = 'g') {
  const re = buildRegex(pattern, flags.includes('g') ? flags : flags + 'g');
  const matches = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    const match = {
      match: m[0],
      index: m.index,
      length: m[0].length,
      groups: {}
    };
    // numbered groups
    for (let i = 1; i < m.length; i++) {
      match.groups[i] = m[i] ?? null;
    }
    // named groups
    if (m.groups) {
      Object.assign(match.groups, m.groups);
    }
    matches.push(match);
    if (!flags.includes('g') && !flags.includes('y')) break; // prevent infinite loop for non-global
  }
  return { pattern, flags, text, matchCount: matches.length, matches };
}

/**
 * Replace with regex.
 */
function replaceRegex(pattern, text, replacement, flags = 'g') {
  const re = buildRegex(pattern, flags);
  const result = text.replace(re, replacement);
  return { pattern, flags, text, replacement, result };
}

/**
 * Split with regex.
 */
function splitRegex(pattern, text, flags = '', limit) {
  const re = buildRegex(pattern, flags);
  const parts = limit !== undefined ? text.split(re, limit) : text.split(re);
  return { pattern, flags, text, parts, count: parts.length };
}

/**
 * Validate regex syntax — returns { valid, error? }.
 */
function validateRegex(pattern, flags = '') {
  try {
    new RegExp(pattern, flags);
    return { valid: true, pattern, flags };
  } catch (err) {
    return { valid: false, pattern, flags, error: err.message };
  }
}

/**
 * Escape special regex characters in a string.
 */
function escapeRegex(text) {
  const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return { original: text, escaped };
}

/**
 * Benchmark regex performance.
 */
function benchmarkRegex(pattern, text, flags = 'g', iterations = 1000) {
  const re = buildRegex(pattern, flags);
  const start = process.hrtime.bigint();
  for (let i = 0; i < iterations; i++) {
    re.lastIndex = 0;
    re.exec(text);
  }
  const end = process.hrtime.bigint();
  const totalNs = Number(end - start);
  return {
    pattern,
    flags,
    iterations,
    totalMs: +(totalNs / 1e6).toFixed(3),
    avgMs: +(totalNs / 1e6 / iterations).toFixed(6)
  };
}

// ─── Regex Explainer ────────────────────────────────────────────────────────

const TOKEN_DESCRIPTIONS = [
  [/^\^/, () => 'Start of string (anchor)'],
  [/^\$/, () => 'End of string (anchor)'],
  [/^\\b/, () => 'Word boundary'],
  [/^\\B/, () => 'Non-word boundary'],
  [/^\\d/, () => 'Any digit (0-9)'],
  [/^\\D/, () => 'Any non-digit'],
  [/^\\w/, () => 'Any word character (a-z, A-Z, 0-9, _)'],
  [/^\\W/, () => 'Any non-word character'],
  [/^\\s/, () => 'Any whitespace character'],
  [/^\\S/, () => 'Any non-whitespace character'],
  [/^\\n/, () => 'Newline'],
  [/^\\r/, () => 'Carriage return'],
  [/^\\t/, () => 'Tab'],
  [/^\\\./, () => 'Literal dot'],
  [/^\\\\/, () => 'Literal backslash'],
  [/^\\\//, () => 'Literal forward slash'],
  [/^\\([*+?^${}()|[\]])/, (m) => `Literal "${m[1]}"`],
  [/^\./, () => 'Any character (except newline)'],
  [/^\(\?:/, () => 'Non-capturing group — start'],
  [/^\(\?=/, () => 'Positive lookahead — start'],
  [/^\(\?!/, () => 'Negative lookahead — start'],
  [/^\(\?<=/, () => 'Positive lookbehind — start'],
  [/^\(\?<!/, () => 'Negative lookbehind — start'],
  [/^\(\?<([a-zA-Z_]\w*)>/, (m) => `Named capturing group "${m[1]}" — start`],
  [/^\(/, () => 'Capturing group — start'],
  [/^\)/, () => 'Group — end'],
  [/^\[(\^?)/, (m) => m[1] ? 'Negated character class [' : 'Character class ['],
  [/^\]/, () => '] end of character class'],
  [/^\{(\d+),(\d+)\}/, (m) => `Between ${m[1]} and ${m[2]} times`],
  [/^\{(\d+),\}/, (m) => `${m[1]} or more times`],
  [/^\{(\d+)\}/, (m) => `Exactly ${m[1]} times`],
  [/^\*\?/, () => 'Zero or more times (lazy)'],
  [/^\+\?/, () => 'One or more times (lazy)'],
  [/^\?\?/, () => 'Zero or one time (lazy)'],
  [/^\*/, () => 'Zero or more times (greedy)'],
  [/^\+/, () => 'One or more times (greedy)'],
  [/^\?/, () => 'Zero or one time (optional)'],
  [/^\|/, () => 'OR (alternation)'],
];

function explainRegex(pattern, flags = '') {
  const tokens = [];
  let remaining = pattern;
  let pos = 0;

  while (remaining.length > 0) {
    let matched = false;
    for (const [regex, describe] of TOKEN_DESCRIPTIONS) {
      const m = remaining.match(regex);
      if (m) {
        tokens.push({
          token: m[0],
          position: pos,
          description: describe(m)
        });
        pos += m[0].length;
        remaining = remaining.slice(m[0].length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      // literal character or character inside class
      const ch = remaining[0];
      tokens.push({
        token: ch,
        position: pos,
        description: `Literal "${ch}"`
      });
      pos += 1;
      remaining = remaining.slice(1);
    }
  }

  const flagDescriptions = [];
  if (flags.includes('g')) flagDescriptions.push('g — global (find all matches)');
  if (flags.includes('i')) flagDescriptions.push('i — case-insensitive');
  if (flags.includes('m')) flagDescriptions.push('m — multiline (^ and $ match line boundaries)');
  if (flags.includes('s')) flagDescriptions.push('s — dotAll (. matches newline)');
  if (flags.includes('u')) flagDescriptions.push('u — unicode');
  if (flags.includes('y')) flagDescriptions.push('y — sticky');

  // build a human-readable summary
  const summary = tokens.map(t => `  ${t.token}  →  ${t.description}`).join('\n');

  return {
    pattern,
    flags,
    flagDescriptions,
    tokens,
    summary: `/${pattern}/${flags}\n\n${summary}`
  };
}

// ─── Exports ────────────────────────────────────────────────────────────────

module.exports = {
  PATTERNS,
  testRegex,
  replaceRegex,
  splitRegex,
  validateRegex,
  escapeRegex,
  benchmarkRegex,
  explainRegex
};
