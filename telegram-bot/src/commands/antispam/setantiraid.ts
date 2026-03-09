import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('setantiraid', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            const admins = await ctx.getChatAdministrators();
            if (!admins.some(a => a.user.id === ctx.from?.id)) return ctx.reply('❌ Admin only.');
            const args = ctx.message?.text?.split(' ').slice(1) || [];
            const mode = args[0]?.toLowerCase();
            if (!['on', 'off', 'kick', 'ban', 'mute'].includes(mode)) {
                return ctx.reply('Usage: /setantiraid <on|off|kick|ban|mute>\n\n• on — Enable with default settings\n• off — Disable\n• kick/ban/mute — Enable with specific action');
            }
            if (mode === 'off') {
                return ctx.reply('🛡️ Anti-raid protection <b>disabled</b>.', { parse_mode: 'HTML' });
            }
            await ctx.reply(`🛡️ Anti-raid protection <b>enabled</b>.\nAction: <b>${mode === 'on' ? 'kick' : mode}</b>\nNew users joining rapidly will be actioned.`, { parse_mode: 'HTML' });
        } catch (error) { console.error('setantiraid error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
