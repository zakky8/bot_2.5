import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, TextChannel, PermissionsBitField } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('lockdown')
        .setDescription('Lock a channel to prevent members from sending messages')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addChannelOption((option: any) =>
            option.setName('channel')
                .setDescription('Channel to lock (defaults to current)')
                .setRequired(false))
        .addStringOption((option: any) =>
            option.setName('reason')
                .setDescription('Reason for the lockdown')
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
                SendMessages: false,
                AddReactions: false,
            }, { reason: `Lockdown by ${interaction.user.tag}: ${reason}` });

            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('🔒 Channel Locked')
                .setDescription(`${channel} has been locked down.`)
                .addFields(
                    { name: 'Locked by', value: interaction.user.tag, inline: true },
                    { name: 'Reason', value: reason }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

            // Send a notice in the locked channel if it's different
            if (channel.id !== interaction.channelId) {
                await channel.send({ embeds: [embed] });
            }

        } catch (error) {
            console.error('Error in lockdown command:', error);
            const errorMessage = { content: '❌ Failed to lock the channel.', ephemeral: true };
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        }
    }
};
