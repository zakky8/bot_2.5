import { Bot } from 'grammy';
import { BotContext } from '../../types';
import { clearTgWarnings } from './warns';

export default (bot: Bot<BotContext>) => {
    bot.command('resetwarns', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            const admins = await ctx.getChatAdministrators();
            if (!admins.some(a => a.user.id === ctx.from?.id)) return ctx.reply('❌ Admin only.');

            const reply = ctx.message?.reply_to_message;
            if (!reply?.from) return ctx.reply('❌ Reply to a user to reset their warnings.');

            clearTgWarnings(ctx.chat.id, reply.from.id);
            await ctx.reply(`✅ All warnings for <b>${reply.from.first_name}</b> have been cleared.`, { parse_mode: 'HTML' });
        } catch (error) { console.error('resetwarns error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
