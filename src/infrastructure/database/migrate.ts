import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dbPool } from './pool.js';
import { logger } from '../../infrastructure/logger/logger.js';

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

  
   console.log('DATABASE_URL:', process.env.DATABASE_URL);

  const info = await dbPool.query(`
    SELECT
      current_database() AS database,
      inet_server_addr() AS server_ip,
      inet_server_port() AS server_port,
      version();
  `);

  console.log(info.rows[0]);


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
