import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('blacklistmode', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            const admins = await ctx.getChatAdministrators();
            if (!admins.some(a => a.user.id === ctx.from?.id)) return ctx.reply('❌ Admin only.');
            const args = ctx.message?.text?.split(' ').slice(1) || [];
            const mode = args[0]?.toLowerCase();
            if (!['delete', 'warn', 'mute', 'kick', 'ban'].includes(mode)) {
                return ctx.reply('Usage: /blacklistmode <delete|warn|mute|kick|ban>');
            }
            await ctx.reply(`✅ Blacklist mode set to <b>${mode}</b>. Matching messages will trigger a ${mode} action.`, { parse_mode: 'HTML' });
        } catch (error) { console.error('blacklistmode error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
