// shared/services/ai/AIService.ts
import { OpenRouter } from '@openrouter/sdk';
import { Ollama } from 'ollama';
import { Redis } from 'ioredis';
import { Logger } from 'winston';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  content: string;
  model: string;
  provider: 'openrouter' | 'ollama';
  tokensUsed?: number;
  cost?: number;
}

export interface AIConfig {
  openrouterApiKey?: string;
  ollamaHost?: string;
  defaultModel?: string;
  fallbackModel?: string;
  maxTokens?: number;
  temperature?: number;
  rateLimit?: {
    maxRequests: number;
    windowMs: number;
  };
}

export interface ConversationContext {
  userId: string;
  chatId?: string;
  platform: 'discord' | 'telegram';
  messages: AIMessage[];
  systemPrompt?: string;
}

interface LogEntry {
  timestamp: number;
  userId: string;
  chatId?: string;
  platform: 'discord' | 'telegram';
  model: string;
  provider: 'openrouter' | 'ollama';
  tokensUsed: number;
  cost: number;
}

interface UsageStats {
  totalRequests: number;
  totalTokens: number;
  totalCost: number;
  byProvider: {
    openrouter: number;
    ollama: number;
  };
  uniqueUsers: number;
}

export class AIService {
  private openRouter?: OpenRouter;
  private ollama?: Ollama;
  private redis: Redis | any;
  private logger: Logger;
  private config: Required<AIConfig>;

  constructor(config: AIConfig, redis: Redis | any, logger: Logger) {
    this.redis = redis;
    this.logger = logger;

    // Set default configuration
    this.config = {
      openrouterApiKey: config.openrouterApiKey || '',
      ollamaHost: config.ollamaHost || 'http://localhost:11434',
      defaultModel: config.defaultModel || 'anthropic/claude-sonnet-4',
      fallbackModel: config.fallbackModel || 'llama3.2:3b',
      maxTokens: config.maxTokens || 2000,
      temperature: config.temperature || 0.7,
      rateLimit: config.rateLimit || {
        maxRequests: 20,
        windowMs: 3600000, // 1 hour
      },
    };

    // Initialize OpenRouter if API key is provided
    if (this.config.openrouterApiKey) {
      try {
        this.openRouter = new OpenRouter({
          apiKey: this.config.openrouterApiKey,
        });
        this.logger.info('OpenRouter initialized successfully');
      } catch (error) {
        this.logger.error('Failed to initialize OpenRouter:', error);
      }
    }

    // Initialize Ollama
    try {
      this.ollama = new Ollama({
        host: this.config.ollamaHost,
      });
      this.logger.info('Ollama initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Ollama:', error);
    }
  }

  /**
   * Check if user has exceeded rate limit
   */
  private async checkRateLimit(userId: string): Promise<boolean> {
    const key = `ai:ratelimit:${userId}`;
    const current = await this.redis.get(key);

    if (!current) {
      await this.redis.setex(
        key,
        Math.floor(this.config.rateLimit.windowMs / 1000),
        '1'
      );
      return true;
    }

    const count = parseInt(current, 10);
    if (count >= this.config.rateLimit.maxRequests) {
      return false;
    }

    await this.redis.incr(key);
    return true;
  }

  /**
   * Get or create conversation context
   */
  async getConversationContext(
    userId: string,
    chatId?: string,
    platform: 'discord' | 'telegram' = 'discord'
  ): Promise<ConversationContext> {
    const key = `ai:conversation:${platform}:${chatId || userId}:${userId}`;
    const data = await this.redis.get(key);

    if (data) {
      try {
        return JSON.parse(data);
      } catch (error) {
        this.logger.error('Failed to parse conversation context:', error);
      }
    }

    // Create new context
    const context: ConversationContext = {
      userId,
      chatId,
      platform,
      messages: [],
    };

    return context;
  }

  /**
   * Save conversation context
   */
  async saveConversationContext(
    context: ConversationContext,
    ttl: number = 3600 // 1 hour default
  ): Promise<void> {
    const key = `ai:conversation:${context.platform}:${context.chatId || context.userId}:${context.userId}`;

    // Keep only last 10 messages to prevent context from growing too large
    const trimmedContext = {
      ...context,
      messages: context.messages.slice(-10),
    };

    await this.redis.setex(key, ttl, JSON.stringify(trimmedContext));
  }

  /**
   * Clear conversation context
   */
  async clearConversationContext(
    userId: string,
    chatId?: string,
    platform: 'discord' | 'telegram' = 'discord'
  ): Promise<void> {
    const key = `ai:conversation:${platform}:${chatId || userId}:${userId}`;
    await this.redis.del(key);
  }

  /**
   * Generate AI response using OpenRouter
   */
  private async generateWithOpenRouter(
    messages: AIMessage[],
    model?: string
  ): Promise<AIResponse> {
    if (!this.openRouter) {
      throw new Error('OpenRouter not initialized');
    }

    const modelToUse = model || this.config.defaultModel;

    try {
      const response: any = await this.openRouter.chat.send({
        model: modelToUse,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      } as any);

      const choice = response.choices?.[0];
      if (!choice || !choice.message?.content) {
        throw new Error('Invalid response from OpenRouter');
      }

      return {
        content: choice.message.content,
        model: modelToUse,
        provider: 'openrouter',
        tokensUsed: response.usage?.total_tokens,
        cost: (response as any).cost, // Cost if available
      };
    } catch (error) {
      this.logger.error('OpenRouter generation failed:', error);
      throw error;
    }
  }

  /**
   * Generate AI response using Ollama
   */
  private async generateWithOllama(
    messages: AIMessage[],
    model?: string
  ): Promise<AIResponse> {
    if (!this.ollama) {
      throw new Error('Ollama not initialized');
    }

    const modelToUse = model || this.config.fallbackModel;

    try {
      const response = await this.ollama.chat({
        model: modelToUse,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        options: {
          temperature: this.config.temperature,
          num_predict: this.config.maxTokens,
        },
      });

      if (!response.message?.content) {
        throw new Error('Invalid response from Ollama');
      }

      return {
        content: response.message.content,
        model: modelToUse,
        provider: 'ollama',
      };
    } catch (error) {
      this.logger.error('Ollama generation failed:', error);
      throw error;
    }
  }

  /**
   * Generate AI response with automatic fallback
   */
  async chat(
    context: ConversationContext,
    userMessage: string,
    options?: {
      model?: string;
      useOllamaOnly?: boolean;
      saveContext?: boolean;
    }
  ): Promise<AIResponse> {
    // Check rate limit
    const canProceed = await this.checkRateLimit(context.userId);
    if (!canProceed) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    // Add user message to context
    const messages: AIMessage[] = [...context.messages];

    // Add system prompt if provided
    if (context.systemPrompt && messages.length === 0) {
      messages.push({
        role: 'system',
        content: context.systemPrompt,
      });
    }

    messages.push({
      role: 'user',
      content: userMessage,
    });

    let response: AIResponse;

    try {
      // Try OpenRouter first unless Ollama-only is specified
      if (!options?.useOllamaOnly && this.openRouter) {
        response = await this.generateWithOpenRouter(messages, options?.model);
      } else if (this.ollama) {
        response = await this.generateWithOllama(messages, options?.model);
      } else {
        throw new Error('No AI provider available');
      }
    } catch (error) {
      // Fallback to Ollama if OpenRouter fails
      if (!options?.useOllamaOnly && this.ollama) {
        this.logger.warn('Falling back to Ollama due to OpenRouter error');
        try {
          response = await this.generateWithOllama(messages);
        } catch (fallbackError) {
          this.logger.error('Ollama fallback also failed:', fallbackError);
          throw new Error('All AI providers failed. Please try again later.');
        }
      } else {
        throw error;
      }
    }

    // Save conversation context if requested
    if (options?.saveContext !== false) {
      const updatedContext = {
        ...context,
        messages: [
          ...messages,
          {
            role: 'assistant' as const,
            content: response.content,
          },
        ],
      };
      await this.saveConversationContext(updatedContext);
    }

    // Log usage
    await this.logUsage(context, response);

    return response;
  }

  /**
   * Log AI usage for analytics
   */
  private async logUsage(
    context: ConversationContext,
    response: AIResponse
  ): Promise<void> {
    const logKey = `ai:usage:${context.platform}:${new Date().toISOString().split('T')[0]}`;

    const logEntry = {
      timestamp: Date.now(),
      userId: context.userId,
      chatId: context.chatId,
      platform: context.platform,
      model: response.model,
      provider: response.provider,
      tokensUsed: response.tokensUsed || 0,
      cost: response.cost || 0,
    };

    // Store in Redis list (with 30-day expiry)
    await this.redis.lpush(logKey, JSON.stringify(logEntry));
    await this.redis.expire(logKey, 30 * 24 * 60 * 60);
  }

  /**
   * Get AI usage stats
   */
  async getUsageStats(
    platform?: 'discord' | 'telegram',
    date?: string
  ): Promise<any> {
    const dateStr = date || new Date().toISOString().split('T')[0];
    const key = platform
      ? `ai:usage:${platform}:${dateStr}`
      : `ai:usage:*:${dateStr}`;

    if (key.includes('*')) {
      // Get keys matching pattern
      const keys = await this.redis.keys(key);
      const allLogs = [];

      for (const k of keys) {
        const logs = await this.redis.lrange(k, 0, -1);
        allLogs.push(...logs.map((l: string) => JSON.parse(l)));
      }

      return this.aggregateStats(allLogs);
    } else {
      const logs = await this.redis.lrange(key, 0, -1);
      return this.aggregateStats(logs.map((l: string) => JSON.parse(l)));
    }
  }

  /**
   * Aggregate usage statistics
   */
  private aggregateStats(logs: LogEntry[]): UsageStats {
    return {
      totalRequests: logs.length,
      totalTokens: logs.reduce((sum, log) => sum + (log.tokensUsed || 0), 0),
      totalCost: logs.reduce((sum, log) => sum + (log.cost || 0), 0),
      byProvider: {
        openrouter: logs.filter((l) => l.provider === 'openrouter').length,
        ollama: logs.filter((l) => l.provider === 'ollama').length,
      },
      uniqueUsers: new Set(logs.map((l) => l.userId)).size,
    };
  }

  /**
   * List available models
   */
  async listAvailableModels(): Promise<{ openrouter: string[]; ollama: string[] }> {
    const result = {
      openrouter: [] as string[],
      ollama: [] as string[],
    };

    // Get OpenRouter models (cached list)
    if (this.openRouter) {
      result.openrouter = [
        'anthropic/claude-sonnet-4',
        'anthropic/claude-opus-4',
        'openai/gpt-4',
        'openai/gpt-4-turbo',
        'google/gemini-pro',
        'meta-llama/llama-3.1-70b-instruct',
        'mistralai/mixtral-8x7b-instruct',
      ];
    }

    // Get Ollama models
    if (this.ollama) {
      try {
        const models = await this.ollama.list();
        result.ollama = models.models.map((m) => m.name);
      } catch (error) {
        this.logger.error('Failed to list Ollama models:', error);
      }
    }

    return result;
  }

  /**
   * Test connection to AI providers
   */
  async testConnection(): Promise<{
    openrouter: boolean;
    ollama: boolean;
  }> {
    const result = {
      openrouter: false,
      ollama: false,
    };

    // Test OpenRouter
    if (this.openRouter) {
      try {
        await this.generateWithOpenRouter(
          [{ role: 'user', content: 'test' }],
          this.config.defaultModel
        );
        result.openrouter = true;
      } catch (error) {
        this.logger.error('OpenRouter connection test failed:', error);
      }
    }

    // Test Ollama
    if (this.ollama) {
      try {
        await this.ollama.list();
        result.ollama = true;
      } catch (error) {
        this.logger.error('Ollama connection test failed:', error);
      }
    }

    return result;
  }
}

export default AIService;
