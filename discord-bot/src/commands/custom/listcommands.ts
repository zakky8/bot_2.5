import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getCustomCommands } from './addcommand';

export default {
    data: new SlashCommandBuilder()
        .setName('listcommands')
        .setDescription('List all custom commands'),
    category: 'custom',
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            if (!interaction.guild) return interaction.reply({ content: 'Server only.', ephemeral: true });
            const commands = getCustomCommands(interaction.guild.id);

            const embed = new EmbedBuilder().setColor(0x0099FF).setTitle('📋 Custom Commands').setTimestamp();

            if (commands.size === 0) {
                embed.setDescription('No custom commands configured. Use `/addcommand` to create one.');
            } else {
                const list = [...commands.entries()].map(([name, data]) =>
                    `\`${name}\` — ${data.response.substring(0, 50)}${data.response.length > 50 ? '...' : ''}`
                ).join('\n');
                embed.setDescription(list);
                embed.setFooter({ text: `${commands.size} custom command(s)` });
            }

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) { console.error('Error:', error); await interaction.reply({ content: '❌ An error occurred.', ephemeral: true }); }
    }
};
