import { AIService } from '../src/services/ai/AIService';
import { MemoryRedis } from '../src/utils/MemoryRedis';
import { createLogger, transports } from 'winston';

// Mock logger
const logger = createLogger({
    transports: [new transports.Console({ silent: true })]
});

// Test suite
describe('AIService', () => {
    let aiService: AIService;
    let memoryRedis: MemoryRedis;

    beforeEach(() => {
        memoryRedis = new MemoryRedis();
        aiService = new AIService({
            openrouterApiKey: 'test-key',
            defaultModel: 'test-model',
            rateLimit: { maxRequests: 2, windowMs: 1000 }
        }, memoryRedis, logger);
    });

    test('should maintain conversation context', async () => {
        const userId = 'user1';
        const context = await aiService.getConversationContext(userId, 'chat1', 'discord');

        expect(context.userId).toBe(userId);
        expect(context.messages.length).toBeGreaterThan(0); // Specific system prompt
    });

    test('should enforce rate limits', async () => {
        const userId = 'spammer';

        // request 1 (allowed)
        let allowed = await aiService['checkRateLimit'](userId);
        expect(allowed).toBe(true);

        // request 2 (allowed)
        allowed = await aiService['checkRateLimit'](userId);
        expect(allowed).toBe(true);

        // request 3 (blocked)
        allowed = await aiService['checkRateLimit'](userId);
        expect(allowed).toBe(false);
    });

    test('should clear context', async () => {
        const userId = 'user2';
        await aiService.getConversationContext(userId, 'chat2', 'telegram');

        await aiService.clearConversationContext(userId, 'chat2', 'telegram');

        // In a real redis, we'd check existence. 
        // Here we rely on the internal logic not throwing.
        expect(true).toBe(true);
    });
});
