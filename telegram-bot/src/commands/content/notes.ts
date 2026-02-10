import { Bot } from 'grammy';
import { BotContext } from '../../types';
import { getNotes } from './save';

export default (bot: Bot<BotContext>) => {
    bot.command('notes', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            const notes = getNotes(ctx.chat.id);
            if (notes.size === 0) return ctx.reply('📝 No notes saved. Use /save <name> <content> to create one.');
            const list = [...notes.keys()].map(n => `• <code>${n}</code>`).join('\n');
            await ctx.reply(`📝 <b>Saved Notes (${notes.size}):</b>\n\n${list}\n\nUse /get <name> to retrieve a note.`, { parse_mode: 'HTML' });
        } catch (error) { console.error('notes error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
