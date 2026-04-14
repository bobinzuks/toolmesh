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
  // Security: Only read config from trusted locations.
  // 1. TOOLMESH_CONFIG env var (explicit user override)
  // 2. $HOME/.toolmeshrc.json (user's home directory)
  //
  // We intentionally do NOT read from CWD by default.  A malicious
  // repository could ship a .toolmeshrc.json that redirects affiliate links
  // or changes the data directory to a world-readable location.
  const configPaths: string[] = [];

  const envConfig = process.env.TOOLMESH_CONFIG;
  if (envConfig) {
    configPaths.push(envConfig);
  }

  configPaths.push(join(homedir(), '.toolmeshrc.json'));

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
