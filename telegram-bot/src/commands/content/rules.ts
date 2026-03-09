import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('rules', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            await ctx.reply('📜 <b>Group Rules</b>\n\nNo rules set yet.\n\nAdmins can use /setrules to set rules.', { parse_mode: 'HTML' });
        } catch (error) { console.error('rules error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
