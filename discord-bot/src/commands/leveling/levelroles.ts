import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

// In-memory level roles config
const levelRolesConfig = new Map<string, Map<number, string>>();

export const getLevelRoles = (guildId: string) => levelRolesConfig.get(guildId) || new Map();

export default {
    data: new SlashCommandBuilder()
        .setName('levelroles')
        .setDescription('Manage roles awarded at specific levels')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand(sub =>
            sub.setName('add').setDescription('Add a level role')
                .addIntegerOption((o: any) => o.setName('level').setDescription('Level to award role').setRequired(true).setMinValue(1))
                .addRoleOption((o: any) => o.setName('role').setDescription('Role to award').setRequired(true)))
        .addSubcommand(sub =>
            sub.setName('remove').setDescription('Remove a level role')
                .addIntegerOption((o: any) => o.setName('level').setDescription('Level to remove role from').setRequired(true)))
        .addSubcommand(sub =>
            sub.setName('list').setDescription('List all level roles')),
    category: 'leveling',
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            if (!interaction.guild) return interaction.reply({ content: 'Server only.', ephemeral: true });
            const sub = interaction.options.getSubcommand();
            const guildId = interaction.guild.id;
            if (!levelRolesConfig.has(guildId)) levelRolesConfig.set(guildId, new Map());
            const roles = levelRolesConfig.get(guildId)!;

            if (sub === 'add') {
                const level = interaction.options.getInteger('level', true);
                const role = interaction.options.getRole('role', true);
                roles.set(level, role.id);
                const embed = new EmbedBuilder().setColor(0x00FF00).setTitle('✅ Level Role Added')
                    .addFields({ name: 'Level', value: `${level}`, inline: true }, { name: 'Role', value: `<@&${role.id}>`, inline: true }).setTimestamp();
                await interaction.reply({ embeds: [embed] });
            } else if (sub === 'remove') {
                const level = interaction.options.getInteger('level', true);
                roles.delete(level);
                await interaction.reply({ embeds: [new EmbedBuilder().setColor(0xFF4444).setTitle('🗑️ Level Role Removed').setDescription(`Role for level ${level} has been removed.`).setTimestamp()] });
            } else {
                const entries = [...roles.entries()].sort((a, b) => a[0] - b[0]);
                const embed = new EmbedBuilder().setColor(0x0099FF).setTitle('🏷️ Level Roles').setTimestamp();
                if (entries.length === 0) { embed.setDescription('No level roles configured.'); }
                else { embed.setDescription(entries.map(([lvl, roleId]) => `Level **${lvl}** → <@&${roleId}>`).join('\n')); }
                await interaction.reply({ embeds: [embed] });
            }
        } catch (error) { console.error('Error:', error); await interaction.reply({ content: '❌ An error occurred.', ephemeral: true }); }
    }
};
