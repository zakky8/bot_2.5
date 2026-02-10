import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('delfed', async (ctx: BotContext) => {
        try {
            if (!ctx.chat) return;
            await ctx.reply('⚠️ Are you sure you want to delete your federation? This action is irreversible. Send /confirm to proceed.');
        } catch (error) { console.error('delfed error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
