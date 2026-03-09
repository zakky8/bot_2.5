import { Pool } from 'pg';
import { createLogger } from './logger';

const logger = createLogger('Database');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const connectDatabase = async () => {
  if (!process.env.DATABASE_URL) {
    logger.warn('DATABASE_URL not set — running without database');
    return;
  }
  try {
    const client = await pool.connect();
    logger.info('Connected to PostgreSQL database');
    client.release();
  } catch (error) {
    logger.warn('Failed to connect to database — running without database:', error);
  }
};

export const query = async (text: string, params?: unknown[]) => {
  if (!process.env.DATABASE_URL) {
    throw new Error('Database not configured');
  }
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  logger.debug('Executed query', { text, duration, rows: res.rowCount });
  return res;
};

export default pool;
