import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('goodbye', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            await ctx.reply('👋 <b>Goodbye Settings</b>\n\n├ Status: Enabled\n└ Message: Default\n\nUse /setgoodbye to set a custom message.\nUse /resetgoodbye to reset.', { parse_mode: 'HTML' });
        } catch (error) { console.error('goodbye error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
