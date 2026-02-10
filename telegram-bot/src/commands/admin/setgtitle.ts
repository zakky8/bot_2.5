import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('setgtitle', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            const admins = await ctx.getChatAdministrators();
            if (!admins.some(a => a.user.id === ctx.from?.id)) return ctx.reply('❌ Admin only.');
            const title = ctx.message?.text?.split(' ').slice(1).join(' ');
            if (!title) return ctx.reply('Usage: /setgtitle <new title>');
            await ctx.api.setChatTitle(ctx.chat.id, title.substring(0, 128));
            await ctx.reply(`✅ Group title changed to: <b>${title.substring(0, 128)}</b>`, { parse_mode: 'HTML' });
        } catch (error) { console.error('setgtitle error:', error); await ctx.reply('❌ Failed to set title.'); }
    });
};
