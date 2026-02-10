import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('ping', async (ctx: BotContext) => {
        try {
            const start = Date.now();
            const msg = await ctx.reply('🏓 Pinging...');
            const latency = Date.now() - start;
            await ctx.api.editMessageText(ctx.chat!.id, msg.message_id, `🏓 <b>Pong!</b>\n\n├ Response: <code>${latency}ms</code>\n└ Status: Online ✅`, { parse_mode: 'HTML' });
        } catch (error) { console.error('ping error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
