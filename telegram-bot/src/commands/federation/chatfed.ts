import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('chatfed', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            await ctx.reply('🌐 This chat is not connected to any federation.\nUse /joinfed <id> to join one.');
        } catch (error) { console.error('chatfed error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
