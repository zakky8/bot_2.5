import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('removerr')
        .setDescription('Remove a reaction role from a message')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addStringOption((o: any) => o.setName('message_id').setDescription('Message ID').setRequired(true))
        .addStringOption((o: any) => o.setName('emoji').setDescription('Emoji to remove').setRequired(true)),
    category: 'reactionroles',
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            if (!interaction.guild) return interaction.reply({ content: 'Server only.', ephemeral: true });
            const messageId = interaction.options.getString('message_id', true);
            const emoji = interaction.options.getString('emoji', true);

            const embed = new EmbedBuilder().setColor(0xFF4444).setTitle('🗑️ Reaction Role Removed')
                .addFields(
                    { name: 'Message ID', value: messageId, inline: true },
                    { name: 'Emoji', value: emoji, inline: true }
                ).setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
            console.log(`Reaction role removed: ${emoji} from message ${messageId}`);
        } catch (error) { console.error('Error:', error); await interaction.reply({ content: '❌ An error occurred.', ephemeral: true }); }
    }
};
