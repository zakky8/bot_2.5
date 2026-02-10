import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, TextChannel, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('addrr')
        .setDescription('Add a reaction role to a message')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addStringOption((o: any) => o.setName('message_id').setDescription('Message ID to add reaction role to').setRequired(true))
        .addStringOption((o: any) => o.setName('emoji').setDescription('Emoji to react with').setRequired(true))
        .addRoleOption((o: any) => o.setName('role').setDescription('Role to assign').setRequired(true)),
    category: 'reactionroles',
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            if (!interaction.guild) return interaction.reply({ content: 'Server only.', ephemeral: true });
            const messageId = interaction.options.getString('message_id', true);
            const emoji = interaction.options.getString('emoji', true);
            const role = interaction.options.getRole('role', true);
            const channel = interaction.channel as TextChannel;

            const msg = await channel.messages.fetch(messageId).catch(() => null);
            if (!msg) return interaction.reply({ content: '❌ Message not found in this channel.', ephemeral: true });

            await msg.react(emoji).catch(() => null);

            const embed = new EmbedBuilder().setColor(0x00FF00).setTitle('✅ Reaction Role Added')
                .addFields(
                    { name: 'Message', value: `[Jump to message](${msg.url})`, inline: true },
                    { name: 'Emoji', value: emoji, inline: true },
                    { name: 'Role', value: `<@&${role.id}>`, inline: true }
                ).setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
            console.log(`Reaction role added: ${emoji} -> ${role.name} on message ${messageId}`);
        } catch (error) { console.error('Error:', error); await interaction.reply({ content: '❌ An error occurred.', ephemeral: true }); }
    }
};
