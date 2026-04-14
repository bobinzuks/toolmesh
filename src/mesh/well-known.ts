/**
 * .well-known Static File Generator
 *
 * Generates all the .well-known/ files needed for agent discovery:
 *
 *   /.well-known/agent-card.json        A2A Agent Card
 *   /.well-known/agentics-manifest.json Agentic robots-txt manifest
 *   /.well-known/agent.json             Simplified capability manifest
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { generateAgentCard, type AgentCardConfig } from './agent-card.js';

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const DEFAULT_URL = 'http://localhost:3848';

// ---------------------------------------------------------------------------
// agentics-manifest.json
// ---------------------------------------------------------------------------

function generateAgenticsManifest(config?: { url?: string }): Record<string, unknown> {
  const baseUrl = config?.url ?? DEFAULT_URL;

  return {
    version: '1.0.0',
    name: 'Agent Affiliate Network',
    description: 'Commission-blind product recommendations for AI agents',
    capabilities: ['recommendations', 'product-search', 'comparisons'],
    auth: 'none',
    realtime: false,
    endpoints: [
      {
        id: 'recommend_product',
        path: '/a2a/recommend_product',
        method: 'POST',
        description: 'Find the best SaaS product for a specific need',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Natural language product need' },
            budget: { type: 'string', description: 'Budget constraint (optional)' },
          },
          required: ['query'],
        },
      },
      {
        id: 'compare_products',
        path: '/a2a/compare_products',
        method: 'POST',
        description: 'Compare multiple products side-by-side',
        inputSchema: {
          type: 'object',
          properties: {
            products: {
              type: 'array',
              items: { type: 'string' },
              description: 'Product names to compare',
            },
          },
          required: ['products'],
        },
      },
      {
        id: 'find_alternative',
        path: '/a2a/find_alternative',
        method: 'POST',
        description: 'Find replacements for products you are unhappy with',
        inputSchema: {
          type: 'object',
          properties: {
            product: { type: 'string', description: 'Product to find alternatives for' },
            reason: { type: 'string', description: 'Why you want to switch (optional)' },
          },
          required: ['product'],
        },
      },
      {
        id: 'get_stack_recommendation',
        path: '/a2a/get_stack_recommendation',
        method: 'POST',
        description: 'Get a full tech stack recommendation',
        inputSchema: {
          type: 'object',
          properties: {
            projectType: { type: 'string', description: 'Type of project to build' },
            constraints: { type: 'string', description: 'Budget or tech constraints (optional)' },
          },
          required: ['projectType'],
        },
      },
    ],
    contact: baseUrl,
  };
}

// ---------------------------------------------------------------------------
// agent.json (simplified capability manifest)
// ---------------------------------------------------------------------------

function generateSimplifiedManifest(config?: { url?: string }): Record<string, unknown> {
  const baseUrl = config?.url ?? DEFAULT_URL;

  return {
    name: 'Agent Affiliate Network',
    description: 'Commission-blind product recommendations for AI agents',
    url: baseUrl,
    version: '0.1.0',
    capabilities: {
      recommend_product: {
        description: 'Find the best SaaS product for a specific need',
        endpoint: `${baseUrl}/a2a/recommend_product`,
      },
      compare_products: {
        description: 'Compare multiple products side-by-side',
        endpoint: `${baseUrl}/a2a/compare_products`,
      },
      find_alternative: {
        description: 'Find replacements for products you are unhappy with',
        endpoint: `${baseUrl}/a2a/find_alternative`,
      },
      get_stack_recommendation: {
        description: 'Get a full tech stack recommendation',
        endpoint: `${baseUrl}/a2a/get_stack_recommendation`,
      },
    },
    protocol: 'a2a',
    agentCardUrl: `${baseUrl}/.well-known/agent-card.json`,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate all .well-known files as a map of filename to JSON content.
 */
export function generateWellKnownFiles(
  config?: AgentCardConfig,
): Record<string, string> {
  const cardConfig: AgentCardConfig = {
    url: config?.url,
    version: config?.version,
    meshRunning: config?.meshRunning,
  };

  const agentCard = generateAgentCard(cardConfig);

  return {
    'agent-card.json': JSON.stringify(agentCard, null, 2) + '\n',
    'agentics-manifest.json':
      JSON.stringify(generateAgenticsManifest({ url: config?.url }), null, 2) + '\n',
    'agent.json':
      JSON.stringify(generateSimplifiedManifest({ url: config?.url }), null, 2) + '\n',
  };
}

/**
 * Write all .well-known files to disk (for static hosting).
 *
 * Creates `<outputDir>/.well-known/` and writes each file into it.
 */
export function writeWellKnownFiles(
  outputDir: string,
  config?: AgentCardConfig,
): void {
  const wellKnownDir = join(outputDir, '.well-known');
  mkdirSync(wellKnownDir, { recursive: true });

  const files = generateWellKnownFiles(config);

  for (const [filename, content] of Object.entries(files)) {
    const filePath = join(wellKnownDir, filename);
    writeFileSync(filePath, content, 'utf-8');
  }
}
