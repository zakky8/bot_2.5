import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('newfed', async (ctx: BotContext) => {
        try {
            if (!ctx.chat) return;
            const name = ctx.message?.text?.split(' ').slice(1).join(' ');
            if (!name) return ctx.reply('Usage: /newfed <federation name>');
            const fedId = Math.random().toString(36).substring(2, 10);
            await ctx.reply(`✅ <b>Federation Created</b>\n\n├ Name: ${name}\n├ ID: <code>${fedId}</code>\n├ Owner: ${ctx.from?.first_name}\n└ Members: 0\n\nUse /joinfed ${fedId} in a group to join.`, { parse_mode: 'HTML' });
        } catch (error) { console.error('newfed error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
