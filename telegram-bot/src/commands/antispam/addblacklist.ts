import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('addblacklist', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            const admins = await ctx.getChatAdministrators();
            if (!admins.some(a => a.user.id === ctx.from?.id)) return ctx.reply('❌ Admin only.');
            const word = ctx.message?.text?.split(' ').slice(1).join(' ')?.toLowerCase();
            if (!word) return ctx.reply('Usage: /addblacklist <word or phrase>\nMultiple words can be added separated by commas.');
            const words = word.split(',').map(w => w.trim()).filter(w => w);
            await ctx.reply(`✅ Added <b>${words.length}</b> word(s) to the blacklist:\n${words.map(w => `• <code>${w}</code>`).join('\n')}`, { parse_mode: 'HTML' });
        } catch (error) { console.error('addblacklist error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
