import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a user from the server')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption((option: any) =>
            option.setName('user_id')
                .setDescription('The ID of the user to unban')
                .setRequired(true))
        .addStringOption((option: any) =>
            option.setName('reason')
                .setDescription('Reason for the unban')
                .setRequired(false)),

    category: 'moderation',

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const userId = interaction.options.getString('user_id', true);
            const reason = interaction.options.getString('reason') || 'No reason provided';

            if (!interaction.guild) {
                return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
            }

            // Verify the user is actually banned
            const bans = await interaction.guild.bans.fetch();
            const bannedUser = bans.get(userId);

            if (!bannedUser) {
                return interaction.reply({ content: 'This user is not banned.', ephemeral: true });
            }

            await interaction.guild.members.unban(userId, `Unbanned by ${interaction.user.tag}: ${reason}`);

            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('🔓 User Unbanned')
                .addFields(
                    { name: 'User', value: `${bannedUser.user.tag} (${userId})`, inline: true },
                    { name: 'Moderator', value: interaction.user.tag, inline: true },
                    { name: 'Reason', value: reason }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error in unban command:', error);
            const errorMessage = { content: '❌ Failed to unban the user. Make sure the ID is valid.', ephemeral: true };
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        }
    }
};
