import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('welcomemutehelp', async (ctx: BotContext) => {
        try {
            await ctx.reply('🔇 <b>Welcome Mute Help</b>\n\nWelcome mute restricts new members from chatting until they verify.\n\n<b>Commands:</b>\n• /welcomemute on — Enable\n• /welcomemute off — Disable\n• /setcaptcha on — Use CAPTCHA verification\n• /captchamode <mode> — Set verification type\n\n<b>How it works:</b>\n1. User joins the group\n2. They are muted automatically\n3. A verification button/prompt appears\n4. User verifies → unmuted\n5. Timeout → kicked (if configured)', { parse_mode: 'HTML' });
        } catch (error) { console.error('welcomemutehelp error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
