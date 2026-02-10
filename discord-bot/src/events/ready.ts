import { Client } from 'discord.js';
import { createLogger } from '../core/logger';

const logger = createLogger('Ready');

export default {
  name: 'ready',
  once: true,
  execute(client: Client) {
    logger.info(`Bot is ready! Logged in as ${client.user?.tag}`);
    logger.info(`Serving ${client.guilds.cache.size} guilds`);
  },
};
