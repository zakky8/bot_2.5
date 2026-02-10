import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('delsticker', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            const admins = await ctx.getChatAdministrators();
            if (!admins.some((a) => a.user.id === ctx.from?.id)) return ctx.reply('❌ Admin only.');

            try {
                await ctx.deleteChatStickerSet();
                await ctx.reply('✅ Group sticker set has been removed.');
            } catch (err) {
                await ctx.reply('❌ Failed to remove sticker set. Make sure the bot is admin and has permission.');
            }
        } catch (error) { console.error('delsticker error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
