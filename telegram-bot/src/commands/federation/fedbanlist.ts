import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('fedbanlist', async (ctx: BotContext) => {
        try {
            if (!ctx.chat) return;
            await ctx.reply('📋 <b>Federation Ban List</b>\n\nNo bans recorded.\nUse /fban to ban users across the federation.', { parse_mode: 'HTML' });
        } catch (error) { console.error('fedbanlist error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
