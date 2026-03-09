import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('runs', async (ctx: BotContext) => {
        try {
            const runs = [
                'runs away screaming 🏃💨',
                'runs into a wall 💥',
                'tries to run but trips over a rock 🪨',
                'runs in circles confused 🌀',
                'runs so fast they break the sound barrier 💨💨',
                'runs to the fridge for snacks 🍕',
                'runs and hides behind the sofa 🛋️',
                'runs toward the sunset dramatically 🌅',
            ];
            const action = runs[Math.floor(Math.random() * runs.length)];
            await ctx.reply(`🏃 <b>${ctx.from?.first_name}</b> ${action}`, { parse_mode: 'HTML' });
        } catch (error) { console.error('runs error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
