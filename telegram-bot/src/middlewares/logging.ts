import { NextFunction } from 'grammy';
import { BotContext } from '../types';
import { createLogger } from '../core/logger';

const logger = createLogger('Bot');

export const loggingMiddleware = async (ctx: BotContext, next: NextFunction) => {
  const start = Date.now();
  await next();
  const duration = Date.now() - start;

  logger.info('Request processed', {
    updateType: ctx.update.message ? 'message' : 'other',
    from: ctx.from?.id,
    chat: ctx.chat?.id,
    duration,
  });
};
