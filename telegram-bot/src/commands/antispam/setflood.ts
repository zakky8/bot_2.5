import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('setflood', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            const admins = await ctx.getChatAdministrators();
            if (!admins.some(a => a.user.id === ctx.from?.id)) return ctx.reply('❌ Admin only.');
            const args = ctx.message?.text?.split(' ').slice(1) || [];
            const limit = parseInt(args[0]);
            if (isNaN(limit) || limit < 0 || limit > 100) return ctx.reply('Usage: /setflood <0-100>\nSet to 0 to disable flood detection.');
            if (limit === 0) return ctx.reply('🌊 Flood detection <b>disabled</b>.', { parse_mode: 'HTML' });
            await ctx.reply(`🌊 Flood limit set to <b>${limit}</b> messages.\nUsers sending more than ${limit} messages quickly will be actioned.`, { parse_mode: 'HTML' });
        } catch (error) { console.error('setflood error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
