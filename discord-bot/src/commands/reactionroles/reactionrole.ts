import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, TextChannel } from 'discord.js';

// In-memory reaction roles store per guild
const reactionRoles = new Map<string, Array<{ messageId: string; emoji: string; roleId: string }>>();

export default {
    data: new SlashCommandBuilder()
        .setName('reactionrole')
        .setDescription('Manage reaction roles')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addSubcommand((sub: any) =>
            sub.setName('add')
                .setDescription('Add a reaction role')
                .addStringOption((o: any) => o.setName('message_id').setDescription('Message ID to add reaction to').setRequired(true))
                .addStringOption((o: any) => o.setName('emoji').setDescription('Emoji for the reaction').setRequired(true))
                .addRoleOption((o: any) => o.setName('role').setDescription('Role to assign').setRequired(true)))
        .addSubcommand((sub: any) =>
            sub.setName('list')
                .setDescription('List all reaction roles')),

    category: 'reactionroles',

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            if (!interaction.guild) return interaction.reply({ content: 'Server only.', ephemeral: true });

            const guildId = interaction.guild.id;
            if (!reactionRoles.has(guildId)) reactionRoles.set(guildId, []);
            const guildRR = reactionRoles.get(guildId)!;

            const sub = interaction.options.getSubcommand();

            if (sub === 'add') {
                const messageId = interaction.options.getString('message_id', true);
                const emoji = interaction.options.getString('emoji', true);
                const role = interaction.options.getRole('role', true);

                // Try to react to the message
                try {
                    const channel = interaction.channel as TextChannel;
                    const msg = await channel.messages.fetch(messageId);
                    await msg.react(emoji);
                } catch {
                    return interaction.reply({ content: '❌ Could not find or react to that message. Make sure the message ID is correct and in this channel.', ephemeral: true });
                }

                guildRR.push({ messageId, emoji, roleId: role.id });

                const embed = new EmbedBuilder().setColor(0x00FF00).setTitle('🎭 Reaction Role Added')
                    .addFields(
                        { name: 'Message ID', value: messageId, inline: true },
                        { name: 'Emoji', value: emoji, inline: true },
                        { name: 'Role', value: `<@&${role.id}>`, inline: true }
                    ).setTimestamp();
                await interaction.reply({ embeds: [embed] });

            } else if (sub === 'list') {
                if (guildRR.length === 0) return interaction.reply({ content: '📭 No reaction roles configured.', ephemeral: true });
                const list = guildRR.map((rr, i) => `**${i + 1}.** ${rr.emoji} → <@&${rr.roleId}> (msg: \`${rr.messageId}\`)`).join('\n');
                const embed = new EmbedBuilder().setColor(0x0099FF).setTitle('🎭 Reaction Roles')
                    .setDescription(list).setFooter({ text: `${guildRR.length} reaction role(s)` }).setTimestamp();
                await interaction.reply({ embeds: [embed] });
            }

        } catch (error) {
            console.error('Error in reactionrole:', error);
            const msg = { content: '❌ An error occurred.', ephemeral: true };
            if (interaction.replied || interaction.deferred) await interaction.followUp(msg); else await interaction.reply(msg);
        }
    }
};
