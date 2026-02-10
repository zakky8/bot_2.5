import { Bot } from 'grammy';
import { BotContext } from '../../types';
import { removeTgWarning, getTgWarnings } from './warns';

export default (bot: Bot<BotContext>) => {
    bot.command('unwarn', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            const admins = await ctx.getChatAdministrators();
            if (!admins.some(a => a.user.id === ctx.from?.id)) return ctx.reply('❌ Admin only.');

            const reply = ctx.message?.reply_to_message;
            if (!reply?.from) return ctx.reply('❌ Reply to a user to remove their last warning.');

            const w = getTgWarnings(ctx.chat.id, reply.from.id);
            if (w.length === 0) return ctx.reply('✅ This user has no warnings.');

            removeTgWarning(ctx.chat.id, reply.from.id, w.length - 1);
            await ctx.reply(`✅ Removed last warning from <b>${reply.from.first_name}</b>. Remaining: ${w.length - 1}`, { parse_mode: 'HTML' });
        } catch (error) { console.error('unwarn error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
