import { logger } from '@infrastructure/logger/logger';
import { dbPool } from './pool';

export async function initializeDatabase() {
  let connection;
  try {
    connection = await dbPool.connect();
    await connection.query(`SELECT 1`); // Test the connection
    logger.info('✅ Database connection established successfully.');
  } catch (error: unknown) {
    logger.error('Error initializing the database:', error);
    process.exit(1); // Exit the process with an error code
  } finally {
    connection?.release(); // Release the connnection back to the pool
  }
}
