import { Bot } from 'grammy';
import { BotContext } from '../../types';
import { aiService, reinitializeAIService } from '../../core/ai';

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
          '🤖 *OpenRouter AI Setup*\n\n' +
          '*Usage:*\n' +
          '`/aisetup key <your_openrouter_key>`\n' +
          '`/aisetup model <model_name>`\n' +
          '`/aisetup test`\n' +
          '`/aisetup status`\n\n' +
          '*Examples:*\n' +
          '`/aisetup key sk_your_actual_key_here`\n' +
          '`/aisetup model anthropic/claude-3-opus`\n\n' +
          '*Popular Models (any OpenRouter model works):*\n' +
          '• `anthropic/claude-3-haiku` - Fast & cheap\n' +
          '• `anthropic/claude-3-sonnet` - Balanced\n' +
          '• `anthropic/claude-3-opus` - Most powerful\n' +
          '• `openai/gpt-4` - GPT-4\n' +
          '• `openai/gpt-4-turbo` - GPT-4 Turbo\n' +
          '• `openai/gpt-3.5-turbo` - GPT-3.5\n' +
          '• `google/gemini-2.0-flash` - Google Gemini\n' +
          '• `meta-llama/llama-2-70b` - Llama\n' +
          '• `mistralai/mistral-7b` - Mistral\n\n' +
          '📖 View all models: https://openrouter.ai/docs#models\n' +
          '🔑 Get API key: https://openrouter.ai/',
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
        reinitializeAIService();
        const keyMsg = '✅ API Key set! (This session only)\n✅ OpenRouter provider activated\n\n📋 *Next steps:*\n1. Set a model: `/aisetup model openai/gpt-4-turbo`\n2. Test connection: `/aisetup test`\n3. Start chatting: `/chat hello`\n\n📝 To make permanent, add to `.env`:\n`OPENROUTER_API_KEY=' + value.substring(0, 20) + '...`';
        return ctx.reply(keyMsg, { parse_mode: 'Markdown' });
      }

      if (command === 'model') {
        if (!value) {
          return ctx.reply('❌ Please provide a model name:\n`/aisetup model anthropic/claude-3-haiku`\n\n📖 All OpenRouter models supported: https://openrouter.ai/docs#models');
        }
        
        // Check if API key is set
        if (!process.env.OPENROUTER_API_KEY) {
          return ctx.reply(
            '⚠️ *Warning: No API Key Set*\n\n' +
            'You must set an OpenRouter API key first:\n' +
            '`/aisetup key sk_your_key_here`\n\n' +
            'Then you can set the model:\n' +
            '`/aisetup model ' + value + '`\n\n' +
            '📖 Get key at: https://openrouter.ai/',
            { parse_mode: 'Markdown' }
          );
        }
        
        // @ts-ignore
        process.env.OPENROUTER_MODEL = value;
        reinitializeAIService();
        const envMsg = '✅ Model changed to: `' + value + '`\n✅ AI service updated\n\n📝 To make permanent, add to `.env`:\n`OPENROUTER_MODEL=' + value + '`\n\n📖 View all models: https://openrouter.ai/docs#models';
        return ctx.reply(envMsg, { parse_mode: 'Markdown' });
      }

      if (command === 'status') {
        const hasKey = !!process.env.OPENROUTER_API_KEY;
        const model = process.env.OPENROUTER_MODEL || 'anthropic/claude-3-haiku';
        const statusMsg = '🤖 *AI Configuration Status*\n\n' +
          `🔑 *OpenRouter API:* ${hasKey ? '✅ Connected' : '❌ Not configured'}\n` +
          `🧠 *Model:* ${model}\n` +
          `📡 *Provider:* ${hasKey ? 'OpenRouter' : 'Ollama (fallback)'}\n` +
          `⚡ *Status:* ${hasKey ? '✅ Ready to chat' : '⚠️ Limited (using Ollama)'}\n\n` +
          (hasKey ? 'Try `/chat hello` to start chatting!' : 'Set API key with: `/aisetup key sk_...`');
        return ctx.reply(statusMsg, { parse_mode: 'Markdown' });
      }

      if (command === 'test') {
        if (!process.env.OPENROUTER_API_KEY) {
          return ctx.reply(
            '❌ *OpenRouter API Key Required*\n\n' +
            'Set your API key first:\n' +
            '`/aisetup key sk_your_key_here`\n\n' +
            '📖 Get key at: https://openrouter.ai/',
            { parse_mode: 'Markdown' }
          );
        }

        const model = process.env.OPENROUTER_MODEL || 'anthropic/claude-3-haiku';
        await ctx.replyWithChatAction('typing');
        try {
          const userId = ctx.from?.id?.toString() || 'test-user';
          const context = {
            userId,
            chatId: ctx.chat?.id.toString(),
            platform: 'telegram' as const,
            messages: [],
          };
          const response = await aiService.chat(context, 'Say "Hello! OpenRouter is working!" in exactly 5 words.');
          return ctx.reply(`✅ *OpenRouter Test Successful*\n\n📡 *Provider:* OpenRouter\n🧠 *Model:* ${model}\n💬 *Response:*\n${response.content}`, { parse_mode: 'Markdown' });
        } catch (error) {
          return ctx.reply(`❌ *OpenRouter Connection Failed*\n\n_Possible issues:_\n• Invalid API key\n• Rate limit exceeded\n• Model not available\n\n\`${String(error).substring(0, 100)}\``, { parse_mode: 'Markdown' });
        }
      }

      return ctx.reply('❓ Unknown command. Use `/aisetup` for help.');

    } catch (error) {
      console.error('aisetup error:', error);
      await ctx.reply('❌ An error occurred: ' + String(error).substring(0, 100));
    }
  });
};
