import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('fednotif', async (ctx: BotContext) => {
        try {
            if (!ctx.chat) return;
            const args = ctx.message?.text?.split(' ').slice(1) || [];
            const mode = args[0]?.toLowerCase();
            if (!['on', 'off'].includes(mode)) return ctx.reply('Usage: /fednotif <on|off>\nReceive DM notifications for federation events.');
            await ctx.reply(mode === 'on' ? '🔔 Federation notifications <b>enabled</b>.' : '🔕 Federation notifications <b>disabled</b>.', { parse_mode: 'HTML' });
        } catch (error) { console.error('fednotif error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
