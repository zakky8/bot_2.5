import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

// In-memory custom commands store
const customCommands = new Map<string, Map<string, { response: string; creator: string; createdAt: Date }>>();

export const getCustomCommands = (guildId: string) => customCommands.get(guildId) || new Map();
export const getCustomCommand = (guildId: string, name: string) => {
    return customCommands.get(guildId)?.get(name);
};
export const setCustomCommand = (guildId: string, name: string, response: string, creator: string) => {
    if (!customCommands.has(guildId)) customCommands.set(guildId, new Map());
    customCommands.get(guildId)!.set(name, { response, creator, createdAt: new Date() });
};
export const deleteCustomCommand = (guildId: string, name: string) => {
    return customCommands.get(guildId)?.delete(name) || false;
};

export default {
    data: new SlashCommandBuilder()
        .setName('addcommand')
        .setDescription('Create a custom text command')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption(o => o.setName('name').setDescription('Command trigger name').setRequired(true))
        .addStringOption(o => o.setName('response').setDescription('Response text').setRequired(true)),
    category: 'custom',
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            if (!interaction.guild) return interaction.reply({ content: 'Server only.', ephemeral: true });
            const name = interaction.options.getString('name', true).toLowerCase();
            const response = interaction.options.getString('response', true);

            if (getCustomCommand(interaction.guild.id, name)) {
                return interaction.reply({ content: `❌ Command \`${name}\` already exists. Use \`/editcommand\` to modify it.`, ephemeral: true });
            }

            setCustomCommand(interaction.guild.id, name, response, interaction.user.tag);
            const embed = new EmbedBuilder().setColor(0x00FF00).setTitle('✅ Custom Command Created')
                .addFields({ name: 'Trigger', value: `\`${name}\``, inline: true }, { name: 'Response', value: response.substring(0, 1024) }).setTimestamp();
            await interaction.reply({ embeds: [embed] });
        } catch (error) { console.error('Error:', error); await interaction.reply({ content: '❌ An error occurred.', ephemeral: true }); }
    }
};
