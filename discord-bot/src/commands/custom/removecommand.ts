import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { deleteCustomCommand, getCustomCommand } from './addcommand';

export default {
    data: new SlashCommandBuilder()
        .setName('removecommand')
        .setDescription('Remove a custom command')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption((o: any) => o.setName('name').setDescription('Command name to remove').setRequired(true)),
    category: 'custom',
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            if (!interaction.guild) return interaction.reply({ content: 'Server only.', ephemeral: true });
            const name = interaction.options.getString('name', true).toLowerCase();

            if (!getCustomCommand(interaction.guild.id, name)) {
                return interaction.reply({ content: `❌ Command \`${name}\` doesn't exist.`, ephemeral: true });
            }

            deleteCustomCommand(interaction.guild.id, name);
            await interaction.reply({ embeds: [new EmbedBuilder().setColor(0xFF4444).setTitle('🗑️ Custom Command Removed').setDescription(`Command \`${name}\` has been deleted.`).setTimestamp()] });
        } catch (error) { console.error('Error:', error); await interaction.reply({ content: '❌ An error occurred.', ephemeral: true }); }
    }
};
