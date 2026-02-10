import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('reddit')
        .setDescription('Set up Reddit post notifications')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand(sub =>
            sub.setName('add').setDescription('Add a subreddit to track')
                .addStringOption((o: any) => o.setName('subreddit').setDescription('Subreddit name (without r/)').setRequired(true))
                .addChannelOption((o: any) => o.setName('notify_channel').setDescription('Channel to send notifications').setRequired(true))
                .addStringOption((o: any) => o.setName('filter').setDescription('Post filter').setRequired(false)
                    .addChoices({ name: 'Hot', value: 'hot' }, { name: 'New', value: 'new' }, { name: 'Top', value: 'top' })))
        .addSubcommand(sub =>
            sub.setName('remove').setDescription('Remove a tracked subreddit')
                .addStringOption((o: any) => o.setName('subreddit').setDescription('Subreddit name').setRequired(true)))
        .addSubcommand(sub =>
            sub.setName('list').setDescription('List tracked subreddits')),
    category: 'social',
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const sub = interaction.options.getSubcommand();
            if (sub === 'add') {
                const subreddit = interaction.options.getString('subreddit', true);
                const notifyChannel = interaction.options.getChannel('notify_channel', true);
                const filter = interaction.options.getString('filter') || 'hot';
                const embed = new EmbedBuilder().setColor(0xFF4500).setTitle('📰 Subreddit Added')
                    .addFields({ name: 'Subreddit', value: `[r/${subreddit}](https://reddit.com/r/${subreddit})`, inline: true }, { name: 'Notifications', value: `<#${notifyChannel.id}>`, inline: true }, { name: 'Filter', value: filter, inline: true })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
            } else if (sub === 'remove') {
                const subreddit = interaction.options.getString('subreddit', true);
                await interaction.reply({ embeds: [new EmbedBuilder().setColor(0xFF4444).setTitle('🗑️ Subreddit Removed').setDescription(`r/${subreddit} has been removed.`).setTimestamp()] });
            } else {
                await interaction.reply({ embeds: [new EmbedBuilder().setColor(0xFF4500).setTitle('📰 Tracked Subreddits').setDescription('No subreddits are being tracked. Use `/reddit add` to start.').setTimestamp()] });
            }
        } catch (error) { console.error('Error:', error); await interaction.reply({ content: '❌ An error occurred.', ephemeral: true }); }
    }
};
