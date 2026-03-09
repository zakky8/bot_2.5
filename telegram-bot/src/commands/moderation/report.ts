import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('report', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            const reply = ctx.message?.reply_to_message;
            if (!reply) return ctx.reply('❌ Reply to a message to report it to admins.');
            const admins = await ctx.getChatAdministrators();
            const adminMentions = admins.filter(a => !a.user.is_bot).map(a => `<a href="tg://user?id=${a.user.id}">${a.user.first_name}</a>`).join(', ');
            await ctx.reply(`🚨 <b>Report by ${ctx.from?.first_name}</b>\n\nAdmins have been notified: ${adminMentions}\n\n<i>Reported message above ⬆️</i>`, { parse_mode: 'HTML', reply_to_message_id: reply.message_id });
        } catch (error) { console.error('report error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
