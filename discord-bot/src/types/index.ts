import { Client, Collection, SlashCommandBuilder } from 'discord.js';

export interface Command {
  data: SlashCommandBuilder;
  execute: (interaction: any) => Promise<void>;
  category?: string;
  cooldown?: number;
}

export type BotClient = Client & {
  commands: Collection<string, Command>;
  cooldowns: Collection<string, Collection<string, number>>;
};

declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, Command>;
    cooldowns: Collection<string, Collection<string, number>>;
  }
}
