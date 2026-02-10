import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('unlock', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            const admins = await ctx.getChatAdministrators();
            if (!admins.some((a) => a.user.id === ctx.from?.id)) return ctx.reply('❌ Admin only.');

            const args = ctx.message?.text?.split(' ').slice(1) || [];
            const type = args[0]?.toLowerCase();
            const validTypes = ['all', 'media', 'stickers', 'links', 'polls', 'invite', 'info', 'pin'];

            if (!type || !validTypes.includes(type)) return ctx.reply(`Usage: /unlock <${validTypes.join('|')}>`);

            if (ctx.session.locks) {
                ctx.session.locks[type as keyof typeof ctx.session.locks] = false;
            }

            await ctx.reply(`🔓 <b>${type.toUpperCase()}</b> has been unlocked.`, { parse_mode: 'HTML' });
        } catch (error) { console.error('unlock error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
