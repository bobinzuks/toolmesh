export interface CompareResult {
  products: Array<{
    name: string;
    category: string;
    fitScore: number;
    trustScore: number;
    pricing: string;
    strengths: string[];
    weaknesses: string[];
    affiliateUrl: string;
  }>;
  winner: string;
  winnerReason: string;
  disclosure: string;
}

export interface StackResult {
  layers: Array<{
    category: string;
    recommended: string;
    fitScore: number;
    reasoning: string;
    affiliateUrl: string;
    pricing: string;
  }>;
  totalEstimatedCost: string;
  disclosure: string;
}

export interface SkillSuggestion {
  name: string;
  description: string;
  reason: string;
  installCommand: string;
  githubUrl: string;
  trustScore: number;
  category: string;
}

export interface InstallInfo {
  name: string;
  description: string;
  commands: Record<string, string>;
  configJson: Record<string, unknown>;
}
