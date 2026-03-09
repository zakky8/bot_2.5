import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('info', async (ctx: BotContext) => {
        try {
            const reply = ctx.message?.reply_to_message;
            const target = reply?.from || ctx.from;
            if (!target) return ctx.reply('❌ Could not identify user.');
            let text = `ℹ️ <b>User Info</b>\n\n` +
                `├ <b>Name:</b> ${target.first_name}${target.last_name ? ' ' + target.last_name : ''}\n` +
                `├ <b>Username:</b> ${target.username ? '@' + target.username : 'None'}\n` +
                `├ <b>ID:</b> <code>${target.id}</code>\n` +
                `└ <b>Bot:</b> ${target.is_bot ? 'Yes' : 'No'}`;
            if (ctx.chat && ctx.chat.type !== 'private') {
                try {
                    const member = await ctx.getChatMember(target.id);
                    text += `\n\n<b>Chat Status:</b> ${member.status}`;
                } catch { /* ignore */ }
            }
            await ctx.reply(text, { parse_mode: 'HTML' });
        } catch (error) { console.error('info error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
