import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, TextChannel } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear a specified number of messages from a channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption((option: any) =>
            option.setName('amount')
                .setDescription('Number of messages to delete (1-100)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100))
        .addUserOption((option: any) =>
            option.setName('user')
                .setDescription('Only delete messages from this user')
                .setRequired(false)),

    category: 'moderation',

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const amount = interaction.options.getInteger('amount', true);
            const targetUser = interaction.options.getUser('user');
            const channel = interaction.channel as TextChannel;

            if (!channel || !('bulkDelete' in channel)) {
                return interaction.reply({ content: 'This command can only be used in text channels.', ephemeral: true });
            }

            await interaction.deferReply({ ephemeral: true });

            let messages;
            if (targetUser) {
                const fetched = await channel.messages.fetch({ limit: 100 });
                const filtered = fetched.filter(m => m.author.id === targetUser.id).first(amount);
                messages = await channel.bulkDelete(filtered, true);
            } else {
                messages = await channel.bulkDelete(amount, true);
            }

            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('🧹 Messages Cleared')
                .addFields(
                    { name: 'Deleted', value: `${messages.size} message(s)`, inline: true },
                    { name: 'Channel', value: `${channel}`, inline: true },
                    { name: 'Moderator', value: interaction.user.tag, inline: true }
                )
                .setTimestamp();

            if (targetUser) {
                embed.addFields({ name: 'Filtered by', value: targetUser.tag });
            }

            if (messages.size < amount) {
                embed.setFooter({ text: 'Messages older than 14 days cannot be bulk deleted.' });
            }

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Error in clear command:', error);
            const errorMessage = { content: '❌ Failed to clear messages.', ephemeral: true };
            if (interaction.replied || interaction.deferred) {
                await interaction.editReply(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        }
    }
};
