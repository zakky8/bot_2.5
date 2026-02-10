import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('connect', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type !== 'private') return ctx.reply('❌ Use this command in DM to remotely manage a group.');
            const args = ctx.message?.text?.split(' ').slice(1) || [];
            const chatId = args[0];
            if (!chatId) return ctx.reply('Usage: /connect <chat ID>\nSend the chat ID of the group you want to manage remotely.');
            await ctx.reply(`✅ Connected to chat <code>${chatId}</code>.\nYou can now use admin commands here to manage that group.`, { parse_mode: 'HTML' });
        } catch (error) { console.error('connect error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
