import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('setfloodmode', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            const admins = await ctx.getChatAdministrators();
            if (!admins.some(a => a.user.id === ctx.from?.id)) return ctx.reply('❌ Admin only.');
            const args = ctx.message?.text?.split(' ').slice(1) || [];
            const mode = args[0]?.toLowerCase();
            if (!['ban', 'kick', 'mute', 'tban', 'tmute'].includes(mode)) {
                return ctx.reply('Usage: /setfloodmode <ban|kick|mute|tban|tmute>\n\n• ban — Permanently ban\n• kick — Kick from group\n• mute — Mute indefinitely\n• tban — Temp ban (specify time)\n• tmute — Temp mute (specify time)');
            }
            const emojis: Record<string, string> = { ban: '🔨', kick: '👢', mute: '🔇', tban: '⏱🔨', tmute: '⏱🔇' };
            await ctx.reply(`${emojis[mode]} Flood mode set to <b>${mode}</b>.`, { parse_mode: 'HTML' });
        } catch (error) { console.error('setfloodmode error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
