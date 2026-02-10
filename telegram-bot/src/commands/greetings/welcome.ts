import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('welcome', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            await ctx.reply('👋 <b>Welcome Settings</b>\n\n├ Status: Enabled\n├ Message: Default\n├ Clean: Off\n├ Mute new users: Off\n└ Delete service msgs: Off\n\nUse /setwelcome to set a custom message.\nUse /resetwelcome to reset.\nPlaceholders: {user} {chatname} {count}', { parse_mode: 'HTML' });
        } catch (error) { console.error('welcome error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
