import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('invitelink', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            const admins = await ctx.getChatAdministrators();
            if (!admins.some(a => a.user.id === ctx.from?.id)) return ctx.reply('❌ Admin only.');
            const link = await ctx.exportChatInviteLink();
            await ctx.reply(`🔗 <b>Invite Link:</b>\n${link}`, { parse_mode: 'HTML' });
        } catch (error) { console.error('invitelink error:', error); await ctx.reply('❌ Failed to generate invite link.'); }
    });
};
