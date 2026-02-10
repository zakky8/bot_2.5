import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('modlogs')
        .setDescription('View moderation logs for a user')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption((option: any) =>
            option.setName('user')
                .setDescription('The user to view mod logs for')
                .setRequired(true))
        .addStringOption((option: any) =>
            option.setName('type')
                .setDescription('Filter by action type')
                .setRequired(false)
                .addChoices(
                    { name: 'All', value: 'all' },
                    { name: 'Bans', value: 'ban' },
                    { name: 'Kicks', value: 'kick' },
                    { name: 'Mutes', value: 'mute' },
                    { name: 'Warns', value: 'warn' }
                )),

    category: 'moderation',

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const user = interaction.options.getUser('user', true);
            const filterType = interaction.options.getString('type') || 'all';

            if (!interaction.guild) {
                return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
            }

            await interaction.deferReply();

            // Check audit log for this user's moderation actions
            const auditLogs = await interaction.guild.fetchAuditLogs({ limit: 50 });
            const relevantLogs = auditLogs.entries.filter(entry => {
                if ((entry.target as any)?.id !== user.id) return false;
                if (filterType === 'all') return true;
                const actionMap: Record<string, number[]> = {
                    'ban': [22, 23],   // MEMBER_BAN_ADD, MEMBER_BAN_REMOVE
                    'kick': [20],       // MEMBER_KICK
                    'mute': [24],       // MEMBER_UPDATE (timeout)
                    'warn': [],         // Custom (not in audit logs)
                };
                return actionMap[filterType]?.includes(entry.action) || false;
            });

            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`📋 Mod Logs for ${user.tag}`)
                .setThumbnail(user.displayAvatarURL())
                .setTimestamp();

            if (relevantLogs.size === 0) {
                embed.setDescription('No moderation actions found for this user.');
            } else {
                const logEntries = [...relevantLogs.values()].slice(0, 10);
                for (const entry of logEntries) {
                    const actionNames: Record<number, string> = {
                        20: '👢 Kick', 22: '🔨 Ban', 23: '🔓 Unban', 24: '🔇 Timeout Update'
                    };
                    const actionName = actionNames[entry.action] || `Action ${entry.action}`;
                    embed.addFields({
                        name: `${actionName} — ${entry.createdAt.toLocaleDateString()}`,
                        value: `**By:** ${entry.executor?.tag || 'Unknown'}\n**Reason:** ${entry.reason || 'No reason'}`
                    });
                }

                if (relevantLogs.size > 10) {
                    embed.setFooter({ text: `Showing 10 of ${relevantLogs.size} entries` });
                }
            }

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Error in modlogs command:', error);
            const errorMessage = { content: '❌ Failed to fetch moderation logs.', ephemeral: true };
            if (interaction.replied || interaction.deferred) {
                await interaction.editReply(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        }
    }
};
