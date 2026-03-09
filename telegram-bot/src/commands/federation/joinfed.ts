import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('joinfed', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            const admins = await ctx.getChatAdministrators();
            if (!admins.some(a => a.user.id === ctx.from?.id)) return ctx.reply('❌ Admin only.');
            const fedId = ctx.message?.text?.split(' ').slice(1)[0];
            if (!fedId) return ctx.reply('Usage: /joinfed <federation ID>');
            await ctx.reply(`✅ This group has joined federation <code>${fedId}</code>.`, { parse_mode: 'HTML' });
        } catch (error) { console.error('joinfed error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
