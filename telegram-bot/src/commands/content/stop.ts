import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('stop', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            const admins = await ctx.getChatAdministrators();
            if (!admins.some(a => a.user.id === ctx.from?.id)) return ctx.reply('❌ Admin only.');
            const keyword = ctx.message?.text?.split(' ').slice(1).join(' ')?.toLowerCase();
            if (!keyword) return ctx.reply('Usage: /stop <keyword>');
            await ctx.reply(`✅ Filter <code>${keyword}</code> removed.`, { parse_mode: 'HTML' });
        } catch (error) { console.error('stop error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
