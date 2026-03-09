import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { getWarnings } from './warn';

export default {
    data: new SlashCommandBuilder()
        .setName('warnings')
        .setDescription('View warnings for a member')
        .addUserOption((option: any) =>
            option.setName('user')
                .setDescription('The user to view warnings for')
                .setRequired(true)),

    category: 'moderation',

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const user = interaction.options.getUser('user', true);

            if (!interaction.guild) {
                return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
            }

            const userWarnings = getWarnings(interaction.guild.id, user.id);

            if (userWarnings.length === 0) {
                return interaction.reply({ content: `✅ ${user.tag} has no warnings.`, ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setColor(0xFFCC00)
                .setTitle(`⚠️ Warnings for ${user.tag}`)
                .setDescription(`Total warnings: **${userWarnings.length}**`)
                .setThumbnail(user.displayAvatarURL())
                .setTimestamp();

            userWarnings.slice(-10).forEach((w, i) => {
                embed.addFields({
                    name: `Warning #${w.id} — ${w.date.toLocaleDateString()}`,
                    value: `**Reason:** ${w.reason}\n**By:** ${w.moderator}`
                });
            });

            if (userWarnings.length > 10) {
                embed.setFooter({ text: `Showing last 10 of ${userWarnings.length} warnings` });
            }

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error in warnings command:', error);
            const errorMessage = { content: '❌ An error occurred.', ephemeral: true };
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        }
    }
};
