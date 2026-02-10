import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

// In-memory warnings store (replace with database in production)
const warnings = new Map<string, Array<{ moderator: string; reason: string; date: Date; id: number }>>();
let warnCounter = 0;

export const getWarnings = (guildId: string, userId: string) => {
    return warnings.get(`${guildId}:${userId}`) || [];
};

export const addWarning = (guildId: string, userId: string, moderator: string, reason: string) => {
    const key = `${guildId}:${userId}`;
    const userWarnings = warnings.get(key) || [];
    warnCounter++;
    userWarnings.push({ moderator, reason, date: new Date(), id: warnCounter });
    warnings.set(key, userWarnings);
    return { count: userWarnings.length, id: warnCounter };
};

export const clearUserWarnings = (guildId: string, userId: string) => {
    warnings.delete(`${guildId}:${userId}`);
};

export default {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Issue a warning to a member')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption((option: any) =>
            option.setName('user')
                .setDescription('The user to warn')
                .setRequired(true))
        .addStringOption((option: any) =>
            option.setName('reason')
                .setDescription('Reason for the warning')
                .setRequired(true)),

    category: 'moderation',

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const user = interaction.options.getUser('user', true);
            const reason = interaction.options.getString('reason', true);

            if (!interaction.guild) {
                return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
            }

            if (user.bot) {
                return interaction.reply({ content: 'You cannot warn bots.', ephemeral: true });
            }

            if (user.id === interaction.user.id) {
                return interaction.reply({ content: 'You cannot warn yourself.', ephemeral: true });
            }

            const result = addWarning(interaction.guild.id, user.id, interaction.user.tag, reason);

            const embed = new EmbedBuilder()
                .setColor(0xFFCC00)
                .setTitle('⚠️ Member Warned')
                .addFields(
                    { name: 'User', value: `${user.tag} (${user.id})`, inline: true },
                    { name: 'Moderator', value: interaction.user.tag, inline: true },
                    { name: 'Warning #', value: `${result.count}`, inline: true },
                    { name: 'Reason', value: reason },
                    { name: 'Warning ID', value: `#${result.id}`, inline: true }
                )
                .setTimestamp();

            // Auto-action on warning thresholds
            if (result.count >= 5) {
                embed.addFields({ name: '🚨 Auto-Action', value: 'User has 5+ warnings. Consider banning.' });
            } else if (result.count >= 3) {
                embed.addFields({ name: '⚠️ Notice', value: 'User has 3+ warnings. Consider muting.' });
            }

            await interaction.reply({ embeds: [embed] });

            // Try to DM the user
            try {
                await user.send(`⚠️ You have been warned in **${interaction.guild.name}**\nReason: ${reason}\nTotal warnings: ${result.count}`);
            } catch {
                // User has DMs disabled
            }

        } catch (error) {
            console.error('Error in warn command:', error);
            const errorMessage = { content: '❌ Failed to warn the user.', ephemeral: true };
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        }
    }
};
