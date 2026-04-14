import { z } from 'zod';

export const CATEGORIES = [
  'database', 'auth', 'hosting', 'email', 'analytics', 'monitoring',
  'cms', 'payments', 'storage', 'search', 'ci-cd', 'testing',
  'api-gateway', 'message-queue', 'cdn', 'dns', 'logging',
  'mcp-server', 'ai-llm', 'api', 'dev-tools', 'design',
  'communication', 'security', 'infrastructure', 'seo', 'other',
] as const;

export type Category = typeof CATEGORIES[number];

export const TEAM_SIZES = ['solo', 'small', 'medium', 'large', 'enterprise'] as const;

export type TeamSize = typeof TEAM_SIZES[number];

export const RecommendProductInput = z.object({
  need: z.string().min(3).describe('What the user needs'),
  category: z.enum(CATEGORIES).optional().describe('Category filter'),
  budget_max_monthly: z.number().min(0).optional().describe('Max monthly budget in USD'),
  tech_stack: z.string().optional().describe('Comma-separated current tech stack'),
  team_size: z.enum(TEAM_SIZES).optional(),
  max_results: z.number().int().min(1).max(10).default(3),
});

export const CompareProductsInput = z.object({
  products: z.string().describe('Comma-separated product names to compare'),
  use_case: z.string().min(3).describe('What you are evaluating them for'),
});

export const FindAlternativeInput = z.object({
  current_product: z.string().describe('Product you want to replace'),
  complaint: z.string().describe('Why you want to switch'),
  budget_max_monthly: z.number().min(0).optional(),
});

export const GetStackInput = z.object({
  project_type: z.string().describe('What you are building'),
  requirements: z.string().describe('Comma-separated requirements'),
  budget_max_monthly: z.number().min(0).optional(),
  tech_stack: z.string().optional().describe('Existing tech stack'),
});

export type RecommendProductParams = z.infer<typeof RecommendProductInput>;
export type CompareProductsParams = z.infer<typeof CompareProductsInput>;
export type FindAlternativeParams = z.infer<typeof FindAlternativeInput>;
export type GetStackParams = z.infer<typeof GetStackInput>;
