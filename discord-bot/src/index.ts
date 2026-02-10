import { Client, GatewayIntentBits, Collection, REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import { readdirSync, existsSync, statSync } from 'fs';
import { join } from 'path';
import { createLogger } from './core/logger';
import { connectDatabase } from './core/database';
import { connectRedis } from './core/redis';

config();

const logger = createLogger('Main');

// Create Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// Initialize collections
client.commands = new Collection();
client.cooldowns = new Collection();

// Load commands
async function loadCommands() {
  const commandsPath = join(__dirname, 'commands');
  if (!existsSync(commandsPath)) {
    logger.warn('Commands directory not found');
    return;
  }
  const commandFolders = readdirSync(commandsPath);

  for (const folder of commandFolders) {
    const folderPath = join(commandsPath, folder);
    if (!statSync(folderPath).isDirectory()) continue;

    const commandFiles = readdirSync(folderPath).filter(
      (file) => file.endsWith('.ts') || file.endsWith('.js')
    );

    for (const file of commandFiles) {
      const filePath = join(folderPath, file);
      try {
        const command = await import(filePath);
        const cmd = command.default || command;

        if ('data' in cmd && 'execute' in cmd) {
          client.commands.set(cmd.data.name, cmd);
          logger.info(`Loaded command: ${cmd.data.name}`);
        } else {
          logger.warn(`Skipping ${folder}/${file} — missing data or execute`);
        }
      } catch (error) {
        logger.error(`Error loading command ${folder}/${file}:`, error);
      }
    }
  }
}

// Load events
async function loadEvents() {
  const eventsPath = join(__dirname, 'events');
  if (!existsSync(eventsPath)) {
    logger.warn('Events directory not found');
    return;
  }
  const eventFiles = readdirSync(eventsPath).filter(
    (file) => file.endsWith('.ts') || file.endsWith('.js')
  );

  for (const file of eventFiles) {
    const filePath = join(eventsPath, file);
    try {
      const event = await import(filePath);
      const evt = event.default || event;

      if (evt.once) {
        client.once(evt.name, (...args) => evt.execute(...args));
      } else {
        client.on(evt.name, (...args) => evt.execute(...args));
      }
      logger.info(`Loaded event: ${evt.name}`);
    } catch (error) {
      logger.error(`Error loading event ${file}:`, error);
    }
  }
}

// Deploy commands
async function deployCommands() {
  try {
    if (!process.env.BOT_TOKEN || !process.env.CLIENT_ID) {
      logger.warn('BOT_TOKEN or CLIENT_ID not set — skipping command deployment');
      return;
    }

    logger.info('Started refreshing application (/) commands.');

    const commands = [];
    for (const [, command] of client.commands) {
      commands.push(command.data.toJSON());
    }

    const rest = new REST().setToken(process.env.BOT_TOKEN!);

    const data: any = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID!),
      { body: commands }
    );

    logger.info(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    logger.error('Error deploying commands:', error);
  }
}

// Initialize bot
async function init() {
  try {
    logger.info('Initializing Discord bot...');

    // Connect to services (graceful — won't crash without them)
    await connectDatabase();
    await connectRedis();

    // Load bot components
    await loadCommands();
    await loadEvents();

    // Deploy commands
    await deployCommands();

    // Login
    if (!process.env.BOT_TOKEN) {
      logger.error('BOT_TOKEN is not set — cannot login');
      process.exit(1);
    }
    await client.login(process.env.BOT_TOKEN);

    logger.info('Discord bot initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize bot:', error);
    process.exit(1);
  }
}

// Handle errors
process.on('unhandledRejection', (error) => {
  logger.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
  process.exit(1);
});

// Start bot
init();

export { client };
