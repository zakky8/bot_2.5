import { NextFunction } from 'grammy';
import { BotContext } from '../types';

export const authMiddleware = async (_ctx: BotContext, next: NextFunction) => {
  // Add authentication logic here
  await next();
};
