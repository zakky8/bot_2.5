import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('connection', async (ctx: BotContext) => {
        try {
            await ctx.reply('🔗 <b>Connection Status</b>\n\nNot connected to any group.\nUse /connect <chat ID> to connect.', { parse_mode: 'HTML' });
        } catch (error) { console.error('connection error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
