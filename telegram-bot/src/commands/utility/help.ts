import { Bot } from 'grammy';
import { BotContext } from '../../types';

export default (bot: Bot<BotContext>) => {
    bot.command('help', async (ctx: BotContext) => {
        try {
            await ctx.reply(
                `📚 <b>Command List</b>\n\n` +
                `<b>🛡 Moderation:</b>\n/kick /mute /unmute /warns /unwarn /resetwarns /purge /spurge /purgefrom /slowmode /pin /unpin /unpinall /adminlist /report\n\n` +
                `<b>⚙️ Admin:</b>\n/promote /demote /title /setlog /unsetlog /setdesc /setgtitle /setgpic /setsticker /delsticker /invitelink\n\n` +
                `<b>🔒 Anti-Spam:</b>\n/setflood /setfloodmode /flood /addblacklist /unblacklist /blacklist /blacklistmode /lock /unlock /locks /setcaptcha /captchamode /setantiraid\n\n` +
                `<b>👋 Greetings:</b>\n/welcome /setwelcome /resetwelcome /goodbye /setgoodbye /resetgoodbye /cleanwelcome /cleanservice /welcomemute\n\n` +
                `<b>📝 Content:</b>\n/save /get /notes /clear /clearall /filter /filters /stop /stopall /rules /setrules /clearrules\n\n` +
                `<b>🌐 Federation:</b>\n/newfed /delfed /joinfed /leavefed /fban /unfban /fedinfo /fedadmins /fedbanlist /fedpromote /feddemote\n\n` +
                `<b>🔧 Utility:</b>\n/help /id /info /ping /stats /settings /connect /disconnect\n\n` +
                `<b>🎮 Fun:</b>\n/roll /slap /hug /pat /runs`,
                { parse_mode: 'HTML' }
            );
        } catch (error) { console.error('help error:', error); await ctx.reply('❌ An error occurred.'); }
    });
};
