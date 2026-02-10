import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('ban', async (ctx: BotContext) => {
        if (!ctx.chat || ctx.chat.type === 'private') {
            return ctx.reply('This command can only be used in groups.');
        }

        if (!ctx.from) return;

        // Check if user is admin
        const member = await ctx.getChatMember(ctx.from.id);
        if (!['creator', 'administrator'].includes(member.status)) {
            return ctx.reply('❌ You need to be an admin to use this command.');
        }

        const replyTo = ctx.message?.reply_to_message;
        if (!replyTo) {
            return ctx.reply('❌ Reply to a message from the user you want to ban.');
        }

        const userToBan = replyTo.from;
        if (!userToBan) {
            return ctx.reply('❌ Could not identify the user.');
        }

        try {
            await ctx.banChatMember(userToBan.id);
            await ctx.reply(
                `✅ Banned ${userToBan.first_name}\n` +
                `👤 User ID: ${userToBan.id}\n` +
                `👮 Banned by: ${ctx.from.first_name}`
            );
        } catch (error) {
            console.error('Ban error:', error);
            await ctx.reply('❌ Failed to ban the user. Make sure the bot has admin rights.');
        }
    });
};
