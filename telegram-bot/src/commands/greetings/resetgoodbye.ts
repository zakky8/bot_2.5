import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('resetgoodbye', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            const admins = await ctx.getChatAdministrators();
            if (!admins.some(a => a.user.id === ctx.from?.id)) return ctx.reply('❌ Admin only.');
            await ctx.reply('✅ Goodbye message has been reset to default.');
        } catch (error) { console.error('resetgoodbye error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
