#!/usr/bin/env node

/**
 * regex-toolkit MCP server (Model Context Protocol)
 * Communicates over stdin/stdout using JSON-RPC 2.0.
 */

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

// ─── Tool definitions ───────────────────────────────────────────────────────

const TOOLS = [
  {
    name: 'regex_test',
    description: 'Test a regex against text. Returns all matches, groups, and indices.',
    inputSchema: {
      type: 'object',
      properties: {
        pattern: { type: 'string', description: 'Regular expression pattern' },
        text: { type: 'string', description: 'Text to test against' },
        flags: { type: 'string', description: 'Regex flags (default: "g")', default: 'g' }
      },
      required: ['pattern', 'text']
    }
  },
  {
    name: 'regex_replace',
    description: 'Replace matches of a regex in text.',
    inputSchema: {
      type: 'object',
      properties: {
        pattern: { type: 'string', description: 'Regular expression pattern' },
        text: { type: 'string', description: 'Input text' },
        replacement: { type: 'string', description: 'Replacement string' },
        flags: { type: 'string', description: 'Regex flags (default: "g")', default: 'g' }
      },
      required: ['pattern', 'text', 'replacement']
    }
  },
  {
    name: 'regex_split',
    description: 'Split text using a regex pattern.',
    inputSchema: {
      type: 'object',
      properties: {
        pattern: { type: 'string', description: 'Regular expression pattern' },
        text: { type: 'string', description: 'Input text' },
        flags: { type: 'string', description: 'Regex flags', default: '' },
        limit: { type: 'number', description: 'Max number of splits' }
      },
      required: ['pattern', 'text']
    }
  },
  {
    name: 'regex_validate',
    description: 'Check if a regex pattern is syntactically valid.',
    inputSchema: {
      type: 'object',
      properties: {
        pattern: { type: 'string', description: 'Regular expression pattern' },
        flags: { type: 'string', description: 'Regex flags', default: '' }
      },
      required: ['pattern']
    }
  },
  {
    name: 'regex_explain',
    description: 'Explain a regex pattern in plain English, token by token.',
    inputSchema: {
      type: 'object',
      properties: {
        pattern: { type: 'string', description: 'Regular expression pattern' },
        flags: { type: 'string', description: 'Regex flags', default: '' }
      },
      required: ['pattern']
    }
  },
  {
    name: 'regex_escape',
    description: 'Escape special regex characters in a string.',
    inputSchema: {
      type: 'object',
      properties: {
        text: { type: 'string', description: 'Text to escape' }
      },
      required: ['text']
    }
  },
  {
    name: 'regex_patterns',
    description: 'List all common regex patterns, or get a specific one by name.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Pattern name (omit to list all)' }
      }
    }
  },
  {
    name: 'regex_benchmark',
    description: 'Benchmark regex execution speed.',
    inputSchema: {
      type: 'object',
      properties: {
        pattern: { type: 'string', description: 'Regular expression pattern' },
        text: { type: 'string', description: 'Text to test against' },
        flags: { type: 'string', description: 'Regex flags', default: 'g' },
        iterations: { type: 'number', description: 'Number of iterations (default: 1000)', default: 1000 }
      },
      required: ['pattern', 'text']
    }
  }
];

// ─── Tool dispatcher ────────────────────────────────────────────────────────

function callTool(name, args) {
  switch (name) {
    case 'regex_test':
      return testRegex(args.pattern, args.text, args.flags);
    case 'regex_replace':
      return replaceRegex(args.pattern, args.text, args.replacement, args.flags);
    case 'regex_split':
      return splitRegex(args.pattern, args.text, args.flags, args.limit);
    case 'regex_validate':
      return validateRegex(args.pattern, args.flags);
    case 'regex_explain':
      return explainRegex(args.pattern, args.flags);
    case 'regex_escape':
      return escapeRegex(args.text);
    case 'regex_patterns': {
      if (args.name) {
        const p = PATTERNS[args.name];
        if (!p) return { error: `Pattern "${args.name}" not found`, available: Object.keys(PATTERNS) };
        return p;
      }
      return { count: Object.keys(PATTERNS).length, patterns: Object.keys(PATTERNS) };
    }
    case 'regex_benchmark':
      return benchmarkRegex(args.pattern, args.text, args.flags, args.iterations);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// ─── JSON-RPC handler ───────────────────────────────────────────────────────

function handleRequest(request) {
  const { id, method, params } = request;

  switch (method) {
    case 'initialize':
      return {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: { tools: {} },
          serverInfo: {
            name: 'regex-toolkit',
            version: '1.0.0'
          }
        }
      };

    case 'notifications/initialized':
      return null; // no response needed

    case 'tools/list':
      return {
        jsonrpc: '2.0',
        id,
        result: { tools: TOOLS }
      };

    case 'tools/call': {
      const { name, arguments: args } = params;
      try {
        const result = callTool(name, args || {});
        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
          }
        };
      } catch (err) {
        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [{ type: 'text', text: `Error: ${err.message}` }],
            isError: true
          }
        };
      }
    }

    default:
      return {
        jsonrpc: '2.0',
        id,
        error: { code: -32601, message: `Method not found: ${method}` }
      };
  }
}

// ─── Stdin/Stdout transport ─────────────────────────────────────────────────

let buffer = '';

process.stdin.setEncoding('utf-8');
process.stdin.on('data', (chunk) => {
  buffer += chunk;
  const lines = buffer.split('\n');
  buffer = lines.pop(); // keep incomplete line in buffer
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const request = JSON.parse(line);
      const response = handleRequest(request);
      if (response) {
        process.stdout.write(JSON.stringify(response) + '\n');
      }
    } catch (err) {
      const errorResponse = {
        jsonrpc: '2.0',
        id: null,
        error: { code: -32700, message: 'Parse error' }
      };
      process.stdout.write(JSON.stringify(errorResponse) + '\n');
    }
  }
});

process.stderr.write('regex-toolkit MCP server started\n');
