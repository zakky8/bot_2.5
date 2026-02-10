import { Bot } from 'grammy';
import { BotContext } from '../../types';
import { getNotes } from './save';

export default (bot: Bot<BotContext>) => {
    bot.command('get', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');
            const args = ctx.message?.text?.split(' ').slice(1) || [];
            const name = args[0]?.toLowerCase();
            if (!name) return ctx.reply('Usage: /get <note name>');
            const notes = getNotes(ctx.chat.id);
            const content = notes.get(name);
            if (!content) return ctx.reply(`❌ Note <code>${name}</code> not found.`, { parse_mode: 'HTML' });
            await ctx.reply(content);
        } catch (error) { console.error('get error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
