import { BotError, GrammyError, HttpError } from 'grammy';
import { createLogger } from '../core/logger';

const logger = createLogger('ErrorHandler');

export const errorHandler = (err: BotError) => {
  const ctx = err.ctx;
  logger.error(`Error while handling update ${ctx.update.update_id}:`);
  
  const e = err.error;
  if (e instanceof GrammyError) {
    logger.error('Error in request:', e.description);
  } else if (e instanceof HttpError) {
    logger.error('Could not contact Telegram:', e);
  } else {
    logger.error('Unknown error:', e);
  }
};
