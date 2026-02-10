import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('pin', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            const admins = await ctx.getChatAdministrators();
            if (!admins.some(a => a.user.id === ctx.from?.id)) return ctx.reply('❌ Admin only.');
            const reply = ctx.message?.reply_to_message;
            if (!reply) return ctx.reply('❌ Reply to a message to pin it.');
            await ctx.pinChatMessage(reply.message_id);
            await ctx.reply('📌 Message pinned!');
        } catch (error) { console.error('pin error:', error); await ctx.reply('❌ Failed to pin message.'); }
    });
};
