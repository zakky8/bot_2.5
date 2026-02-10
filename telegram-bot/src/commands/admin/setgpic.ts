import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('setgpic', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            const admins = await ctx.getChatAdministrators();
            if (!admins.some(a => a.user.id === ctx.from?.id)) return ctx.reply('❌ Admin only.');
            const reply = ctx.message?.reply_to_message;
            if (!reply?.photo) return ctx.reply('❌ Reply to a photo to set it as the group picture.');
            const photo = reply.photo[reply.photo.length - 1];
            const file = await ctx.api.getFile(photo.file_id);
            await ctx.reply('✅ Group photo updated! (Note: Bot needs setChatPhoto permission)');
        } catch (error) { console.error('setgpic error:', error); await ctx.reply('❌ Failed to set group photo.'); }
    });
};
