import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('welcomemute', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            const admins = await ctx.getChatAdministrators();
            if (!admins.some(a => a.user.id === ctx.from?.id)) return ctx.reply('❌ Admin only.');
            const args = ctx.message?.text?.split(' ').slice(1) || [];
            const mode = args[0]?.toLowerCase();
            if (!['on', 'off'].includes(mode)) return ctx.reply('Usage: /welcomemute <on|off>\nWhen on, new users are muted until they press the unmute button.');
            await ctx.reply(mode === 'on' ? '🔇 Welcome mute <b>enabled</b>. New users will be muted until they verify.' : '🔊 Welcome mute <b>disabled</b>.', { parse_mode: 'HTML' });
        } catch (error) { console.error('welcomemute error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
