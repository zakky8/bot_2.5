import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('pat', async (ctx: BotContext) => {
        try {
            const reply = ctx.message?.reply_to_message;
            const target = reply?.from?.first_name || 'themselves';
            const pats = [
                `pats ${target} on the head 🤚`,
                `gives ${target} gentle head pats ✨`,
                `pats ${target} reassuringly 😊`,
                `softly pats ${target} 💫`,
                `gives ${target} all the head pats 🌟`,
            ];
            const action = pats[Math.floor(Math.random() * pats.length)];
            await ctx.reply(`✋ <b>${ctx.from?.first_name}</b> ${action}`, { parse_mode: 'HTML' });
        } catch (error) { console.error('pat error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
