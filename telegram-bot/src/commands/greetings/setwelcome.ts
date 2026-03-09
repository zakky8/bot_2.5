import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('setwelcome', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            const admins = await ctx.getChatAdministrators();
            if (!admins.some(a => a.user.id === ctx.from?.id)) return ctx.reply('❌ Admin only.');
            const text = ctx.message?.text?.split(' ').slice(1).join(' ');
            if (!text) return ctx.reply('Usage: /setwelcome <message>\n\nPlaceholders:\n• {user} — User mention\n• {chatname} — Group name\n• {count} — Member count\n• {first} — First name\n• {id} — User ID');
            const preview = text.replace('{user}', ctx.from?.first_name || 'User').replace('{chatname}', ctx.chat.title || 'Group').replace('{count}', '100').replace('{first}', ctx.from?.first_name || 'User').replace('{id}', String(ctx.from?.id || 0));
            await ctx.reply(`✅ Welcome message set!\n\n<b>Preview:</b>\n${preview}`, { parse_mode: 'HTML' });
        } catch (error) { console.error('setwelcome error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
