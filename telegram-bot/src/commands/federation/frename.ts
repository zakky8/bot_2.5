import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('frename', async (ctx: BotContext) => {
        try {
            if (!ctx.chat) return;
            const name = ctx.message?.text?.split(' ').slice(1).join(' ');
            if (!name) return ctx.reply('Usage: /frename <new name>');
            await ctx.reply(`✅ Federation renamed to: <b>${name}</b>`, { parse_mode: 'HTML' });
        } catch (error) { console.error('frename error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
