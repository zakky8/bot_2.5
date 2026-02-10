import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('locks', async (ctx: BotContext) => {
        try {
            if (!ctx.chat || ctx.chat.type === 'private') return ctx.reply('Groups only.');

            const locks = ctx.session.locks || {};

            const formatLock = (key: string, type: string) => {
                const val = locks[type as keyof typeof locks];
                return `${val ? '🔒' : '🔓'} ${key}`;
            };

            const status = [
                formatLock('Messages', 'all'),
                formatLock('Media', 'media'),
                formatLock('Stickers', 'stickers'),
                formatLock('Links', 'links'),
                formatLock('Polls', 'polls'),
                formatLock('Invite', 'invite'),
                formatLock('Info', 'info'),
                `└ ${locks['pin'] ? 'Pin: 🔒 Locked' : 'Pin: 🔓 Unlocked'}` // Last one with different prefix
            ].join('\n');

            await ctx.reply(`🔒 <b>Current Locks</b>\n\n${status}\n\nUse /lock <type> or /unlock <type>`, { parse_mode: 'HTML' });
        } catch (error) { console.error('locks error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
