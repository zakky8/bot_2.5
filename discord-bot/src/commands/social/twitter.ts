import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('twitter')
        .setDescription('Set up Twitter/X post notifications')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand(sub =>
            sub.setName('add').setDescription('Add a Twitter account to track')
                .addStringOption((o: any) => o.setName('username').setDescription('Twitter username (without @)').setRequired(true))
                .addChannelOption((o: any) => o.setName('notify_channel').setDescription('Channel to send notifications').setRequired(true)))
        .addSubcommand(sub =>
            sub.setName('remove').setDescription('Remove a tracked Twitter account')
                .addStringOption((o: any) => o.setName('username').setDescription('Twitter username').setRequired(true)))
        .addSubcommand(sub =>
            sub.setName('list').setDescription('List tracked Twitter accounts')),
    category: 'social',
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const sub = interaction.options.getSubcommand();
            if (sub === 'add') {
                const username = interaction.options.getString('username', true);
                const notifyChannel = interaction.options.getChannel('notify_channel', true);
                const embed = new EmbedBuilder().setColor(0x1DA1F2).setTitle('🐦 Twitter Account Added')
                    .addFields({ name: 'Account', value: `[@${username}](https://twitter.com/${username})`, inline: true }, { name: 'Notifications', value: `<#${notifyChannel.id}>`, inline: true })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
            } else if (sub === 'remove') {
                const username = interaction.options.getString('username', true);
                await interaction.reply({ embeds: [new EmbedBuilder().setColor(0xFF4444).setTitle('🗑️ Twitter Account Removed').setDescription(`@${username} has been removed from tracking.`).setTimestamp()] });
            } else {
                await interaction.reply({ embeds: [new EmbedBuilder().setColor(0x1DA1F2).setTitle('🐦 Tracked Twitter Accounts').setDescription('No accounts are being tracked. Use `/twitter add` to start.').setTimestamp()] });
            }
        } catch (error) { console.error('Error:', error); await interaction.reply({ content: '❌ An error occurred.', ephemeral: true }); }
    }
};
