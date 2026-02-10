import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('slowmode', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            const admins = await ctx.getChatAdministrators();
            if (!admins.some(a => a.user.id === ctx.from?.id)) return ctx.reply('❌ Admin only.');
            const args = ctx.message?.text?.split(' ').slice(1) || [];
            const seconds = parseInt(args[0]);
            if (isNaN(seconds) || seconds < 0 || seconds > 86400) return ctx.reply('Usage: /slowmode <0-86400 seconds>\nSet to 0 to disable.');
            await ctx.api.setChatPermissions(ctx.chat.id, { can_send_messages: true });
            await ctx.reply(seconds > 0 ? `🐌 Slowmode set to <b>${seconds}</b> second(s).` : '🐌 Slowmode disabled.', { parse_mode: 'HTML' });
        } catch (error) { console.error('slowmode error:', error); await ctx.reply('❌ Failed to set slowmode.'); }
    });
};
