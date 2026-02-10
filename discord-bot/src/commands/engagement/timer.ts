import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('timer')
        .setDescription('Start a countdown timer')
        .addIntegerOption((o: any) => o.setName('minutes').setDescription('Timer duration in minutes').setRequired(true).setMinValue(1).setMaxValue(1440))
        .addStringOption((o: any) => o.setName('label').setDescription('Timer label').setRequired(false)),
    category: 'engagement',
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const minutes = interaction.options.getInteger('minutes', true);
            const label = interaction.options.getString('label') || 'Timer';
            const endTime = Date.now() + minutes * 60 * 1000;

            const embed = new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle(`⏱️ ${label}`)
                .setDescription(`Ends <t:${Math.floor(endTime / 1000)}:R>`)
                .addFields(
                    { name: 'Duration', value: `${minutes} minute(s)`, inline: true },
                    { name: 'Started by', value: interaction.user.tag, inline: true }
                )
                .setTimestamp(new Date(endTime));

            await interaction.reply({ embeds: [embed] });

            setTimeout(async () => {
                try {
                    if (interaction.channel && 'send' in interaction.channel) {
                        await interaction.channel.send(`⏱️ **${label}** has ended! ${interaction.user}`);
                    }
                } catch (e) { console.error('Timer notification error:', e); }
            }, minutes * 60 * 1000);
        } catch (error) { console.error('Error:', error); await interaction.reply({ content: '❌ An error occurred.', ephemeral: true }); }
    }
};
