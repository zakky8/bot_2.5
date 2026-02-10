import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { clearUserWarnings } from './warn';

export default {
    data: new SlashCommandBuilder()
        .setName('clearwarnings')
        .setDescription('Clear all warnings for a member')
        .addUserOption((option: any) =>
            option.setName('user')
                .setDescription('The user to clear warnings for')
                .setRequired(true)),

    category: 'moderation',

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const user = interaction.options.getUser('user', true);

            if (!interaction.guild) {
                return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
            }

            clearUserWarnings(interaction.guild.id, user.id);

            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('✅ Warnings Cleared')
                .setDescription(`All warnings for ${user.tag} have been cleared.`)
                .addFields(
                    { name: 'User', value: `${user.tag} (${user.id})`, inline: true },
                    { name: 'Cleared by', value: interaction.user.tag, inline: true }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error in clearwarnings command:', error);
            const errorMessage = { content: '❌ An error occurred.', ephemeral: true };
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        }
    }
};
