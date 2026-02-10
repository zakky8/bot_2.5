import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { setUserLevel, getUserLevel, calculateLevel } from './rank';

export default {
    data: new SlashCommandBuilder()
        .setName('addxp')
        .setDescription('Add XP to a user')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addUserOption(option => option.setName('user').setDescription('The user').setRequired(true))
        .addIntegerOption(option => option.setName('amount').setDescription('XP to add').setRequired(true).setMinValue(1)),
    category: 'leveling',
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const user = interaction.options.getUser('user', true);
            const amount = interaction.options.getInteger('amount', true);
            if (!interaction.guild) return interaction.reply({ content: 'Server only.', ephemeral: true });
            const data = getUserLevel(interaction.guild.id, user.id);
            const newXp = data.xp + amount;
            const newLevel = calculateLevel(newXp);
            setUserLevel(interaction.guild.id, user.id, { ...data, xp: newXp, level: newLevel });
            const embed = new EmbedBuilder().setColor(0x00FF00).setTitle('➕ XP Added')
                .addFields({ name: 'User', value: user.tag, inline: true }, { name: 'Added', value: `+${amount.toLocaleString()} XP`, inline: true }, { name: 'Total XP', value: `${newXp.toLocaleString()}`, inline: true }, { name: 'Level', value: `${newLevel}`, inline: true }).setTimestamp();
            if (newLevel > data.level) embed.addFields({ name: '🎉 Level Up!', value: `${data.level} → ${newLevel}` });
            await interaction.reply({ embeds: [embed] });
        } catch (error) { console.error('Error:', error); await interaction.reply({ content: '❌ An error occurred.', ephemeral: true }); }
    }
};
