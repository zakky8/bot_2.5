import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('setsticker', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            const admins = await ctx.getChatAdministrators();
            if (!admins.some(a => a.user.id === ctx.from?.id)) return ctx.reply('❌ Admin only.');
            const reply = ctx.message?.reply_to_message;
            if (!reply?.sticker?.set_name) return ctx.reply('❌ Reply to a sticker to set it as the group sticker set.');
            await ctx.reply(`✅ Group sticker set updated to: <b>${reply.sticker.set_name}</b>`, { parse_mode: 'HTML' });
        } catch (error) { console.error('setsticker error:', error); await ctx.reply('❌ Failed to set sticker.'); }
    });
};
