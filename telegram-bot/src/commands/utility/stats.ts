import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('stats', async (ctx: BotContext) => {
        try {
            const uptime = process.uptime();
            const hours = Math.floor(uptime / 3600);
            const mins = Math.floor((uptime % 3600) / 60);
            const secs = Math.floor(uptime % 60);
            const mem = process.memoryUsage();
            await ctx.reply(
                `📊 <b>Bot Statistics</b>\n\n` +
                `├ <b>Uptime:</b> ${hours}h ${mins}m ${secs}s\n` +
                `├ <b>Memory:</b> ${Math.round(mem.heapUsed / 1024 / 1024)}MB / ${Math.round(mem.heapTotal / 1024 / 1024)}MB\n` +
                `├ <b>Node.js:</b> ${process.version}\n` +
                `└ <b>Platform:</b> ${process.platform}`,
                { parse_mode: 'HTML' }
            );
        } catch (error) { console.error('stats error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
