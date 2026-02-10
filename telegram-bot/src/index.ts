import { Bot, session } from 'grammy';
import { I18n } from '@grammyjs/i18n';

// ... imports

const i18n = new I18n<BotContext>({
  defaultLocale: 'en',
  directory: join(__dirname, 'locales'),
});

// Use middlewares
import { RedisAdapter } from '@grammyjs/storage-redis';
import Redis from 'ioredis';
import { run } from '@grammyjs/runner';
import { config } from 'dotenv';
import { readdirSync, existsSync, statSync } from 'fs';
import { join } from 'path';
import { createLogger } from './core/logger';
import { connectDatabase } from './core/database';
import { connectRedis } from './core/redis';
import { authMiddleware } from './middlewares/auth';
import { rateLimitMiddleware } from './middlewares/rateLimit';
import { loggingMiddleware } from './middlewares/logging';
import { errorHandler } from './middlewares/errorHandler';
import { BotContext, SessionData } from './types';

config();

const logger = createLogger('Main');

// Create bot
const bot = new Bot<BotContext>(process.env.BOT_TOKEN!);

// Redis connection for Session Storage
const sessionRedis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
sessionRedis.on('error', (err) => logger.error('Session Redis Error:', err));

// Use session with Redis storage
bot.use(session({
  initial: (): SessionData => ({
    language: 'en',
    userData: {},
    captcha: { enabled: false, mode: 'button' },
    locks: {}
  }),
  storage: new RedisAdapter({ instance: sessionRedis }),
  getSessionKey: (ctx) => ctx.chat?.id.toString(), // Store settings per chat
}));

// Use middlewares
bot.use(i18n);
bot.use(loggingMiddleware);
bot.use(authMiddleware);
bot.use(rateLimitMiddleware);

// Load commands
async function loadCommands() {
  const commandsPath = join(__dirname, 'commands');
  if (!existsSync(commandsPath)) {
    logger.warn('Commands directory not found');
    return;
  }
  const commandFolders = readdirSync(commandsPath);

  for (const folder of commandFolders) {
    const folderPath = join(commandsPath, folder);
    // Skip files, only process directories
    const stat = statSync(folderPath);
    if (!stat.isDirectory()) continue;

    const commandFiles = readdirSync(folderPath).filter(
      (file) => file.endsWith('.ts') || file.endsWith('.js')
    );

    for (const file of commandFiles) {
      const filePath = join(folderPath, file);
      try {
        const command = await import(filePath);
        if (command.default && typeof command.default === 'function') {
          command.default(bot);
          logger.info(`Loaded command: ${folder}/${file}`);
        }
      } catch (error) {
        logger.error(`Error loading command ${folder}/${file}:`, error);
      }
    }
  }
}

// Load handlers
async function loadHandlers() {
  const handlersPath = join(__dirname, 'handlers');
  if (!existsSync(handlersPath)) {
    logger.warn('Handlers directory not found');
    return;
  }
  const handlerFiles = readdirSync(handlersPath).filter(
    (file) => file.endsWith('.ts') || file.endsWith('.js')
  );

  for (const file of handlerFiles) {
    const filePath = join(handlersPath, file);
    try {
      const handler = await import(filePath);
      if (handler.default && typeof handler.default === 'function') {
        handler.default(bot);
        logger.info(`Loaded handler: ${file}`);
      }
    } catch (error) {
      logger.error(`Error loading handler ${file}:`, error);
    }
  }
}

// Initialize bot
async function init() {
  try {
    logger.info('Initializing Telegram bot...');

    // Connect to services (graceful — won't crash without them)
    await connectDatabase();
    await connectRedis();

    // Load bot components
    await loadCommands();
    await loadHandlers();

    // Use error handler
    bot.catch(errorHandler);

    // Start bot
    const runner = run(bot);

    // Handle graceful shutdown
    const stopRunner = () => {
      logger.info('Stopping bot...');
      runner.isRunning() && runner.stop();
    };

    process.once('SIGINT', stopRunner);
    process.once('SIGTERM', stopRunner);

    logger.info('Telegram bot started successfully');
  } catch (error) {
    logger.error('Failed to initialize bot:', error);
    process.exit(1);
  }
}

// Handle errors
process.on('unhandledRejection', (error) => {
  logger.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
  process.exit(1);
});

// Start bot
init();

export { bot };
