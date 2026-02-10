import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('setcaptcha', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            const admins = await ctx.getChatAdministrators();
            if (!admins.some((a) => a.user.id === ctx.from?.id)) return ctx.reply('❌ Admin only.');
            const args = ctx.message?.text?.split(' ').slice(1) || [];
            const mode = args[0]?.toLowerCase();
            if (!['on', 'off'].includes(mode)) return ctx.reply('Usage: /setcaptcha <on|off>');

            ctx.session.captcha.enabled = (mode === 'on');

            await ctx.reply(mode === 'on' ? '🔐 CAPTCHA verification <b>enabled</b>. New users must verify before chatting.' : '🔓 CAPTCHA verification <b>disabled</b>.', { parse_mode: 'HTML' });
        } catch (error) { console.error('setcaptcha error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
