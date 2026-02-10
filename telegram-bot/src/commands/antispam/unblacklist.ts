import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('unblacklist', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            const admins = await ctx.getChatAdministrators();
            if (!admins.some(a => a.user.id === ctx.from?.id)) return ctx.reply('❌ Admin only.');
            const word = ctx.message?.text?.split(' ').slice(1).join(' ')?.toLowerCase();
            if (!word) return ctx.reply('Usage: /unblacklist <word or phrase>');
            await ctx.reply(`✅ Removed <code>${word}</code> from the blacklist.`, { parse_mode: 'HTML' });
        } catch (error) { console.error('unblacklist error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
