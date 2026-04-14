#!/usr/bin/env node

import { seedDatabase } from './registry/seeder.js';
import { getDb, closeDb } from './registry/database.js';
import { ProductRepository } from './registry/repository.js';

function main(): void {
  console.log('Seeding AAN product registry...\n');

  try {
    const result = seedDatabase();

    if (result.inserted === 0 && result.skipped > 0) {
      console.log(`Database already seeded. ${result.skipped} products skipped (already exist).`);
    } else {
      console.log(`Inserted: ${result.inserted}`);
      console.log(`Skipped:  ${result.skipped}`);
    }

    const total = new ProductRepository(getDb()).count();
    console.log(`\nTotal products in registry: ${total}`);
    console.log('Done.');
  } catch (err) {
    console.error('Seed failed:', err instanceof Error ? err.message : err);
    process.exitCode = 1;
  } finally {
    closeDb();
  }
}

main();
