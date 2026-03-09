import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('zombies', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            const admins = await ctx.getChatAdministrators();
            if (!admins.some(a => a.user.id === ctx.from?.id)) return ctx.reply('❌ Admin only.');
            await ctx.reply('🧟 <b>Zombie Cleanup</b>\n\nScanning for deleted accounts...\n\n<i>Note: Telegram API limits prevent full member scanning. Deleted accounts are shown as "Deleted Account" in the member list. Remove them manually or use /kick when you find one.</i>', { parse_mode: 'HTML' });
        } catch (error) { console.error('zombies error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
