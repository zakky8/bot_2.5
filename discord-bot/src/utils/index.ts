import { EmbedBuilder } from 'discord.js';

export const createEmbed = (options: {
  title?: string;
  description?: string;
  color?: number;
  fields?: any[];
}) => {
  const embed = new EmbedBuilder()
    .setColor(options.color || 0x0099ff)
    .setTimestamp();

  if (options.title) embed.setTitle(options.title);
  if (options.description) embed.setDescription(options.description);
  if (options.fields) embed.addFields(options.fields);

  return embed;
};

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours}h ${minutes}m ${secs}s`;
};
