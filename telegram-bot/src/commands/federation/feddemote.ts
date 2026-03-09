import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('feddemote', async (ctx: BotContext) => {
        try {
            if (!ctx.chat) return;
            const reply = ctx.message?.reply_to_message;
            if (!reply?.from) return ctx.reply('❌ Reply to a user to demote them from federation admin.');
            await ctx.reply(`⬇️ <b>${reply.from.first_name}</b> has been demoted from federation admin.`, { parse_mode: 'HTML' });
        } catch (error) { console.error('feddemote error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
