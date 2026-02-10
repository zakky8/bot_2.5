import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('filters', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            await ctx.reply('📋 <b>Active Filters</b>\n\nNo filters set.\n\nUse /filter <keyword> <response> to add.\nUse /stop <keyword> to remove.', { parse_mode: 'HTML' });
        } catch (error) { console.error('filters error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
