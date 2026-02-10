import { createClient } from 'redis';
import { createLogger } from './logger';

const logger = createLogger('Redis');

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

client.on('error', (err) => logger.warn('Redis Client Error', err));
client.on('connect', () => logger.info('Connected to Redis'));

export const connectRedis = async () => {
  if (!process.env.REDIS_URL) {
    logger.warn('REDIS_URL not set — running without Redis');
    return;
  }
  try {
    await client.connect();
  } catch (error) {
    logger.warn('Failed to connect to Redis — running without Redis:', error);
  }
};

export default client;
