import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('listrr')
        .setDescription('List all reaction roles in the server')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
    category: 'reactionroles',
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            if (!interaction.guild) return interaction.reply({ content: 'Server only.', ephemeral: true });

            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('🎭 Reaction Roles')
                .setDescription('No reaction roles configured. Use `/addrr` to create one.\n\n*Note: Reaction roles are stored per-session. Use a database for persistent storage.*')
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) { console.error('Error:', error); await interaction.reply({ content: '❌ An error occurred.', ephemeral: true }); }
    }
};
