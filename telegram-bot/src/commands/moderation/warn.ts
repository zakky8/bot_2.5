import { Bot } from 'grammy';
import { BotContext } from '../../types';
import { query } from '../../core/database';

export default (bot: Bot<BotContext>) => {
    bot.command('warn', async (ctx: BotContext) => {
        if (!ctx.chat || ctx.chat.type === 'private') {
            return ctx.reply('This command can only be used in groups.');
        }

        if (!ctx.from) return;

        const member = await ctx.getChatMember(ctx.from.id);
        if (!['creator', 'administrator'].includes(member.status)) {
            return ctx.reply('❌ You need to be an admin to use this command.');
        }

        const replyTo = ctx.message?.reply_to_message;
        if (!replyTo) {
            return ctx.reply('❌ Reply to a message from the user you want to warn.');
        }

        const userToWarn = replyTo.from;
        if (!userToWarn) return;

        const reason = ctx.message?.text?.split(' ').slice(1).join(' ') || 'No reason provided';

        try {
            // Add warning to database
            await query(
                'INSERT INTO warnings (user_id, chat_id, reason, warned_by, created_at) VALUES ($1, $2, $3, $4, NOW())',
                [userToWarn.id, ctx.chat.id, reason, ctx.from.id]
            );

            // Get warning count
            const result = await query(
                'SELECT COUNT(*) as count FROM warnings WHERE user_id = $1 AND chat_id = $2',
                [userToWarn.id, ctx.chat.id]
            );

            const warningCount = parseInt(result.rows[0].count);

            await ctx.reply(
                `⚠️ Warning issued!\n\n` +
                `👤 User: ${userToWarn.first_name}\n` +
                `📝 Reason: ${reason}\n` +
                `🔢 Total warnings: ${warningCount}/3\n` +
                `👮 Warned by: ${ctx.from.first_name}`
            );

            // Auto-ban at 3 warnings
            if (warningCount >= 3) {
                await ctx.banChatMember(userToWarn.id);
                await ctx.reply(`🚫 User banned after reaching 3 warnings!`);
            }
        } catch (error) {
            console.error('Warn error:', error);
            await ctx.reply('❌ Failed to issue warning.');
        }
    });
};
