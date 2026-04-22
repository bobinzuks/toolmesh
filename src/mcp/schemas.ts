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

export const DiscoverSkillsInput = z.object({
  need: z.string().min(3).describe('What capability you need. E.g., "browser automation", "database queries", "web search"'),
  category: z.enum(CATEGORIES).optional().describe('Category filter (defaults to mcp-server)'),
  max_results: z.number().int().min(1).max(10).default(5),
});

export const SuggestSkillsInput = z.object({
  current_tools: z.string().optional().describe('Comma-separated list of MCP servers/tools currently installed'),
  project_type: z.string().optional().describe('What kind of project you are working on'),
  max_suggestions: z.number().int().min(1).max(10).default(5),
});

export const InstallSkillInput = z.object({
  skill_name: z.string().describe('Name of the MCP server to install'),
  editor: z.enum(['claude-code', 'cursor', 'windsurf', 'generic']).default('claude-code'),
});

export const OUTCOME_TYPES = ['click', 'signup', 'retain', 'churn'] as const;

export const ReportOutcomeInput = z.object({
  product_name: z.string().describe('Name of the product the outcome is about'),
  outcome: z.enum(OUTCOME_TYPES).describe('What happened: click (visited affiliate link), signup (created account), retain (still using after 30 days), churn (stopped using)'),
  trajectory_id: z.string().optional().describe('Trajectory ID from a previous recommendation result. If omitted, matches the most recent recommendation containing this product.'),
});

export type RecommendProductParams = z.infer<typeof RecommendProductInput>;
export type CompareProductsParams = z.infer<typeof CompareProductsInput>;
export type FindAlternativeParams = z.infer<typeof FindAlternativeInput>;
export type GetStackParams = z.infer<typeof GetStackInput>;
export type DiscoverSkillsParams = z.infer<typeof DiscoverSkillsInput>;
export type SuggestSkillsParams = z.infer<typeof SuggestSkillsInput>;
export type InstallSkillParams = z.infer<typeof InstallSkillInput>;
export type ReportOutcomeParams = z.infer<typeof ReportOutcomeInput>;
