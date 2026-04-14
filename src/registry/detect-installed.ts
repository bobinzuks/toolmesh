import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

interface McpConfig {
  mcpServers?: Record<string, unknown>;
}

/**
 * Detect installed MCP servers by reading .mcp.json files from common locations.
 * Returns a list of server names/keys found across all config files.
 */
export function detectInstalledMcpServers(): string[] {
  const configPaths = [
    // Claude Code (project-level)
    join(process.cwd(), '.mcp.json'),
    // Claude Code (user-level)
    join(homedir(), '.mcp.json'),
    // Cursor (project-level)
    join(process.cwd(), '.cursor', 'mcp.json'),
    // Cursor (user-level)
    join(homedir(), '.cursor', 'mcp.json'),
  ];

  const servers = new Set<string>();

  for (const configPath of configPaths) {
    if (!existsSync(configPath)) continue;

    try {
      const raw = readFileSync(configPath, 'utf-8');
      const config = JSON.parse(raw) as McpConfig;

      if (config.mcpServers && typeof config.mcpServers === 'object') {
        for (const key of Object.keys(config.mcpServers)) {
          servers.add(key);
        }
      }
    } catch {
      // Invalid JSON or unreadable — skip silently
    }
  }

  return [...servers];
}

/**
 * Get a human-readable summary of detected MCP servers.
 */
export function getInstalledSummary(): { count: number; names: string[]; sources: string[] } {
  const configPaths = [
    { path: join(process.cwd(), '.mcp.json'), label: '.mcp.json (project)' },
    { path: join(homedir(), '.mcp.json'), label: '~/.mcp.json (user)' },
    { path: join(process.cwd(), '.cursor', 'mcp.json'), label: '.cursor/mcp.json (project)' },
    { path: join(homedir(), '.cursor', 'mcp.json'), label: '~/.cursor/mcp.json (user)' },
  ];

  const names: string[] = [];
  const sources: string[] = [];

  for (const { path, label } of configPaths) {
    if (!existsSync(path)) continue;

    try {
      const raw = readFileSync(path, 'utf-8');
      const config = JSON.parse(raw) as McpConfig;

      if (config.mcpServers && typeof config.mcpServers === 'object') {
        const keys = Object.keys(config.mcpServers);
        if (keys.length > 0) {
          sources.push(`${label}: ${keys.join(', ')}`);
          names.push(...keys);
        }
      }
    } catch {
      // skip
    }
  }

  return { count: names.length, names: [...new Set(names)], sources };
}
