import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

const xpMultipliers = new Map<string, { multiplier: number; roles: string[] }>();

export default {
    data: new SlashCommandBuilder()
        .setName('xpmultiplier')
        .setDescription('Set XP multiplier for the server or specific roles')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addNumberOption(o => o.setName('multiplier').setDescription('XP multiplier (0.5-5.0)').setRequired(true).setMinValue(0.5).setMaxValue(5.0))
        .addRoleOption(o => o.setName('role').setDescription('Apply only to this role (leave empty for server-wide)').setRequired(false)),
    category: 'leveling',
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            if (!interaction.guild) return interaction.reply({ content: 'Server only.', ephemeral: true });
            const multiplier = interaction.options.getNumber('multiplier', true);
            const role = interaction.options.getRole('role');
            const config = xpMultipliers.get(interaction.guild.id) || { multiplier: 1.0, roles: [] };

            if (role) {
                const embed = new EmbedBuilder().setColor(0x0099FF).setTitle('✨ XP Multiplier Set')
                    .setDescription(`Role <@&${role.id}> now has a **${multiplier}x** XP multiplier.`).setTimestamp();
                await interaction.reply({ embeds: [embed] });
            } else {
                config.multiplier = multiplier;
                xpMultipliers.set(interaction.guild.id, config);
                const embed = new EmbedBuilder().setColor(0x0099FF).setTitle('✨ Server XP Multiplier')
                    .setDescription(`Server-wide XP multiplier set to **${multiplier}x**.`).setTimestamp();
                await interaction.reply({ embeds: [embed] });
            }
        } catch (error) { console.error('Error:', error); await interaction.reply({ content: '❌ An error occurred.', ephemeral: true }); }
    }
};
