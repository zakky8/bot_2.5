import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { setUserLevel, getUserLevel, calculateLevel } from './rank';

export default {
    data: new SlashCommandBuilder()
        .setName('setlevel')
        .setDescription('Set a user\'s level')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addUserOption(option =>
            option.setName('user').setDescription('The user').setRequired(true))
        .addIntegerOption(option =>
            option.setName('level').setDescription('The level to set').setRequired(true).setMinValue(1).setMaxValue(1000)),
    category: 'leveling',
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const user = interaction.options.getUser('user', true);
            const level = interaction.options.getInteger('level', true);
            if (!interaction.guild) return interaction.reply({ content: 'Server only.', ephemeral: true });
            const data = getUserLevel(interaction.guild.id, user.id);
            const xp = Math.pow((level - 1) / 0.1, 2);
            setUserLevel(interaction.guild.id, user.id, { ...data, level, xp: Math.floor(xp) });
            const embed = new EmbedBuilder().setColor(0x00FF00).setTitle('📊 Level Set')
                .addFields({ name: 'User', value: user.tag, inline: true }, { name: 'New Level', value: `${level}`, inline: true }, { name: 'Set by', value: interaction.user.tag, inline: true }).setTimestamp();
            await interaction.reply({ embeds: [embed] });
        } catch (error) { console.error('Error:', error); await interaction.reply({ content: '❌ An error occurred.', ephemeral: true }); }
    }
};
