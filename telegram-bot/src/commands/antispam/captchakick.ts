import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('captchakick', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            const admins = await ctx.getChatAdministrators();
            if (!admins.some(a => a.user.id === ctx.from?.id)) return ctx.reply('❌ Admin only.');
            const args = ctx.message?.text?.split(' ').slice(1) || [];
            const minutes = parseInt(args[0]);
            if (isNaN(minutes) || minutes < 1 || minutes > 60) return ctx.reply('Usage: /captchakick <1-60 minutes>\nTime before unverified users are kicked.');
            await ctx.reply(`⏰ Users who don't verify within <b>${minutes}</b> minute(s) will be kicked.`, { parse_mode: 'HTML' });
        } catch (error) { console.error('captchakick error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
