import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('captchamode', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            const admins = await ctx.getChatAdministrators();
            if (!admins.some((a) => a.user.id === ctx.from?.id)) return ctx.reply('❌ Admin only.');
            const args = ctx.message?.text?.split(' ').slice(1) || [];
            const mode = args[0]?.toLowerCase();
            if (!['button', 'math', 'text'].includes(mode)) return ctx.reply('Usage: /captchamode <button|math|text>\n\n• button — Press a button\n• math — Solve simple math\n• text — Type shown text');

            ctx.session.captcha.mode = mode as 'button' | 'math' | 'text';

            await ctx.reply(`🔐 CAPTCHA mode set to <b>${mode}</b>.`, { parse_mode: 'HTML' });
        } catch (error) { console.error('captchamode error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
