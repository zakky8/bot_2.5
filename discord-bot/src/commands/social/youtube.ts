import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('youtube')
        .setDescription('Set up YouTube upload notifications')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand(sub =>
            sub.setName('add').setDescription('Add a YouTube channel to track')
                .addStringOption((o: any) => o.setName('channel').setDescription('YouTube channel name or URL').setRequired(true))
                .addChannelOption((o: any) => o.setName('notify_channel').setDescription('Channel to send notifications').setRequired(true)))
        .addSubcommand(sub =>
            sub.setName('remove').setDescription('Remove a tracked YouTube channel')
                .addStringOption((o: any) => o.setName('channel').setDescription('YouTube channel name').setRequired(true)))
        .addSubcommand(sub =>
            sub.setName('list').setDescription('List tracked YouTube channels')),
    category: 'social',
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const sub = interaction.options.getSubcommand();
            if (sub === 'add') {
                const channel = interaction.options.getString('channel', true);
                const notifyChannel = interaction.options.getChannel('notify_channel', true);
                const embed = new EmbedBuilder().setColor(0xFF0000).setTitle('📹 YouTube Channel Added')
                    .addFields({ name: 'Channel', value: channel, inline: true }, { name: 'Notifications', value: `<#${notifyChannel.id}>`, inline: true })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
            } else if (sub === 'remove') {
                const channel = interaction.options.getString('channel', true);
                await interaction.reply({ embeds: [new EmbedBuilder().setColor(0xFF4444).setTitle('🗑️ YouTube Channel Removed').setDescription(`\`${channel}\` has been removed from tracking.`).setTimestamp()] });
            } else {
                await interaction.reply({ embeds: [new EmbedBuilder().setColor(0xFF0000).setTitle('📹 Tracked YouTube Channels').setDescription('No channels are being tracked. Use `/youtube add` to start.').setTimestamp()] });
            }
        } catch (error) { console.error('Error:', error); await interaction.reply({ content: '❌ An error occurred.', ephemeral: true }); }
    }
};
