import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('kick', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') {
                return ctx.reply('This command can only be used in groups.');
            }

            const admins = await ctx.getChatAdministrators();
            const isAdmin = admins.some(a => a.user.id === ctx.from?.id);
            if (!isAdmin) return ctx.reply('❌ You need admin permissions to use this command.');

            const reply = ctx.message?.reply_to_message;
            if (!reply) return ctx.reply('❌ Reply to a message to kick that user.');

            const targetId = reply.from?.id;
            if (!targetId) return ctx.reply('❌ Could not identify the user.');

            const botMember = admins.find(a => a.user.id === ctx.me.id);
            if (!botMember) return ctx.reply('❌ I need admin permissions to kick users.');

            const targetAdmin = admins.find(a => a.user.id === targetId);
            if (targetAdmin) return ctx.reply('❌ Cannot kick an admin.');

            const reason = ctx.message?.text?.split(' ').slice(1).join(' ') || 'No reason provided';

            await ctx.banChatMember(targetId);
            await ctx.unbanChatMember(targetId); // Unban immediately = kick

            await ctx.reply(
                `👢 <b>User Kicked</b>\n` +
                `├ <b>User:</b> ${reply.from?.first_name || 'Unknown'}\n` +
                `├ <b>By:</b> ${ctx.from?.first_name}\n` +
                `└ <b>Reason:</b> ${reason}`,
                { parse_mode: 'HTML' }
            );
        } catch (error) {
            console.error('kick error:', error);
            await ctx.reply('❌ Failed to kick the user. Check bot permissions.');
        }
    });
};
