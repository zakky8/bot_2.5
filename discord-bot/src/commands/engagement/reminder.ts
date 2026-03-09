import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('reminder')
        .setDescription('Set a reminder')
        .addStringOption((o: any) => o.setName('message').setDescription('What to remind you about').setRequired(true))
        .addIntegerOption((o: any) => o.setName('minutes').setDescription('Minutes from now').setRequired(true).setMinValue(1).setMaxValue(10080)),
    category: 'engagement',
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const message = interaction.options.getString('message', true);
            const minutes = interaction.options.getInteger('minutes', true);
            const remindAt = Date.now() + minutes * 60 * 1000;

            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('⏰ Reminder Set')
                .addFields(
                    { name: 'Reminder', value: message },
                    { name: 'When', value: `<t:${Math.floor(remindAt / 1000)}:R>`, inline: true }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });

            setTimeout(async () => {
                try {
                    await interaction.user.send(`⏰ **Reminder:** ${message}`);
                } catch {
                    const channel = interaction.channel;
                    if (channel && 'send' in channel) {
                        await channel.send(`⏰ ${interaction.user}, **Reminder:** ${message}`);
                    }
                }
            }, minutes * 60 * 1000);
        } catch (error) { console.error('Error:', error); await interaction.reply({ content: '❌ An error occurred.', ephemeral: true }); }
    }
};
