import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('adminlist', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            const admins = await ctx.getChatAdministrators();
            const list = admins.map(a => {
                const title = 'custom_title' in a && a.custom_title ? ` — ${a.custom_title}` : '';
                const status = a.status === 'creator' ? '👑' : '⭐';
                return `${status} <a href="tg://user?id=${a.user.id}">${a.user.first_name}</a>${title}`;
            }).join('\n');
            await ctx.reply(`👥 <b>Admins in ${ctx.chat.title || 'this chat'}:</b>\n\n${list}\n\n<b>Total:</b> ${admins.length}`, { parse_mode: 'HTML' });
        } catch (error) { console.error('adminlist error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
