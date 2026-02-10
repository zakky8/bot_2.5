import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('unban', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('This command can only be used in groups.');

            const admins = await ctx.getChatAdministrators();
            if (!admins.some(a => a.user.id === ctx.from?.id)) return ctx.reply('❌ You need admin permissions.');

            const reply = ctx.message?.reply_to_message;
            if (!reply || !reply.from) return ctx.reply('❌ Reply to a message from the user to unban, or provide a user ID.');

            const targetId = reply.from.id;
            const targetName = reply.from.first_name || 'Unknown';

            await ctx.api.unbanChatMember(ctx.chat.id, targetId);

            await ctx.reply(
                `🔓 <b>User Unbanned</b>\n` +
                `├ <b>User:</b> ${targetName}\n` +
                `└ <b>By:</b> ${ctx.from?.first_name}`,
                { parse_mode: 'HTML' }
            );

            console.log(`[MOD] unban: ${targetName} (${targetId}) by ${ctx.from?.first_name} in ${ctx.chat.id}`);

        } catch (error) {
            console.error('unban error:', error);
            await ctx.reply('❌ Failed to unban the user.');
        }
    });
};
