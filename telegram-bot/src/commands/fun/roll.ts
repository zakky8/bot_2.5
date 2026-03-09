import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('roll', async (ctx: BotContext) => {
        try {
            const args = ctx.message?.text?.split(' ').slice(1) || [];
            const max = parseInt(args[0]) || 6;
            const result = Math.floor(Math.random() * max) + 1;
            await ctx.reply(`🎲 <b>${ctx.from?.first_name}</b> rolled a <b>${result}</b> (1-${max})`, { parse_mode: 'HTML' });
        } catch (error) { console.error('roll error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
