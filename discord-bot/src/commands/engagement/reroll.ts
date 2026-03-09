import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, TextChannel } from 'discord.js';
import { getGiveaway } from './giveaway';

export default {
    data: new SlashCommandBuilder()
        .setName('reroll')
        .setDescription('Reroll giveaway winners')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption((o: any) => o.setName('message_id').setDescription('Message ID of the giveaway').setRequired(true))
        .addIntegerOption((o: any) => o.setName('winners').setDescription('Number of new winners').setRequired(false).setMinValue(1).setMaxValue(20)),
    category: 'engagement',
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const messageId = interaction.options.getString('message_id', true);
            const numWinners = interaction.options.getInteger('winners') || 1;
            const channel = interaction.channel as TextChannel;

            const msg = await channel.messages.fetch(messageId).catch(() => null);
            if (!msg) return interaction.reply({ content: '❌ Message not found.', ephemeral: true });

            const reactions = msg.reactions.cache.get('🎉');
            const users = await reactions?.users.fetch();
            const entries = users?.filter(u => !u.bot).map(u => u.id) || [];

            if (entries.length === 0) return interaction.reply({ content: '❌ No entries to reroll.', ephemeral: true });

            const winners: string[] = [];
            const pool = [...entries];
            for (let i = 0; i < Math.min(numWinners, pool.length); i++) {
                const idx = Math.floor(Math.random() * pool.length);
                winners.push(pool.splice(idx, 1)[0]);
            }

            await interaction.reply({ content: `🎉 New winner(s): ${winners.map(id => `<@${id}>`).join(', ')}! Congratulations!` });
        } catch (error) { console.error('Error:', error); await interaction.reply({ content: '❌ An error occurred.', ephemeral: true }); }
    }
};
