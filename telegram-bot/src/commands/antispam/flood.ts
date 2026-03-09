import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('flood', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            await ctx.reply('🌊 <b>Flood Settings</b>\n\n├ Status: Enabled\n├ Limit: 10 messages\n├ Time: 5 seconds\n└ Action: mute\n\nUse /setflood to change the limit.\nUse /setfloodmode to change the action.', { parse_mode: 'HTML' });
        } catch (error) { console.error('flood error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
