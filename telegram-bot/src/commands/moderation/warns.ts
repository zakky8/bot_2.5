import { Bot } from 'grammy';
import { BotContext } from '../../types';

const warnings = new Map<string, Array<{ by: string; reason: string; date: Date }>>();
export const getTgWarnings = (chatId: number, userId: number) => warnings.get(`${chatId}:${userId}`) || [];
export const addTgWarning = (chatId: number, userId: number, by: string, reason: string) => {
    const key = `${chatId}:${userId}`;
    const w = warnings.get(key) || [];
    w.push({ by, reason, date: new Date() });
    warnings.set(key, w);
    return w.length;
};
export const clearTgWarnings = (chatId: number, userId: number) => warnings.delete(`${chatId}:${userId}`);
export const removeTgWarning = (chatId: number, userId: number, index: number) => {
    const key = `${chatId}:${userId}`;
    const w = warnings.get(key) || [];
    if (index >= 0 && index < w.length) { w.splice(index, 1); warnings.set(key, w); return true; }
    return false;
};

export default (bot: Bot<BotContext>) => {
    bot.command('warns', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            const reply = ctx.message?.reply_to_message;
            const targetId = reply?.from?.id || ctx.from?.id;
            if (!targetId) return ctx.reply('❌ Reply to a user or use in a group.');

            const w = getTgWarnings(ctx.chat.id, targetId);
            if (w.length === 0) return ctx.reply('✅ This user has no warnings.');

            const list = w.map((w, i) => `${i + 1}. ${w.reason} (by ${w.by}, ${w.date.toLocaleDateString()})`).join('\n');
            await ctx.reply(`⚠️ <b>Warnings for ${reply?.from?.first_name || 'user'}:</b>\n\n${list}\n\n<b>Total:</b> ${w.length}`, { parse_mode: 'HTML' });
        } catch (error) { console.error('warns error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
