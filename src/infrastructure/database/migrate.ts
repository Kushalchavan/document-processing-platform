import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dbPool } from './pool';
import { logger } from '@infrastructure/logger/logger';

// import.meta.url
// file:src/infrastructure/database/migrate.ts

// Convert URL → File Path
const __filename = fileURLToPath(import.meta.url);

//\src\infrastructure\database
const __dirname = path.dirname(__filename);

//\src\infrastructure\database\migrations
const migrationsPath = path.join(__dirname, 'migrations');

async function ensureMigrationsTableExists() {
  // check if migration table exists
  const result = await dbPool.query(`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_name = 'migrations'
    );
    `);

  if (result.rows[0].exists) {
    return;
  }

  // read 000_migrations.sql file
  const sql = await fs.readFile(path.join(migrationsPath, '000_migrations.sql'), 'utf-8');

  await dbPool.query(sql);
}

export async function runMigrations() {
  await ensureMigrationsTableExists();

  const files = (await fs.readdir(migrationsPath))
    .filter((file) => file !== '000_migrations.sql')
    .sort();

  for (const file of files) {
    console.log(file);
    const result = await dbPool.query(`SELECT * FROM migrations WHERE filename = $1`, [file]);

    if ((result.rowCount ?? 0) > 0) {
      continue;
    }

    // Read the sql file
    const sql = await fs.readFile(path.join(migrationsPath, file), 'utf-8');

    // Execute the sql file
    await dbPool.query(sql);

    // Insert filename into migrations table
    await dbPool.query(`INSERT INTO migrations (filename) VALUES ($1)`, [file]);
  }
}

runMigrations()
  .then(() => {
    logger.info('✅ Migrations completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration failed', error);
    process.exit(1);
  });
