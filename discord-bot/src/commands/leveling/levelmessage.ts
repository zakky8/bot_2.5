import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

const levelMessages = new Map<string, string>();

export default {
    data: new SlashCommandBuilder()
        .setName('levelmessage')
        .setDescription('Configure the level-up message')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption((o: any) => o.setName('message').setDescription('Custom message ({user} {level} {xp} placeholders)').setRequired(false))
        .addBooleanOption((o: any) => o.setName('reset').setDescription('Reset to default message').setRequired(false)),
    category: 'leveling',
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            if (!interaction.guild) return interaction.reply({ content: 'Server only.', ephemeral: true });
            const message = interaction.options.getString('message');
            const reset = interaction.options.getBoolean('reset');
            const defaultMsg = '🎉 Congratulations {user}! You reached level {level}!';

            if (reset) {
                levelMessages.delete(interaction.guild.id);
                return interaction.reply({ embeds: [new EmbedBuilder().setColor(0x00FF00).setTitle('✅ Level-Up Message Reset').setDescription(`Message reset to:\n\`${defaultMsg}\``).setTimestamp()] });
            }

            if (message) {
                levelMessages.set(interaction.guild.id, message);
                const preview = message.replace('{user}', interaction.user.toString()).replace('{level}', '5').replace('{xp}', '1000');
                return interaction.reply({
                    embeds: [new EmbedBuilder().setColor(0x00FF00).setTitle('✅ Level-Up Message Set')
                        .addFields({ name: 'Template', value: `\`${message}\`` }, { name: 'Preview', value: preview }).setTimestamp()]
                });
            }

            const current = levelMessages.get(interaction.guild.id) || defaultMsg;
            await interaction.reply({
                embeds: [new EmbedBuilder().setColor(0x0099FF).setTitle('📝 Current Level-Up Message')
                    .setDescription(`\`${current}\`\n\n**Placeholders:** \`{user}\` \`{level}\` \`{xp}\``).setTimestamp()]
            });
        } catch (error) { console.error('Error:', error); await interaction.reply({ content: '❌ An error occurred.', ephemeral: true }); }
    }
};
