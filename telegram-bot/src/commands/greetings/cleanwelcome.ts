import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('cleanwelcome', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            const admins = await ctx.getChatAdministrators();
            if (!admins.some(a => a.user.id === ctx.from?.id)) return ctx.reply('❌ Admin only.');
            const args = ctx.message?.text?.split(' ').slice(1) || [];
            const mode = args[0]?.toLowerCase();
            if (!['on', 'off'].includes(mode)) return ctx.reply('Usage: /cleanwelcome <on|off>\nWhen on, previous welcome messages are deleted when a new one is sent.');
            await ctx.reply(mode === 'on' ? '✅ Clean welcome <b>enabled</b>. Old welcome messages will be auto-deleted.' : '✅ Clean welcome <b>disabled</b>.', { parse_mode: 'HTML' });
        } catch (error) { console.error('cleanwelcome error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
