import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Timeout (mute) a member in the server')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption((option: any) =>
            option.setName('user')
                .setDescription('The user to mute')
                .setRequired(true))
        .addIntegerOption((option: any) =>
            option.setName('duration')
                .setDescription('Duration in minutes')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(40320))
        .addStringOption((option: any) =>
            option.setName('reason')
                .setDescription('Reason for the mute')
                .setRequired(false)),

    category: 'moderation',

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const user = interaction.options.getUser('user', true);
            const duration = interaction.options.getInteger('duration', true);
            const reason = interaction.options.getString('reason') || 'No reason provided';

            if (!interaction.guild) {
                return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
            }

            const member = await interaction.guild.members.fetch(user.id).catch(() => null);

            if (!member) {
                return interaction.reply({ content: 'User not found in this server.', ephemeral: true });
            }

            if (!member.moderatable) {
                return interaction.reply({ content: 'I cannot mute this user. They may have higher permissions.', ephemeral: true });
            }

            if (member.id === interaction.user.id) {
                return interaction.reply({ content: 'You cannot mute yourself.', ephemeral: true });
            }

            const durationMs = duration * 60 * 1000;
            await member.timeout(durationMs, `Muted by ${interaction.user.tag}: ${reason}`);

            const embed = new EmbedBuilder()
                .setColor(0xFF9900)
                .setTitle('🔇 Member Muted')
                .addFields(
                    { name: 'User', value: `${user.tag} (${user.id})`, inline: true },
                    { name: 'Moderator', value: interaction.user.tag, inline: true },
                    { name: 'Duration', value: `${duration} minute(s)`, inline: true },
                    { name: 'Reason', value: reason }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error in mute command:', error);
            const errorMessage = { content: '❌ Failed to mute the user.', ephemeral: true };
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        }
    }
};
