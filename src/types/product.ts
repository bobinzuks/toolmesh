export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  pricing: string;
  features: string[];
  integrations: string[];
  bestFor: string[];
  worstFor: string[];
  trustScore: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AffiliateProgram {
  id: string;
  productId: string;
  network: string;
  affiliateLink: string;
  payoutType: 'per-signup' | 'per-sale' | 'recurring' | 'hybrid';
  payoutAmount: number;
  payoutCurrency: string;
  cookieDays: number;
  approved: boolean;
  /** HMAC-SHA256 signature for link integrity verification (may be absent on legacy data). */
  linkSignature?: string;
}

export interface ProductWithEmbedding extends Product {
  embedding: Float32Array;
}

export interface ScoredProduct extends Product {
  fitScore: number;
  confidence: number;
  perspectiveScores: PerspectiveScores;
  affiliatePrograms: AffiliateProgram[];
}

export interface CandidateProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  pricing: string;
  features: string[];
  integrations: string[];
  bestFor: string[];
  worstFor: string[];
  trustScore: number;
  fitScore: number;
  cosineSimilarity: number;
}

export interface PerspectiveScores {
  semantic: number;
  budgetary: number;
  technicalFit: number;
  scalability: number;
  communityEcosystem: number;
  integrationDensity: number;
  freshness: number;
  [key: string]: number;
}

export interface RecommendationRequest {
  rawNeed: string;
  category?: string;
  budget?: { maxMonthlyUsd: number; prefersFreeeTier: boolean };
  techStack?: string[];
  teamSize?: 'solo' | 'small' | 'medium' | 'large' | 'enterprise';
  maxResults?: number;
}

export interface RecommendationResult {
  status: 'served' | 'refused';
  recommendations: ProductRecommendation[];
  disclosure: string;
  queryContext: {
    totalCandidatesEvaluated: number;
    confidenceThreshold: number;
    candidatesBelowThreshold: number;
  };
  refusalReason?: string;
}

export interface ProductRecommendation {
  name: string;
  category: string;
  fitScore: number;
  confidence: number;
  trustScore: number;
  pricingSummary: string;
  reasoning: string;
  affiliateUrl: string;
  topDimensions: Array<{
    dimension: string;
    score: number;
    explanation: string;
  }>;
}

export interface CompareRequest {
  products: string[];
  useCase: string;
  priorities?: string[];
}

export interface AlternativeRequest {
  currentProduct: string;
  complaint: string;
  budget?: { maxMonthlyUsd: number };
}

export interface StackRequest {
  projectType: string;
  requirements: string[];
  budget?: { maxMonthlyUsd: number };
  techStack?: string[];
}

export const FTC_DISCLOSURE = 'These recommendations include affiliate links. Products were selected based on fit for your stated needs, not commission rates. Affiliate commissions help fund this service.';
