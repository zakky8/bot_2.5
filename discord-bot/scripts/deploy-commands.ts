import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

config();

const commands: any[] = [];
const commandsPath = join(__dirname, '../src/commands');

function readCommands(dir: string) {
    const files = readdirSync(dir);
    for (const file of files) {
        const filePath = join(dir, file);
        const stat = statSync(filePath);
        if (stat.isDirectory()) {
            readCommands(filePath);
        } else if (file.endsWith('.ts') || file.endsWith('.js')) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const command = require(filePath).default;
            if (command && command.data && command.execute) {
                commands.push(command.data.toJSON());
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }
}

readCommands(commandsPath);

const rest = new REST().setToken(process.env.BOT_TOKEN!);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID!),
            { body: commands },
        );

        console.log(`Successfully reloaded ${Array.isArray(data) ? data.length : 'unknown'} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();
