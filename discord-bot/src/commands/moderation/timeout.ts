import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout a member for a specified duration')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption((option: any) =>
            option.setName('user')
                .setDescription('The user to timeout')
                .setRequired(true))
        .addStringOption((option: any) =>
            option.setName('duration')
                .setDescription('Timeout duration')
                .setRequired(true)
                .addChoices(
                    { name: '60 seconds', value: '60' },
                    { name: '5 minutes', value: '300' },
                    { name: '10 minutes', value: '600' },
                    { name: '1 hour', value: '3600' },
                    { name: '1 day', value: '86400' },
                    { name: '1 week', value: '604800' }
                ))
        .addStringOption((option: any) =>
            option.setName('reason')
                .setDescription('Reason for the timeout')
                .setRequired(false)),

    category: 'moderation',

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const user = interaction.options.getUser('user', true);
            const durationStr = interaction.options.getString('duration', true);
            const reason = interaction.options.getString('reason') || 'No reason provided';
            const durationMs = parseInt(durationStr) * 1000;

            if (!interaction.guild) {
                return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
            }

            const member = await interaction.guild.members.fetch(user.id).catch(() => null);

            if (!member) {
                return interaction.reply({ content: 'User not found in this server.', ephemeral: true });
            }

            if (!member.moderatable) {
                return interaction.reply({ content: 'I cannot timeout this user.', ephemeral: true });
            }

            await member.timeout(durationMs, `Timeout by ${interaction.user.tag}: ${reason}`);

            const durationLabels: Record<string, string> = {
                '60': '60 seconds', '300': '5 minutes', '600': '10 minutes',
                '3600': '1 hour', '86400': '1 day', '604800': '1 week'
            };

            const embed = new EmbedBuilder()
                .setColor(0xFF6600)
                .setTitle('⏰ Member Timed Out')
                .addFields(
                    { name: 'User', value: `${user.tag} (${user.id})`, inline: true },
                    { name: 'Moderator', value: interaction.user.tag, inline: true },
                    { name: 'Duration', value: durationLabels[durationStr] || durationStr, inline: true },
                    { name: 'Reason', value: reason }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error in timeout command:', error);
            const errorMessage = { content: '❌ Failed to timeout the user.', ephemeral: true };
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        }
    }
};
