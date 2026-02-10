import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, GuildMemberRoleManager } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a member from the server')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption((option: any) =>
            option.setName('user')
                .setDescription('The user to kick')
                .setRequired(true))
        .addStringOption((option: any) =>
            option.setName('reason')
                .setDescription('Reason for the kick')
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

            if (member.roles.highest.position >= (interaction.member!.roles as GuildMemberRoleManager).highest.position) {
                return interaction.reply({ content: 'You cannot kick this user due to role hierarchy.', ephemeral: true });
            }

            await member.kick(`Kicked by ${interaction.user.tag}: ${reason}`);

            const embed = new EmbedBuilder()
                .setColor(0xFFA500)
                .setTitle('Member Kicked')
                .setDescription(`${user.tag} has been kicked from the server.`)
                .addFields(
                    { name: 'User', value: `${user.tag} (${user.id})`, inline: true },
                    { name: 'Moderator', value: interaction.user.tag, inline: true },
                    { name: 'Reason', value: reason }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error in kick command:', error);
            await interaction.reply({ content: '❌ Failed to kick the user.', ephemeral: true });
        }
    }
};
