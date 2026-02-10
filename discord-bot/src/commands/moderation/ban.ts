import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, GuildMemberRoleManager } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a member from the server')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the ban')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('delete_days')
                .setDescription('Number of days of messages to delete (0-7)')
                .setMinValue(0)
                .setMaxValue(7)
                .setRequired(false)),

    category: 'moderation',

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const user = interaction.options.getUser('user', true);
            const reason = interaction.options.getString('reason') || 'No reason provided';
            const deleteDays = interaction.options.getInteger('delete_days') || 0;

            if (!interaction.guild) {
                return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
            }

            const member = await interaction.guild.members.fetch(user.id).catch(() => null);

            if (!member) {
                return interaction.reply({ content: 'User not found in this server.', ephemeral: true });
            }

            if (member.roles.highest.position >= (interaction.member!.roles as GuildMemberRoleManager).highest.position) {
                return interaction.reply({ content: 'You cannot ban this user due to role hierarchy.', ephemeral: true });
            }

            await interaction.guild.members.ban(user, {
                reason: `Banned by ${interaction.user.tag}: ${reason}`,
                deleteMessageSeconds: deleteDays * 24 * 60 * 60
            });

            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Member Banned')
                .setDescription(`${user.tag} has been banned from the server.`)
                .addFields(
                    { name: 'User', value: `${user.tag} (${user.id})`, inline: true },
                    { name: 'Moderator', value: interaction.user.tag, inline: true },
                    { name: 'Reason', value: reason }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

            // Log to database
            console.log(`Ban: ${user.tag} by ${interaction.user.tag} in ${interaction.guild.name}`);

        } catch (error) {
            console.error('Error in ban command:', error);

            const errorMessage = {
                content: '❌ An error occurred while executing this command.',
                ephemeral: true
            };

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        }
    }
};
