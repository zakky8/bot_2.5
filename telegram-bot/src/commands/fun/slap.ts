import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('slap', async (ctx: BotContext) => {
        try {
            const reply = ctx.message?.reply_to_message;
            const target = reply?.from?.first_name || 'themselves';
            const slaps = [
                `slaps ${target} with a large trout 🐟`,
                `hits ${target} with a mass un-ban 💥`,
                `throws a mass of bricks at ${target} 🧱`,
                `gently slaps ${target} 👋`,
                `faceplants ${target} into a wall 🧱`,
                `slaps ${target} around with a rubber chicken 🐔`,
            ];
            const action = slaps[Math.floor(Math.random() * slaps.length)];
            await ctx.reply(`😤 <b>${ctx.from?.first_name}</b> ${action}`, { parse_mode: 'HTML' });
        } catch (error) { console.error('slap error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
