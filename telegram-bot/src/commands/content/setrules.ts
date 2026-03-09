import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('setrules', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            const admins = await ctx.getChatAdministrators();
            if (!admins.some(a => a.user.id === ctx.from?.id)) return ctx.reply('❌ Admin only.');
            const rules = ctx.message?.text?.split(' ').slice(1).join(' ');
            if (!rules) return ctx.reply('Usage: /setrules <rules text>');
            await ctx.reply(`✅ Rules updated!\n\n📜 <b>Preview:</b>\n${rules}`, { parse_mode: 'HTML' });
        } catch (error) { console.error('setrules error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
