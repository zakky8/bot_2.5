import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

const levelConfig = new Map<string, { xpPerMessage: number; xpCooldown: number; enabled: boolean }>();

export const getLevelConfig = (guildId: string) => levelConfig.get(guildId) || { xpPerMessage: 15, xpCooldown: 60, enabled: true };

export default {
    data: new SlashCommandBuilder()
        .setName('levelconfig')
        .setDescription('Configure the leveling system')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addIntegerOption((o: any) => o.setName('xp_per_message').setDescription('XP gained per message (5-50)').setRequired(false).setMinValue(5).setMaxValue(50))
        .addIntegerOption((o: any) => o.setName('cooldown').setDescription('XP cooldown in seconds (10-300)').setRequired(false).setMinValue(10).setMaxValue(300))
        .addBooleanOption((o: any) => o.setName('enabled').setDescription('Enable or disable leveling').setRequired(false)),
    category: 'leveling',
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            if (!interaction.guild) return interaction.reply({ content: 'Server only.', ephemeral: true });
            const config = getLevelConfig(interaction.guild.id);
            const xpPerMessage = interaction.options.getInteger('xp_per_message');
            const cooldown = interaction.options.getInteger('cooldown');
            const enabled = interaction.options.getBoolean('enabled');

            if (xpPerMessage !== null) config.xpPerMessage = xpPerMessage;
            if (cooldown !== null) config.xpCooldown = cooldown;
            if (enabled !== null) config.enabled = enabled;
            levelConfig.set(interaction.guild.id, config);

            const embed = new EmbedBuilder().setColor(0x0099FF).setTitle('⚙️ Level Configuration')
                .addFields(
                    { name: 'Status', value: config.enabled ? '✅ Enabled' : '❌ Disabled', inline: true },
                    { name: 'XP per Message', value: `${config.xpPerMessage}`, inline: true },
                    { name: 'Cooldown', value: `${config.xpCooldown}s`, inline: true }
                ).setTimestamp();
            await interaction.reply({ embeds: [embed] });
        } catch (error) { console.error('Error:', error); await interaction.reply({ content: '❌ An error occurred.', ephemeral: true }); }
    }
};
