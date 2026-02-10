import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, TextChannel } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Set slowmode for a channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addIntegerOption((option: any) =>
            option.setName('seconds')
                .setDescription('Slowmode delay in seconds (0 to disable)')
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(21600))
        .addChannelOption((option: any) =>
            option.setName('channel')
                .setDescription('Channel to set slowmode for (defaults to current)')
                .setRequired(false)),

    category: 'moderation',

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const seconds = interaction.options.getInteger('seconds', true);
            const targetChannel = (interaction.options.getChannel('channel') || interaction.channel) as TextChannel;

            if (!targetChannel || !('setRateLimitPerUser' in targetChannel)) {
                return interaction.reply({ content: 'Invalid text channel.', ephemeral: true });
            }

            await targetChannel.setRateLimitPerUser(seconds, `Set by ${interaction.user.tag}`);

            const embed = new EmbedBuilder()
                .setColor(seconds > 0 ? 0xFF9900 : 0x00FF00)
                .setTitle(seconds > 0 ? '🐌 Slowmode Enabled' : '🐌 Slowmode Disabled')
                .addFields(
                    { name: 'Channel', value: `${targetChannel}`, inline: true },
                    { name: 'Delay', value: seconds > 0 ? `${seconds} second(s)` : 'Disabled', inline: true },
                    { name: 'Set by', value: interaction.user.tag, inline: true }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error in slowmode command:', error);
            const errorMessage = { content: '❌ Failed to set slowmode.', ephemeral: true };
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        }
    }
};
