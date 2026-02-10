import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('id', async (ctx: BotContext) => {
        try {
            const reply = ctx.message?.reply_to_message;
            const target = reply?.from || ctx.from;
            if (!target) return ctx.reply('❌ Could not identify user.');
            let text = `🆔 <b>ID Information</b>\n\n├ <b>User:</b> ${target.first_name}\n├ <b>User ID:</b> <code>${target.id}</code>`;
            if (ctx.chat && ctx.chat.type !== 'private') {
                text += `\n├ <b>Chat:</b> ${ctx.chat.title || 'N/A'}\n└ <b>Chat ID:</b> <code>${ctx.chat.id}</code>`;
            } else { text += `\n└ <b>Chat ID:</b> <code>${ctx.chat?.id || 'N/A'}</code>`; }
            await ctx.reply(text, { parse_mode: 'HTML' });
        } catch (error) { console.error('id error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
