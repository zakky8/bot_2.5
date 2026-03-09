import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, TextChannel } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Unlock a previously locked channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addChannelOption((option: any) =>
            option.setName('channel')
                .setDescription('Channel to unlock (defaults to current)')
                .setRequired(false))
        .addStringOption((option: any) =>
            option.setName('reason')
                .setDescription('Reason for unlocking')
                .setRequired(false)),

    category: 'moderation',

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const channel = (interaction.options.getChannel('channel') || interaction.channel) as TextChannel;
            const reason = interaction.options.getString('reason') || 'No reason provided';

            if (!interaction.guild) {
                return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
            }

            if (!channel || !('permissionOverwrites' in channel)) {
                return interaction.reply({ content: 'Invalid text channel.', ephemeral: true });
            }

            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                SendMessages: null,
                AddReactions: null,
            }, { reason: `Unlocked by ${interaction.user.tag}: ${reason}` });

            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('🔓 Channel Unlocked')
                .setDescription(`${channel} has been unlocked.`)
                .addFields(
                    { name: 'Unlocked by', value: interaction.user.tag, inline: true },
                    { name: 'Reason', value: reason }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error in unlock command:', error);
            const errorMessage = { content: '❌ Failed to unlock the channel.', ephemeral: true };
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        }
    }
};
