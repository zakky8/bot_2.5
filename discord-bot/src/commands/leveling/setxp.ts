import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { setUserLevel, getUserLevel } from './rank';

export default {
    data: new SlashCommandBuilder()
        .setName('setxp')
        .setDescription('Set a user\'s XP')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addUserOption(option => option.setName('user').setDescription('The user').setRequired(true))
        .addIntegerOption(option => option.setName('xp').setDescription('The XP amount').setRequired(true).setMinValue(0)),
    category: 'leveling',
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const user = interaction.options.getUser('user', true);
            const xp = interaction.options.getInteger('xp', true);
            if (!interaction.guild) return interaction.reply({ content: 'Server only.', ephemeral: true });
            const data = getUserLevel(interaction.guild.id, user.id);
            const level = Math.floor(0.1 * Math.sqrt(xp)) + 1;
            setUserLevel(interaction.guild.id, user.id, { ...data, xp, level });
            const embed = new EmbedBuilder().setColor(0x00FF00).setTitle('✨ XP Set')
                .addFields({ name: 'User', value: user.tag, inline: true }, { name: 'XP', value: `${xp.toLocaleString()}`, inline: true }, { name: 'Level', value: `${level}`, inline: true }).setTimestamp();
            await interaction.reply({ embeds: [embed] });
        } catch (error) { console.error('Error:', error); await interaction.reply({ content: '❌ An error occurred.', ephemeral: true }); }
    }
};
