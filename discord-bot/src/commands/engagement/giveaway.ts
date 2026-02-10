import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, TextChannel } from 'discord.js';

const giveaways = new Map<string, { messageId: string; channelId: string; prize: string; endTime: number; hostId: string; winners: number }>();

export const getGiveaway = (messageId: string) => giveaways.get(messageId);
export const getAllGiveaways = () => giveaways;

export default {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Start a giveaway')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption((o: any) => o.setName('prize').setDescription('What you\'re giving away').setRequired(true))
        .addIntegerOption((o: any) => o.setName('duration').setDescription('Duration in minutes').setRequired(true).setMinValue(1).setMaxValue(10080))
        .addIntegerOption((o: any) => o.setName('winners').setDescription('Number of winners').setRequired(false).setMinValue(1).setMaxValue(20)),
    category: 'engagement',
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const prize = interaction.options.getString('prize', true);
            const duration = interaction.options.getInteger('duration', true);
            const winners = interaction.options.getInteger('winners') || 1;
            const endTime = Date.now() + duration * 60 * 1000;

            const embed = new EmbedBuilder()
                .setColor(0xFFD700)
                .setTitle('🎉 GIVEAWAY 🎉')
                .setDescription(`**${prize}**\n\nReact with 🎉 to enter!\n\n⏰ Ends: <t:${Math.floor(endTime / 1000)}:R>\n🏆 Winners: ${winners}\n🎩 Hosted by: ${interaction.user}`)
                .setTimestamp(new Date(endTime));

            await interaction.reply({ content: '🎉 Giveaway started!', ephemeral: true });
            const channel = interaction.channel as TextChannel;
            const msg = await channel.send({ embeds: [embed] });
            await msg.react('🎉');

            giveaways.set(msg.id, { messageId: msg.id, channelId: channel.id, prize, endTime, hostId: interaction.user.id, winners });

            setTimeout(async () => {
                try {
                    const fetchedMsg = await channel.messages.fetch(msg.id);
                    const reactions = fetchedMsg.reactions.cache.get('🎉');
                    const users = await reactions?.users.fetch();
                    const entries = users?.filter(u => !u.bot).map(u => u.id) || [];

                    const winnerList: string[] = [];
                    const pool = [...entries];
                    for (let i = 0; i < Math.min(winners, pool.length); i++) {
                        const idx = Math.floor(Math.random() * pool.length);
                        winnerList.push(pool.splice(idx, 1)[0]);
                    }

                    const resultEmbed = new EmbedBuilder()
                        .setColor(0x00FF00)
                        .setTitle('🎉 GIVEAWAY ENDED 🎉')
                        .setDescription(`**${prize}**\n\n${winnerList.length > 0 ? `🏆 Winner(s): ${winnerList.map(id => `<@${id}>`).join(', ')}` : 'No valid entries!'}\n🎩 Hosted by: <@${interaction.user.id}>`)
                        .setTimestamp();

                    await fetchedMsg.edit({ embeds: [resultEmbed] });
                    if (winnerList.length > 0) {
                        await channel.send(`🎉 Congratulations ${winnerList.map(id => `<@${id}>`).join(', ')}! You won **${prize}**!`);
                    }
                    giveaways.delete(msg.id);
                } catch (e) { console.error('Giveaway end error:', e); }
            }, duration * 60 * 1000);
        } catch (error) { console.error('Error:', error); await interaction.reply({ content: '❌ An error occurred.', ephemeral: true }); }
    }
};
