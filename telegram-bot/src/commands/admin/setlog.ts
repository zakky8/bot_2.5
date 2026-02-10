import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('setlog', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            const admins = await ctx.getChatAdministrators();
            if (!admins.some(a => a.user.id === ctx.from?.id)) return ctx.reply('❌ Admin only.');
            await ctx.reply(`📋 Log channel set to this chat (ID: <code>${ctx.chat.id}</code>).\nAdmin actions will be logged here.`, { parse_mode: 'HTML' });
        } catch (error) { console.error('setlog error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
