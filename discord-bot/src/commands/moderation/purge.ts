import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, TextChannel, Message } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Bulk delete messages with advanced filters')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption((option: any) =>
            option.setName('amount')
                .setDescription('Number of messages to purge (1-100)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100))
        .addStringOption((option: any) =>
            option.setName('filter')
                .setDescription('Filter type')
                .setRequired(false)
                .addChoices(
                    { name: 'Bots', value: 'bots' },
                    { name: 'Humans', value: 'humans' },
                    { name: 'Embeds', value: 'embeds' },
                    { name: 'Attachments', value: 'attachments' },
                    { name: 'Links', value: 'links' }
                )),

    category: 'moderation',

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const amount = interaction.options.getInteger('amount', true);
            const filter = interaction.options.getString('filter');
            const channel = interaction.channel as TextChannel;

            if (!channel || !('bulkDelete' in channel)) {
                return interaction.reply({ content: 'This command can only be used in text channels.', ephemeral: true });
            }

            await interaction.deferReply({ ephemeral: true });

            const fetched = await channel.messages.fetch({ limit: 100 });
            let filtered = fetched;

            if (filter) {
                switch (filter) {
                    case 'bots':
                        filtered = fetched.filter((m: any) => m.author.bot);
                        break;
                    case 'humans':
                        filtered = fetched.filter((m: any) => !m.author.bot);
                        break;
                    case 'embeds':
                        filtered = fetched.filter((m: any) => m.embeds.length > 0);
                        break;
                    case 'attachments':
                        filtered = fetched.filter((m: any) => m.attachments.size > 0);
                        break;
                    case 'links':
                        filtered = fetched.filter((m: any) => /https?:\/\/\S+/.test(m.content));
                        break;
                }
            }

            const toDelete = [...filtered.values()].slice(0, amount);
            const messages = await channel.bulkDelete(toDelete, true);

            const embed = new EmbedBuilder()
                .setColor(0xFF4444)
                .setTitle('🗑️ Messages Purged')
                .addFields(
                    { name: 'Deleted', value: `${messages.size} message(s)`, inline: true },
                    { name: 'Filter', value: filter || 'None', inline: true },
                    { name: 'Moderator', value: interaction.user.tag, inline: true }
                )
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Error in purge command:', error);
            const errorMessage = { content: '❌ Failed to purge messages.', ephemeral: true };
            if (interaction.replied || interaction.deferred) {
                await interaction.editReply(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        }
    }
};
