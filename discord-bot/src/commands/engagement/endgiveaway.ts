import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, TextChannel } from 'discord.js';
import { getGiveaway } from './giveaway';

export default {
    data: new SlashCommandBuilder()
        .setName('endgiveaway')
        .setDescription('End a giveaway early')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption((o: any) => o.setName('message_id').setDescription('Message ID of the giveaway').setRequired(true)),
    category: 'engagement',
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const messageId = interaction.options.getString('message_id', true);
            const giveaway = getGiveaway(messageId);

            if (!giveaway) {
                return interaction.reply({ content: '❌ No active giveaway found with that message ID.', ephemeral: true });
            }

            const channel = await interaction.client.channels.fetch(giveaway.channelId) as TextChannel;
            const msg = await channel.messages.fetch(messageId);
            const reactions = msg.reactions.cache.get('🎉');
            const users = await reactions?.users.fetch();
            const entries = users?.filter(u => !u.bot).map(u => u.id) || [];

            const winnerList: string[] = [];
            const pool = [...entries];
            for (let i = 0; i < Math.min(giveaway.winners, pool.length); i++) {
                const idx = Math.floor(Math.random() * pool.length);
                winnerList.push(pool.splice(idx, 1)[0]);
            }

            const embed = new EmbedBuilder().setColor(0x00FF00).setTitle('🎉 GIVEAWAY ENDED (Early)').setDescription(`**${giveaway.prize}**\n\n${winnerList.length > 0 ? `🏆 Winner(s): ${winnerList.map(id => `<@${id}>`).join(', ')}` : 'No valid entries!'}`).setTimestamp();
            await msg.edit({ embeds: [embed] });
            if (winnerList.length > 0) await channel.send(`🎉 Congratulations ${winnerList.map(id => `<@${id}>`).join(', ')}! You won **${giveaway.prize}**!`);
            await interaction.reply({ content: '✅ Giveaway ended!', ephemeral: true });
        } catch (error) { console.error('Error:', error); await interaction.reply({ content: '❌ An error occurred.', ephemeral: true }); }
    }
};
