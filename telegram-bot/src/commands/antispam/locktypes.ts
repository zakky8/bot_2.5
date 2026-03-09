import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('locktypes', async (ctx: BotContext) => {
        try {
            await ctx.reply('🔒 <b>Available Lock Types</b>\n\n• <code>all</code> — Lock all messaging\n• <code>media</code> — Lock media/stickers/GIFs\n• <code>stickers</code> — Lock stickers only\n• <code>links</code> — Lock link previews\n• <code>polls</code> — Lock polls\n• <code>invite</code> — Lock invite links\n• <code>info</code> — Lock group info changes\n• <code>pin</code> — Lock pinning messages\n\nUsage: /lock <type> or /unlock <type>', { parse_mode: 'HTML' });
        } catch (error) { console.error('locktypes error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
