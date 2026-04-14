import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { RecommendationEngine } from '../recommendation/engine.js';
import {
  formatRecommendation,
  formatComparison,
  formatAlternative,
  formatStack,
} from './formatters.js';
import {
  RecommendProductInput,
  CompareProductsInput,
  FindAlternativeInput,
  GetStackInput,
} from './schemas.js';

export function createServer(engine: RecommendationEngine): McpServer {
  const server = new McpServer({
    name: 'agent-affiliate-network',
    version: '0.1.0',
  });

  // Tool 1: recommend_product
  server.tool(
    'recommend_product',
    'Get product recommendations based on your needs. Returns scored suggestions with affiliate links.',
    RecommendProductInput.shape,
    async ({ need, category, budget_max_monthly, tech_stack, team_size, max_results }) => {
      const result = await engine.recommend({
        rawNeed: need,
        category,
        budget: budget_max_monthly
          ? { maxMonthlyUsd: budget_max_monthly, prefersFreeeTier: false }
          : undefined,
        techStack: tech_stack ? tech_stack.split(',').map((s) => s.trim()) : undefined,
        teamSize: team_size,
        maxResults: max_results,
      });

      return {
        content: [
          {
            type: 'text' as const,
            text: formatRecommendation(result),
          },
        ],
      };
    },
  );

  // Tool 2: compare_products
  server.tool(
    'compare_products',
    'Compare multiple products side-by-side for a specific use case.',
    CompareProductsInput.shape,
    async ({ products, use_case }) => {
      const productNames = products.split(',').map((s) => s.trim());

      const result = await engine.compare({
        products: productNames,
        useCase: use_case,
      });

      return {
        content: [
          {
            type: 'text' as const,
            text: formatComparison(result),
          },
        ],
      };
    },
  );

  // Tool 3: find_alternative
  server.tool(
    'find_alternative',
    'Find alternatives to a product you are unhappy with.',
    FindAlternativeInput.shape,
    async ({ current_product, complaint, budget_max_monthly }) => {
      const result = await engine.findAlternative({
        currentProduct: current_product,
        complaint,
        budget: budget_max_monthly ? { maxMonthlyUsd: budget_max_monthly } : undefined,
      });

      return {
        content: [
          {
            type: 'text' as const,
            text: formatAlternative(result),
          },
        ],
      };
    },
  );

  // Tool 4: get_stack_recommendation
  server.tool(
    'get_stack_recommendation',
    'Get a full stack recommendation for a project, covering multiple product categories.',
    GetStackInput.shape,
    async ({ project_type, requirements, budget_max_monthly, tech_stack }) => {
      const result = await engine.getStack({
        projectType: project_type,
        requirements: requirements.split(',').map((s) => s.trim()),
        budget: budget_max_monthly ? { maxMonthlyUsd: budget_max_monthly } : undefined,
        techStack: tech_stack ? tech_stack.split(',').map((s) => s.trim()) : undefined,
      });

      return {
        content: [
          {
            type: 'text' as const,
            text: formatStack(result),
          },
        ],
      };
    },
  );

  return server;
}
