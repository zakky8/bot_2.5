import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { getCustomCommand, setCustomCommand } from './addcommand';

export default {
    data: new SlashCommandBuilder()
        .setName('editcommand')
        .setDescription('Edit an existing custom command')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption(o => o.setName('name').setDescription('Command name to edit').setRequired(true))
        .addStringOption(o => o.setName('response').setDescription('New response text').setRequired(true)),
    category: 'custom',
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            if (!interaction.guild) return interaction.reply({ content: 'Server only.', ephemeral: true });
            const name = interaction.options.getString('name', true).toLowerCase();
            const response = interaction.options.getString('response', true);

            if (!getCustomCommand(interaction.guild.id, name)) {
                return interaction.reply({ content: `❌ Command \`${name}\` doesn't exist. Use \`/addcommand\` to create it.`, ephemeral: true });
            }

            setCustomCommand(interaction.guild.id, name, response, interaction.user.tag);
            const embed = new EmbedBuilder().setColor(0xFFA500).setTitle('✏️ Custom Command Updated')
                .addFields({ name: 'Command', value: `\`${name}\``, inline: true }, { name: 'New Response', value: response.substring(0, 1024) }).setTimestamp();
            await interaction.reply({ embeds: [embed] });
        } catch (error) { console.error('Error:', error); await interaction.reply({ content: '❌ An error occurred.', ephemeral: true }); }
    }
};
