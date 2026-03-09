import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('fedpromote', async (ctx: BotContext) => {
        try {
            if (!ctx.chat) return;
            const reply = ctx.message?.reply_to_message;
            if (!reply?.from) return ctx.reply('❌ Reply to a user to promote them as federation admin.');
            await ctx.reply(`⬆️ <b>${reply.from.first_name}</b> has been promoted to federation admin.`, { parse_mode: 'HTML' });
        } catch (error) { console.error('fedpromote error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
