import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('start', async (ctx: BotContext) => {
        try {
            const name = ctx.from?.first_name || 'there';
            await ctx.reply(
                `👋 <b>Hello ${name}!</b>\n\n` +
                `I'm a powerful group management bot. Here's what I can do:\n\n` +
                `🛡 <b>Moderation</b> — kick, ban, mute, warn\n` +
                `⚙️ <b>Admin</b> — promote, demote, settings\n` +
                `🔒 <b>Anti-Spam</b> — flood control, captcha, blacklist\n` +
                `👋 <b>Greetings</b> — welcome/goodbye messages\n` +
                `📝 <b>Content</b> — notes, filters, rules\n` +
                `🌐 <b>Federation</b> — cross-group ban management\n` +
                `🎮 <b>Fun</b> — interactive commands\n\n` +
                `Use /help for a full command list.\n` +
                `Add me to a group to get started!`,
                { parse_mode: 'HTML' }
            );
        } catch (error) { console.error('start error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
