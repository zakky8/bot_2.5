import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('mute', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('This command can only be used in groups.');

            const admins = await ctx.getChatAdministrators();
            const isAdmin = admins.some(a => a.user.id === ctx.from?.id);
            if (!isAdmin) return ctx.reply('❌ You need admin permissions.');

            const reply = ctx.message?.reply_to_message;
            if (!reply) return ctx.reply('❌ Reply to a message to mute that user.');
            const targetId = reply.from?.id;
            if (!targetId) return ctx.reply('❌ Could not identify the user.');

            const targetAdmin = admins.find(a => a.user.id === targetId);
            if (targetAdmin) return ctx.reply('❌ Cannot mute an admin.');

            // Parse duration: /mute 1h, /mute 30m, /mute 1d
            const args = ctx.message?.text?.split(' ').slice(1) || [];
            let duration = 3600; // Default 1 hour
            if (args[0]) {
                const match = args[0].match(/^(\d+)([mhd])$/);
                if (match) {
                    const val = parseInt(match[1]);
                    const unit = match[2];
                    duration = unit === 'm' ? val * 60 : unit === 'h' ? val * 3600 : val * 86400;
                }
            }

            const untilDate = Math.floor(Date.now() / 1000) + duration;
            await ctx.restrictChatMember(targetId, { can_send_messages: false, can_send_other_messages: false, can_add_web_page_previews: false }, { until_date: untilDate });

            const durationStr = duration < 3600 ? `${duration / 60}m` : duration < 86400 ? `${duration / 3600}h` : `${duration / 86400}d`;
            await ctx.reply(
                `🔇 <b>User Muted</b>\n` +
                `├ <b>User:</b> ${reply.from?.first_name || 'Unknown'}\n` +
                `├ <b>Duration:</b> ${durationStr}\n` +
                `└ <b>By:</b> ${ctx.from?.first_name}`,
                { parse_mode: 'HTML' }
            );
        } catch (error) {
            console.error('mute error:', error);
            await ctx.reply('❌ Failed to mute the user.');
        }
    });
};
