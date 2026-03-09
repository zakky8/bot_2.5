import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('antiraid', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            await ctx.reply('🛡️ <b>Anti-Raid Status</b>\n\n├ Status: Disabled\n├ Mode: Not set\n├ Join Rate: N/A\n└ Action: N/A\n\nUse /setantiraid to configure anti-raid protection.', { parse_mode: 'HTML' });
        } catch (error) { console.error('antiraid error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
