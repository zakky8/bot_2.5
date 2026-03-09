import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('pinned', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            await ctx.reply('📌 To see pinned messages, tap the chat name at the top and select "Pinned Messages".\n\nUse /pin to pin a message or /unpinall to clear all pins.');
        } catch (error) { console.error('pinned error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
