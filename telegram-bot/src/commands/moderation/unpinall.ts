import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('unpinall', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            const admins = await ctx.getChatAdministrators();
            if (!admins.some(a => a.user.id === ctx.from?.id)) return ctx.reply('❌ Admin only.');
            await ctx.unpinAllChatMessages();
            await ctx.reply('📌 All messages have been unpinned!');
        } catch (error) { console.error('unpinall error:', error); await ctx.reply('❌ Failed to unpin all messages.'); }
    });
};
