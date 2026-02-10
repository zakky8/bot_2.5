import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('setgoodbye', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            const admins = await ctx.getChatAdministrators();
            if (!admins.some(a => a.user.id === ctx.from?.id)) return ctx.reply('❌ Admin only.');
            const text = ctx.message?.text?.split(' ').slice(1).join(' ');
            if (!text) return ctx.reply('Usage: /setgoodbye <message>\nPlaceholders: {user} {chatname} {first}');
            await ctx.reply(`✅ Goodbye message set!\n\n<b>Preview:</b>\n${text.replace('{user}', ctx.from?.first_name || 'User').replace('{chatname}', ctx.chat.title || 'Group')}`, { parse_mode: 'HTML' });
        } catch (error) { console.error('setgoodbye error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
