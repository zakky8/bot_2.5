import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

const levelChannels = new Map<string, string | null>();

export default {
    data: new SlashCommandBuilder()
        .setName('levelchannel')
        .setDescription('Set or remove the level-up announcement channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addChannelOption(o => o.setName('channel').setDescription('Channel for level-up messages (leave empty to use current channel)').setRequired(false))
        .addBooleanOption(o => o.setName('disable').setDescription('Disable level-up messages').setRequired(false)),
    category: 'leveling',
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            if (!interaction.guild) return interaction.reply({ content: 'Server only.', ephemeral: true });
            const channel = interaction.options.getChannel('channel');
            const disable = interaction.options.getBoolean('disable');

            if (disable) {
                levelChannels.set(interaction.guild.id, null);
                return interaction.reply({ embeds: [new EmbedBuilder().setColor(0xFF4444).setTitle('🔇 Level-Up Messages Disabled').setTimestamp()] });
            }

            const targetChannel = channel || interaction.channel;
            levelChannels.set(interaction.guild.id, targetChannel!.id);
            await interaction.reply({ embeds: [new EmbedBuilder().setColor(0x00FF00).setTitle('📢 Level-Up Channel Set').setDescription(`Level-up messages will be sent to <#${targetChannel!.id}>`).setTimestamp()] });
        } catch (error) { console.error('Error:', error); await interaction.reply({ content: '❌ An error occurred.', ephemeral: true }); }
    }
};
