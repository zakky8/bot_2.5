import { Bot } from 'grammy';
import { BotContext } from '../../types';
import { aiService } from '../../core/ai';

export default (bot: Bot<BotContext>) => {
  bot.command('aisetup', async (ctx: BotContext) => {
    try {
      // Only allow in private chats with bot owner/admin
      if (ctx.chat && ctx.chat.type !== 'private') {
        return ctx.reply('🔒 This command only works in private chat with the bot (for security)');
      }

      // Get command arguments
      const rawArgs = (ctx.match as string)?.trim() || '';
      const args = rawArgs.split(' ').filter(a => a.length > 0);

      if (!args[0]) {
        return ctx.reply(
          '🤖 *AI Setup Command*\n\n' +
          '*Usage:*\n' +
          '`/aisetup key <your_openrouter_key>`\n' +
          '`/aisetup model <model_name>`\n' +
          '`/aisetup test`\n' +
          '`/aisetup status`\n\n' +
          '*Examples:*\n' +
          '`/aisetup key sk_your_actual_key_here`\n' +
          '`/aisetup model anthropic/claude-3-sonnet`\n\n' +
          '*Available Models:*\n' +
          '• `anthropic/claude-3-haiku` (fast)\n' +
          '• `anthropic/claude-3-sonnet` (balanced)\n' +
          '• `anthropic/claude-3-opus` (powerful)\n' +
          '• `openai/gpt-4`\n' +
          '• `meta-llama/llama-2-70b`',
          { parse_mode: 'Markdown' }
        );
      }

      const command = args[0].toLowerCase();
      const value = args.slice(1).join(' ');

      // Store in environment for this session
      if (command === 'key') {
        if (!value) {
          return ctx.reply('❌ Please provide an API key: `/aisetup key sk_...`');
        }
        // @ts-ignore
        process.env.OPENROUTER_API_KEY = value;
        const keyMsg = '✅ API Key set! (This session only)\n\nTo make it permanent, add to .env:\nOPENROUTER_API_KEY=' + value;
        return ctx.reply(keyMsg);
      }

      if (command === 'model') {
        if (!value) {
          return ctx.reply('❌ Please provide a model name:\n`/aisetup model anthropic/claude-3-haiku`');
        }
        // @ts-ignore
        process.env.OPENROUTER_MODEL = value;
        const envMsg = '✅ Model changed to: ' + value + '\n\nTo make it permanent, add to .env:\nOPENROUTER_MODEL=' + value;
        return ctx.reply(envMsg);
      }

      if (command === 'status') {
        const hasKey = !!process.env.OPENROUTER_API_KEY;
        const model = process.env.OPENROUTER_MODEL || 'anthropic/claude-3-haiku';
        const statusMsg = '🤖 *AI Status*\n\n' +
          `• API Key: ${hasKey ? '✅ Set' : '❌ Not set'}\n` +
          `• Model: ${model}\n` +
          `• Status: ${hasKey ? '✅ Ready to chat' : '❌ Need API key'}\n\n` +
          (hasKey ? 'Try `/chat hello` to start!' : 'Set key with: `/aisetup key sk_...`');
        return ctx.reply(statusMsg, { parse_mode: 'Markdown' });
      }

      if (command === 'test') {
        if (!process.env.OPENROUTER_API_KEY) {
          return ctx.reply('❌ API key not set. Use: `/aisetup key sk_...`');
        }

        await ctx.replyWithChatAction('typing');
        try {
          const userId = ctx.from?.id?.toString() || 'test-user';
          const context = {
            userId,
            chatId: ctx.chat?.id.toString(),
            platform: 'telegram' as const,
            messages: [],
          };
          const response = await aiService.chat(context, 'Say "Hello! AI is working!" in exactly 5 words.');
          return ctx.reply(`✅ *AI Test Successful*\n\n_Response:_\n${response.content}`);
        } catch (error) {
          return ctx.reply(`❌ *AI Test Failed*\n\n_Error:_ Check if the API key is valid\n\`${String(error).substring(0, 100)}\``);
        }
      }

      return ctx.reply('❓ Unknown command. Use `/aisetup` for help.');

    } catch (error) {
      console.error('aisetup error:', error);
      await ctx.reply('❌ An error occurred: ' + String(error).substring(0, 100));
    }
  });
};
