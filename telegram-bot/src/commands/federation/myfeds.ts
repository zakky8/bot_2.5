import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('myfeds', async (ctx: BotContext) => {
        try {
            if (!ctx.chat) return;
            await ctx.reply('🌐 <b>Your Federations</b>\n\nYou are not the owner of any federations.\nUse /newfed <name> to create one.', { parse_mode: 'HTML' });
        } catch (error) { console.error('myfeds error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
