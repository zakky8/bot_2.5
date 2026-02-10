import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('spurge', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            const admins = await ctx.getChatAdministrators();
            if (!admins.some(a => a.user.id === ctx.from?.id)) return ctx.reply('❌ Admin only.');

            const reply = ctx.message?.reply_to_message;
            if (!reply) return ctx.reply('❌ Reply to a message. All messages from that point to now will be deleted.');

            const chatId = ctx.chat.id;
            const startId = reply.message_id;
            const endId = ctx.message?.message_id || startId;
            let deleted = 0;

            for (let i = startId; i <= endId; i++) {
                try { await ctx.api.deleteMessage(chatId, i); deleted++; } catch { /* ignore */ }
            }

            const statusMsg = await ctx.reply(`🗑️ Silent purge: <b>${deleted}</b> messages deleted.`, { parse_mode: 'HTML' });
            setTimeout(() => ctx.api.deleteMessage(chatId, statusMsg.message_id).catch(() => { /* ignore */ }), 3000);
        } catch (error) { console.error('spurge error:', error); await ctx.reply('❌ Failed to purge.'); }
    });
};
