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
