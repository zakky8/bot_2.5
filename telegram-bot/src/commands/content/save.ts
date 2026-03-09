import { Bot } from 'grammy';
import { BotContext } from '../../types';

const notes = new Map<string, Map<string, string>>();
export const getNotes = (chatId: number) => notes.get(String(chatId)) || new Map();
export const setNote = (chatId: number, name: string, content: string) => {
    if (!notes.has(String(chatId))) notes.set(String(chatId), new Map());
    notes.get(String(chatId))!.set(name.toLowerCase(), content);
};
export const deleteNote = (chatId: number, name: string) => notes.get(String(chatId))?.delete(name.toLowerCase());

export default (bot: Bot<BotContext>) => {
    bot.command('save', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            const admins = await ctx.getChatAdministrators();
            if (!admins.some(a => a.user.id === ctx.from?.id)) return ctx.reply('❌ Admin only.');
            const args = ctx.message?.text?.split(' ').slice(1) || [];
            const name = args[0]?.toLowerCase();
            const content = args.slice(1).join(' ') || ctx.message?.reply_to_message?.text;
            if (!name || !content) return ctx.reply('Usage: /save <name> <content>\nOr reply to a message: /save <name>');
            setNote(ctx.chat.id, name, content);
            await ctx.reply(`✅ Note <code>${name}</code> saved!`, { parse_mode: 'HTML' });
        } catch (error) { console.error('save error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
