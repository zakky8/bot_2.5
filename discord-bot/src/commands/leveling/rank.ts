import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';

// In-memory leveling store (replace with database in production)
const levelData = new Map<string, { xp: number; level: number; messages: number }>();

export const getUserLevel = (guildId: string, userId: string) => {
    const key = `${guildId}:${userId}`;
    return levelData.get(key) || { xp: 0, level: 1, messages: 0 };
};

export const setUserLevel = (guildId: string, userId: string, data: { xp: number; level: number; messages: number }) => {
    levelData.set(`${guildId}:${userId}`, data);
};

export const calculateLevel = (xp: number): number => {
    return Math.floor(0.1 * Math.sqrt(xp)) + 1;
};

export const xpForLevel = (level: number): number => {
    return Math.pow((level - 1) / 0.1, 2);
};

export const getAllUsers = (guildId: string) => {
    const users: Array<{ userId: string; xp: number; level: number }> = [];
    for (const [key, data] of levelData) {
        if (key.startsWith(`${guildId}:`)) {
            users.push({ userId: key.split(':')[1], ...data });
        }
    }
    return users.sort((a, b) => b.xp - a.xp);
};

export default {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Show your or another user\'s rank card')
        .addUserOption((option: any) =>
            option.setName('user')
                .setDescription('The user to check rank for')
                .setRequired(false)),

    category: 'leveling',

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const user = interaction.options.getUser('user') || interaction.user;

            if (!interaction.guild) {
                return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
            }

            const data = getUserLevel(interaction.guild.id, user.id);
            const nextLevelXp = xpForLevel(data.level + 1);
            const currentLevelXp = xpForLevel(data.level);
            const progress = Math.floor(((data.xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100);

            // Calculate rank position
            const allUsers = getAllUsers(interaction.guild.id);
            const rankPosition = allUsers.findIndex(u => u.userId === user.id) + 1;

            const progressBar = '█'.repeat(Math.floor(progress / 10)) + '░'.repeat(10 - Math.floor(progress / 10));

            const embed = new EmbedBuilder()
                .setColor(0x7C3AED)
                .setTitle(`📊 Rank Card`)
                .setThumbnail(user.displayAvatarURL({ size: 256 }))
                .setDescription(`**${user.tag}**`)
                .addFields(
                    { name: '🏆 Rank', value: `#${rankPosition || 'N/A'}`, inline: true },
                    { name: '📊 Level', value: `${data.level}`, inline: true },
                    { name: '✨ XP', value: `${data.xp.toLocaleString()}`, inline: true },
                    { name: '💬 Messages', value: `${data.messages.toLocaleString()}`, inline: true },
                    { name: `Progress to Level ${data.level + 1}`, value: `${progressBar} ${progress}%\n${data.xp.toLocaleString()} / ${Math.floor(nextLevelXp).toLocaleString()} XP` }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error in rank command:', error);
            await interaction.reply({ content: '❌ An error occurred.', ephemeral: true });
        }
    }
};
