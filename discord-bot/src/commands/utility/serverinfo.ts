import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Display information about the server'),

    category: 'utility',

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const guild = interaction.guild;
            if (!guild) return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });

            await guild.members.fetch();

            const roles = guild.roles.cache.sort((a, b) => b.position - a.position).map(r => r.toString()).slice(0, 20);
            const onlineMembers = guild.members.cache.filter((m: any) => m.presence?.status !== 'offline').size;

            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`📊 ${guild.name}`)
                .setThumbnail(guild.iconURL({ size: 256 }) || '')
                .addFields(
                    { name: '👑 Owner', value: `<@${guild.ownerId}>`, inline: true },
                    { name: '📅 Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
                    { name: '🆔 Server ID', value: guild.id, inline: true },
                    { name: `👥 Members (${guild.memberCount})`, value: `Online: ${onlineMembers}\nHumans: ${guild.members.cache.filter((m: any) => !m.user.bot).size}\nBots: ${guild.members.cache.filter((m: any) => m.user.bot).size}`, inline: true },
                    { name: `💬 Channels (${guild.channels.cache.size})`, value: `Text: ${guild.channels.cache.filter((c: any) => c.type === 0).size}\nVoice: ${guild.channels.cache.filter((c: any) => c.type === 2).size}\nCategories: ${guild.channels.cache.filter((c: any) => c.type === 4).size}`, inline: true },
                    { name: '🔒 Verification', value: ['None', 'Low', 'Medium', 'High', 'Very High'][guild.verificationLevel], inline: true },
                    { name: '🎨 Emojis', value: `${guild.emojis.cache.size}`, inline: true },
                    { name: '🚀 Boosts', value: `Level ${guild.premiumTier} (${guild.premiumSubscriptionCount || 0} boosts)`, inline: true },
                    { name: `🏷️ Roles (${guild.roles.cache.size})`, value: roles.join(', ').substring(0, 1024) || 'None' }
                )
                .setTimestamp();

            if (guild.bannerURL()) {
                embed.setImage(guild.bannerURL({ size: 512 })!);
            }

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error in serverinfo command:', error);
            await interaction.reply({ content: '❌ An error occurred.', ephemeral: true });
        }
    }
};
