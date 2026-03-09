import { Bot } from 'grammy';
import { BotContext } from '../types';

export default (bot: Bot<BotContext>) => {
  bot.on('message', async (_ctx) => {
    // Handle non-command messages here (e.g., filters, blacklist checks, flood detection)
  });
};
