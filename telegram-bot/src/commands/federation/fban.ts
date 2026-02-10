import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('fban', async (ctx: BotContext) => {
        try {
            if (!ctx.chat) return;
            const reply = ctx.message?.reply_to_message;
            if (!reply?.from) return ctx.reply('❌ Reply to a user to federation ban them.');
            const reason = ctx.message?.text?.split(' ').slice(1).join(' ') || 'No reason';
            await ctx.reply(`🔨 <b>Federation Ban</b>\n\n├ User: ${reply.from.first_name}\n├ ID: <code>${reply.from.id}</code>\n├ Reason: ${reason}\n└ Banned across all federated groups`, { parse_mode: 'HTML' });
        } catch (error) { console.error('fban error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
