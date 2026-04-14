/**
 * A2A Agent Card Generator
 *
 * Generates the .well-known/agent-card.json content per the A2A protocol
 * specification.  This is what other agents fetch to discover AAN's
 * capabilities and how to interact with them.
 */

import type { AgentCard, AgentSkill, MeshExtension } from './types.js';

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const DEFAULT_URL = 'http://localhost:3848';
const DEFAULT_VERSION = '0.1.0';

// ---------------------------------------------------------------------------
// Skill definitions (mapped from MCP tools)
// ---------------------------------------------------------------------------

const AAN_SKILLS: AgentSkill[] = [
  {
    id: 'recommend_product',
    name: 'Recommend Product',
    description:
      'Find the best SaaS product for a specific need. Returns semantically ' +
      'matched results ranked by fit score with FTC-compliant affiliate disclosures.',
    tags: ['recommendation', 'search', 'products', 'saas', 'affiliate'],
    examples: [
      'Find me a CI/CD tool for a small team',
      'Recommend a database for my serverless project',
      'What monitoring tool should I use under $50/month?',
    ],
  },
  {
    id: 'compare_products',
    name: 'Compare Products',
    description:
      'Compare multiple products side-by-side across dimensions like pricing, ' +
      'features, integrations, and community ecosystem.',
    tags: ['compare', 'versus', 'comparison', 'analysis', 'pricing'],
    examples: [
      'Compare Supabase vs Firebase vs PlanetScale',
      'Vercel vs Netlify for a Next.js app',
    ],
  },
  {
    id: 'find_alternative',
    name: 'Find Alternative',
    description:
      'Find replacements for products you are unhappy with. Searches for ' +
      'alternatives that match or exceed the original across key dimensions.',
    tags: ['alternative', 'replacement', 'migration', 'switch'],
    examples: [
      'Find an alternative to Heroku for hosting',
      'What can I use instead of Firebase Auth?',
    ],
  },
  {
    id: 'get_stack_recommendation',
    name: 'Get Stack Recommendation',
    description:
      'Get a full tech stack recommendation for a project type. Considers ' +
      'inter-product compatibility, integration density, and budget constraints.',
    tags: ['stack', 'architecture', 'full-stack', 'project-setup'],
    examples: [
      'Build me a stack for a real-time SaaS app',
      'What tools do I need for a data pipeline?',
    ],
  },
];

// ---------------------------------------------------------------------------
// Extensions
// ---------------------------------------------------------------------------

function buildExtensions(config?: { meshRunning?: boolean }): MeshExtension[] {
  const extensions: MeshExtension[] = [];

  // Agentic robots.txt extension -- always present.
  extensions.push({
    uri: 'urn:aan:agentic-robots-txt',
    data: {
      manifestUrl: '/.well-known/agentics-manifest.json',
      policy: 'open',
    },
  });

  // Mesh peers extension -- only when the gossip mesh is active.
  if (config?.meshRunning) {
    extensions.push({
      uri: 'urn:aan:mesh-peers',
      data: {
        gossipEndpoint: '/a2a/gossip',
        protocol: 'swim-gossip',
      },
    });
  }

  return extensions;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface AgentCardConfig {
  url?: string;
  version?: string;
  meshRunning?: boolean;
}

/**
 * Generate the AAN Agent Card object.
 */
export function generateAgentCard(config?: AgentCardConfig): AgentCard {
  return {
    name: 'Agent Affiliate Network',
    description: 'Commission-blind product recommendations for AI agents',
    version: config?.version ?? DEFAULT_VERSION,
    url: config?.url ?? DEFAULT_URL,
    skills: AAN_SKILLS,
    extensions: buildExtensions({ meshRunning: config?.meshRunning }),
  };
}

/**
 * Generate the AAN Agent Card as pretty-printed JSON (suitable for
 * writing to .well-known/agent-card.json).
 */
export function generateAgentCardJson(config?: AgentCardConfig): string {
  return JSON.stringify(generateAgentCard(config), null, 2) + '\n';
}
