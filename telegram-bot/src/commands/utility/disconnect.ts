import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('disconnect', async (ctx: BotContext) => {
        try {
            await ctx.reply('✅ Disconnected from remote management.');
        } catch (error) { console.error('disconnect error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
