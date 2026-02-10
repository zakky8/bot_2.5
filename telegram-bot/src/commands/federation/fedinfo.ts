import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('fedinfo', async (ctx: BotContext) => {
        try {
            if (!ctx.chat) return;
            await ctx.reply('🌐 <b>Federation Info</b>\n\n├ Name: —\n├ ID: —\n├ Owner: —\n├ Admins: 0\n├ Bans: 0\n└ Groups: 0\n\nThis group is not part of any federation.\nUse /joinfed <id> to join one.', { parse_mode: 'HTML' });
        } catch (error) { console.error('fedinfo error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
