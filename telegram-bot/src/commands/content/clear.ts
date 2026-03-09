import { Bot } from 'grammy';
import { BotContext } from '../../types';
import { deleteNote, getNotes } from './save';

export default (bot: Bot<BotContext>) => {
    bot.command('clear', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            const admins = await ctx.getChatAdministrators();
            if (!admins.some(a => a.user.id === ctx.from?.id)) return ctx.reply('❌ Admin only.');
            const args = ctx.message?.text?.split(' ').slice(1) || [];
            const name = args[0]?.toLowerCase();
            if (!name) return ctx.reply('Usage: /clear <note name>');
            const notes = getNotes(ctx.chat.id);
            if (!notes.has(name)) return ctx.reply(`❌ Note <code>${name}</code> not found.`, { parse_mode: 'HTML' });
            deleteNote(ctx.chat.id, name);
            await ctx.reply(`✅ Note <code>${name}</code> deleted.`, { parse_mode: 'HTML' });
        } catch (error) { console.error('clear error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
