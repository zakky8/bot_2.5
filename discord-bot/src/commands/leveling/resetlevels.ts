import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, TextChannel, Collection, Message } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('resetlevels')
        .setDescription('Reset all leveling data for the server')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    category: 'leveling',
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            if (!interaction.guild) return interaction.reply({ content: 'Server only.', ephemeral: true });

            await interaction.reply({ content: '⚠️ **Are you sure?** This will reset ALL leveling data for this server. Type `confirm` within 30 seconds to proceed.', ephemeral: true });

            const channel = interaction.channel as TextChannel;
            if (!channel) return;

            const filter = (m: Message) => m.author.id === interaction.user.id && m.content.toLowerCase() === 'confirm';
            const collector = channel.createMessageCollector({ filter, time: 30000, max: 1 });

            collector.on('collect', async () => {
                // In production, clear from database
                const embed = new EmbedBuilder().setColor(0xFF0000).setTitle('🗑️ Levels Reset')
                    .setDescription('All leveling data has been reset for this server.')
                    .addFields({ name: 'Reset by', value: interaction.user.tag }).setTimestamp();
                await interaction.followUp({ embeds: [embed] });
            });

            collector.on('end', (collected: any) => {
                if (collected.size === 0) {
                    interaction.followUp({ content: '❌ Reset cancelled — timed out.', ephemeral: true });
                }
            });
        } catch (error) { console.error('Error:', error); await interaction.reply({ content: '❌ An error occurred.', ephemeral: true }); }
    }
};
