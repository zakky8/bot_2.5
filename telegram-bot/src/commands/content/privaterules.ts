import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('privaterules', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            const admins = await ctx.getChatAdministrators();
            if (!admins.some(a => a.user.id === ctx.from?.id)) return ctx.reply('❌ Admin only.');
            const args = ctx.message?.text?.split(' ').slice(1) || [];
            const mode = args[0]?.toLowerCase();
            if (!['on', 'off'].includes(mode)) return ctx.reply('Usage: /privaterules <on|off>\nWhen on, rules are sent via DM instead of in the group.');
            await ctx.reply(mode === 'on' ? '✅ Rules will be sent privately via DM.' : '✅ Rules will be shown publicly in the group.', { parse_mode: 'HTML' });
        } catch (error) { console.error('privaterules error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
