import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('unmute', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('This command can only be used in groups.');
            const admins = await ctx.getChatAdministrators();
            if (!admins.some(a => a.user.id === ctx.from?.id)) return ctx.reply('❌ You need admin permissions.');

            const reply = ctx.message?.reply_to_message;
            if (!reply) return ctx.reply('❌ Reply to a message to unmute that user.');
            const targetId = reply.from?.id;
            if (!targetId) return ctx.reply('❌ Could not identify the user.');

            await ctx.restrictChatMember(targetId, { can_send_messages: true, can_send_other_messages: true, can_add_web_page_previews: true, can_send_polls: true, can_invite_users: true, can_change_info: false, can_pin_messages: false });

            await ctx.reply(`🔊 <b>${reply.from?.first_name}</b> has been unmuted by <b>${ctx.from?.first_name}</b>.`, { parse_mode: 'HTML' });
        } catch (error) { console.error('unmute error:', error); await ctx.reply('❌ Failed to unmute the user.'); }
    });
};
