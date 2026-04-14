import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

export interface AanConfig {
  affiliateIds: Record<string, string>;
  excludedProducts: string[];
  preferredCategories: string[];
  maxBudget?: number;
  dataDir: string;
}

const DEFAULT_CONFIG: AanConfig = {
  affiliateIds: {},
  excludedProducts: [],
  preferredCategories: [],
  dataDir: join(homedir(), '.toolmesh'),
};

export function loadConfig(): AanConfig {
  const configPaths = [
    join(process.cwd(), '.toolmeshrc.json'),
    join(homedir(), '.toolmeshrc.json'),
  ];

  for (const configPath of configPaths) {
    if (existsSync(configPath)) {
      try {
        const raw = readFileSync(configPath, 'utf-8');
        const parsed = JSON.parse(raw);
        return { ...DEFAULT_CONFIG, ...parsed };
      } catch {
        // Invalid config, use defaults
      }
    }
  }

  return DEFAULT_CONFIG;
}
