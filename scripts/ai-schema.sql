-- AI Schema Migration for Bot System v2.5
-- Run this after the main database initialization

-- Create AI conversations table
CREATE TABLE IF NOT EXISTS ai_conversations (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    chat_id VARCHAR(255),
    platform VARCHAR(20) NOT NULL CHECK (platform IN ('discord', 'telegram')),
    messages JSONB NOT NULL DEFAULT '[]'::jsonb,
    system_prompt TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, chat_id, platform)
);

-- Create AI usage logs table
CREATE TABLE IF NOT EXISTS ai_usage_logs (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    chat_id VARCHAR(255),
    platform VARCHAR(20) NOT NULL CHECK (platform IN ('discord', 'telegram')),
    model VARCHAR(255) NOT NULL,
    provider VARCHAR(50) NOT NULL CHECK (provider IN ('openrouter', 'ollama')),
    tokens_used INTEGER,
    cost DECIMAL(10, 6),
    response_time_ms INTEGER,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create AI model preferences table
CREATE TABLE IF NOT EXISTS ai_model_preferences (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    platform VARCHAR(20) NOT NULL CHECK (platform IN ('discord', 'telegram')),
    preferred_model VARCHAR(255),
    system_prompt TEXT,
    temperature DECIMAL(3, 2) DEFAULT 0.7,
    max_tokens INTEGER DEFAULT 2000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, platform)
);

-- Create AI rate limits table
CREATE TABLE IF NOT EXISTS ai_rate_limits (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    platform VARCHAR(20) NOT NULL CHECK (platform IN ('discord', 'telegram')),
    requests_count INTEGER DEFAULT 0,
    window_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_request_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, platform)
);

-- Create AI server/chat settings table
CREATE TABLE IF NOT EXISTS ai_settings (
    id SERIAL PRIMARY KEY,
    chat_id VARCHAR(255) NOT NULL,
    platform VARCHAR(20) NOT NULL CHECK (platform IN ('discord', 'telegram')),
    ai_enabled BOOLEAN DEFAULT TRUE,
    allowed_channels JSONB DEFAULT '[]'::jsonb,
    max_requests_per_user INTEGER DEFAULT 20,
    rate_limit_window_hours INTEGER DEFAULT 1,
    allowed_models JSONB DEFAULT '[]'::jsonb,
    default_model VARCHAR(255),
    default_system_prompt TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(chat_id, platform)
);

-- Create indexes for better performance
CREATE INDEX idx_ai_conversations_user ON ai_conversations(user_id, platform);
CREATE INDEX idx_ai_conversations_chat ON ai_conversations(chat_id, platform);
CREATE INDEX idx_ai_usage_logs_user ON ai_usage_logs(user_id, platform);
CREATE INDEX idx_ai_usage_logs_date ON ai_usage_logs(created_at);
CREATE INDEX idx_ai_model_preferences_user ON ai_model_preferences(user_id, platform);
CREATE INDEX idx_ai_rate_limits_user ON ai_rate_limits(user_id, platform);
CREATE INDEX idx_ai_settings_chat ON ai_settings(chat_id, platform);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ai_conversations_updated_at BEFORE UPDATE ON ai_conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_model_preferences_updated_at BEFORE UPDATE ON ai_model_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_settings_updated_at BEFORE UPDATE ON ai_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default AI settings
INSERT INTO ai_settings (chat_id, platform, ai_enabled, default_model)
VALUES 
    ('default_discord', 'discord', TRUE, 'anthropic/claude-sonnet-4'),
    ('default_telegram', 'telegram', TRUE, 'anthropic/claude-sonnet-4')
ON CONFLICT (chat_id, platform) DO NOTHING;

-- Create view for AI usage statistics
CREATE OR REPLACE VIEW ai_usage_stats AS
SELECT 
    platform,
    DATE(created_at) as date,
    COUNT(*) as total_requests,
    COUNT(DISTINCT user_id) as unique_users,
    SUM(tokens_used) as total_tokens,
    SUM(cost) as total_cost,
    AVG(response_time_ms) as avg_response_time_ms,
    SUM(CASE WHEN success THEN 1 ELSE 0 END) as successful_requests,
    SUM(CASE WHEN NOT success THEN 1 ELSE 0 END) as failed_requests
FROM ai_usage_logs
GROUP BY platform, DATE(created_at);

-- Create view for user AI usage
CREATE OR REPLACE VIEW user_ai_usage AS
SELECT 
    user_id,
    platform,
    COUNT(*) as total_requests,
    SUM(tokens_used) as total_tokens,
    SUM(cost) as total_cost,
    MAX(created_at) as last_used_at
FROM ai_usage_logs
GROUP BY user_id, platform;

-- Grant permissions (adjust as needed)
GRANT SELECT, INSERT, UPDATE, DELETE ON ai_conversations TO botuser;
GRANT SELECT, INSERT ON ai_usage_logs TO botuser;
GRANT SELECT, INSERT, UPDATE ON ai_model_preferences TO botuser;
GRANT SELECT, INSERT, UPDATE, DELETE ON ai_rate_limits TO botuser;
GRANT SELECT, UPDATE ON ai_settings TO botuser;
GRANT SELECT ON ai_usage_stats TO botuser;
GRANT SELECT ON user_ai_usage TO botuser;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO botuser;

-- Print success message
DO $$
BEGIN
    RAISE NOTICE 'AI schema migration completed successfully!';
    RAISE NOTICE 'Tables created: 5';
    RAISE NOTICE 'Indexes created: 7';
    RAISE NOTICE 'Views created: 2';
    RAISE NOTICE 'You can now use AI features in your bot system.';
END $$;
