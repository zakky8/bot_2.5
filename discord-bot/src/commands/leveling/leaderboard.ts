import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getAllUsers } from './rank';

export default {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Show the server XP leaderboard')
        .addIntegerOption(option =>
            option.setName('page')
                .setDescription('Page number')
                .setRequired(false)
                .setMinValue(1)),

    category: 'leveling',

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            if (!interaction.guild) {
                return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
            }

            const page = interaction.options.getInteger('page') || 1;
            const perPage = 10;
            const allUsers = getAllUsers(interaction.guild.id);
            const totalPages = Math.ceil(allUsers.length / perPage) || 1;
            const start = (page - 1) * perPage;
            const pageUsers = allUsers.slice(start, start + perPage);

            const medals = ['🥇', '🥈', '🥉'];

            const embed = new EmbedBuilder()
                .setColor(0xFFD700)
                .setTitle(`🏆 ${interaction.guild.name} Leaderboard`)
                .setTimestamp()
                .setFooter({ text: `Page ${page}/${totalPages} • ${allUsers.length} ranked users` });

            if (pageUsers.length === 0) {
                embed.setDescription('No leveling data yet. Start chatting to earn XP!');
            } else {
                const description = pageUsers.map((u, i) => {
                    const rank = start + i + 1;
                    const medal = medals[rank - 1] || `**${rank}.**`;
                    return `${medal} <@${u.userId}> — Level ${u.level} • ${u.xp.toLocaleString()} XP`;
                }).join('\n');
                embed.setDescription(description);
            }

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error in leaderboard command:', error);
            await interaction.reply({ content: '❌ An error occurred.', ephemeral: true });
        }
    }
};
