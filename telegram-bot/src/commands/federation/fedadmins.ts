import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('fedadmins', async (ctx: BotContext) => {
        try {
            if (!ctx.chat) return;
            await ctx.reply('👥 <b>Federation Admins</b>\n\nNo federation configured.\nUse /joinfed to join a federation first.', { parse_mode: 'HTML' });
        } catch (error) { console.error('fedadmins error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
