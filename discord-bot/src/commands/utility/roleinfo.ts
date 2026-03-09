import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('roleinfo')
        .setDescription('Display information about a role')
        .addRoleOption((option: any) =>
            option.setName('role')
                .setDescription('The role to get info for')
                .setRequired(true)),

    category: 'utility',

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const role = interaction.options.getRole('role', true);

            if (!interaction.guild) {
                return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
            }

            const guildRole = interaction.guild.roles.cache.get(role.id);
            if (!guildRole) {
                return interaction.reply({ content: 'Role not found.', ephemeral: true });
            }

            const permissions = guildRole.permissions.toArray().map(p =>
                p.replace(/([A-Z])/g, ' $1').trim()
            ).join(', ') || 'None';

            const embed = new EmbedBuilder()
                .setColor(guildRole.color || 0x0099FF)
                .setTitle(`🏷️ Role: ${guildRole.name}`)
                .addFields(
                    { name: '🆔 Role ID', value: guildRole.id, inline: true },
                    { name: '🎨 Color', value: guildRole.hexColor, inline: true },
                    { name: '📊 Position', value: `${guildRole.position}`, inline: true },
                    { name: '👥 Members', value: `${guildRole.members.size}`, inline: true },
                    { name: '📌 Hoisted', value: guildRole.hoist ? 'Yes' : 'No', inline: true },
                    { name: '💬 Mentionable', value: guildRole.mentionable ? 'Yes' : 'No', inline: true },
                    { name: '🤖 Managed', value: guildRole.managed ? 'Yes' : 'No', inline: true },
                    { name: '📅 Created', value: `<t:${Math.floor(guildRole.createdTimestamp / 1000)}:R>`, inline: true },
                    { name: '🔑 Permissions', value: permissions.substring(0, 1024) }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error in roleinfo command:', error);
            await interaction.reply({ content: '❌ An error occurred.', ephemeral: true });
        }
    }
};
