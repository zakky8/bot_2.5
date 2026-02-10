import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Remove timeout (unmute) from a member')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption((option: any) =>
            option.setName('user')
                .setDescription('The user to unmute')
                .setRequired(true))
        .addStringOption((option: any) =>
            option.setName('reason')
                .setDescription('Reason for the unmute')
                .setRequired(false)),

    category: 'moderation',

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const user = interaction.options.getUser('user', true);
            const reason = interaction.options.getString('reason') || 'No reason provided';

            if (!interaction.guild) {
                return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
            }

            const member = await interaction.guild.members.fetch(user.id).catch(() => null);

            if (!member) {
                return interaction.reply({ content: 'User not found in this server.', ephemeral: true });
            }

            if (!member.isCommunicationDisabled()) {
                return interaction.reply({ content: 'This user is not currently muted.', ephemeral: true });
            }

            await member.timeout(null, `Unmuted by ${interaction.user.tag}: ${reason}`);

            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('🔊 Member Unmuted')
                .addFields(
                    { name: 'User', value: `${user.tag} (${user.id})`, inline: true },
                    { name: 'Moderator', value: interaction.user.tag, inline: true },
                    { name: 'Reason', value: reason }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error in unmute command:', error);
            const errorMessage = { content: '❌ Failed to unmute the user.', ephemeral: true };
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        }
    }
};
