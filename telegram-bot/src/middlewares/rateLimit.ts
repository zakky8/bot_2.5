import { NextFunction } from 'grammy';
import { BotContext } from '../types';
import { createLogger } from '../core/logger';

const logger = createLogger('RateLimit');

// In-memory rate limiting fallback when Redis is unavailable
const rateLimitMap = new Map<number, { count: number; resetAt: number }>();

const RATE_LIMIT = 30; // messages per minute
const WINDOW = 60000; // milliseconds

export const rateLimitMiddleware = async (ctx: BotContext, next: NextFunction) => {
  if (!ctx.from) return await next();

  const userId = ctx.from.id;
  const now = Date.now();

  let entry = rateLimitMap.get(userId);
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + WINDOW };
    rateLimitMap.set(userId, entry);
  }

  entry.count++;

  if (entry.count > RATE_LIMIT) {
    logger.warn(`Rate limited user ${userId}`);
    return ctx.reply('⚠️ You are sending messages too fast. Please slow down.');
  }

  // Cleanup old entries periodically
  if (rateLimitMap.size > 10000) {
    for (const [key, val] of rateLimitMap) {
      if (now > val.resetAt) rateLimitMap.delete(key);
    }
  }

  await next();
};
