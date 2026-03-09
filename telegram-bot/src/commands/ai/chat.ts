import { Bot } from 'grammy';
import { BotContext } from '../../types';
import { aiService } from '../../core/ai';

export default (bot: Bot<BotContext>) => {
  bot.command('chat', async (ctx: BotContext) => {
    try {
      const message = (ctx.match as string)?.trim();
      const userId = ctx.from?.id?.toString() || 'unknown';

      if (!message) {
        return ctx.reply(
          '💬 *AI Chat with Memory*\n\n' +
          'Usage: `/chat <your message>`\n' +
          'Clear history: `/chat clear`\n\n' +
          '*Examples:*\n' +
          '`/chat Hello!`\n' +
          '`/chat Write a poem about coding`',
          { parse_mode: 'Markdown' }
        );
      }

      const lower = message.toLowerCase();

      if (lower === 'clear') {
        await aiService.clearConversationContext(userId, ctx.chat?.id.toString(), 'telegram');
        return ctx.reply('🗑️ Conversation history cleared!');
      }

      await ctx.replyWithChatAction('typing');

      // Attempt AI response
      try {
        const context = await aiService.getConversationContext(userId, ctx.chat?.id.toString(), 'telegram');
        const response = await aiService.chat(context, message);

        // Add assistant response to context
        context.messages.push({
          role: 'user',
          content: message,
        });
        context.messages.push({
          role: 'assistant',
          content: response.content,
        });

        // Save context for next message
        await aiService.saveConversationContext(context);

        // Split long messages if needed (Telegram limit is 4096)
        if (response.content.length > 4000) {
          const chunks = response.content.match(/.{1,4000}/g) || [];
          for (const chunk of chunks) {
            await ctx.reply(chunk);
          }
        } else {
          await ctx.reply(response.content);
        }

      } catch (aiError) {
        console.error('AI Service Error:', aiError);
        // Fallback to keyword responses if AI fails
        let fallbackResponse: string;
        if (lower.includes('hello') || lower.includes('hi')) {
          fallbackResponse = `👋 Hello ${ctx.from?.first_name}! (AI Offline)`;
        } else {
          fallbackResponse = "🤖 I'm having trouble connecting to my AI brain right now. Please try again later or check API keys.";
        }
        await ctx.reply(fallbackResponse);
      }

    } catch (error) {
      console.error('chat error:', error);
      await ctx.reply('❌ Failed to process request.');
    }
  });

  bot.command('ask', async (ctx: BotContext) => {
    // Alias for chat - just re-route logic or copy
    const message = (ctx.match as string)?.trim();
    if (!message) return ctx.reply('Usage: `/ask <question>`', { parse_mode: 'Markdown' });
    // We can just call the same logic, but for now simple redirect reply
    await ctx.reply('Please use `/chat ' + message + '`');
  });
};
