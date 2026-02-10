import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('hug', async (ctx: BotContext) => {
        try {
            const reply = ctx.message?.reply_to_message;
            const target = reply?.from?.first_name || 'the air';
            const hugs = [
                `gives ${target} a warm hug 🤗`,
                `wraps their arms around ${target} 💕`,
                `sends a virtual bear hug to ${target} 🐻`,
                `hugs ${target} tightly ❤️`,
                `group hugs with ${target}! Everyone join in! 🫂`,
            ];
            const action = hugs[Math.floor(Math.random() * hugs.length)];
            await ctx.reply(`🤗 <b>${ctx.from?.first_name}</b> ${action}`, { parse_mode: 'HTML' });
        } catch (error) { console.error('hug error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
