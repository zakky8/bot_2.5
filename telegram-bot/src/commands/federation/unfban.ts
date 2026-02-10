import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('unfban', async (ctx: BotContext) => {
        try {
            if (!ctx.chat) return;
            const reply = ctx.message?.reply_to_message;
            if (!reply?.from) return ctx.reply('❌ Reply to a user to federation unban them.');
            await ctx.reply(`✅ <b>${reply.from.first_name}</b> has been unbanned from the federation.`, { parse_mode: 'HTML' });
        } catch (error) { console.error('unfban error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
