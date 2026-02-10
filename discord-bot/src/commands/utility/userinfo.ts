import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Display information about a user')
        .addUserOption((option: any) =>
            option.setName('user')
                .setDescription('The user to get info for')
                .setRequired(false)),

    category: 'utility',

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const user = interaction.options.getUser('user') || interaction.user;
            const member = interaction.guild?.members.cache.get(user.id) ||
                await interaction.guild?.members.fetch(user.id).catch(() => null);

            const embed = new EmbedBuilder()
                .setColor(member?.displayHexColor === '#000000' ? 0x0099FF : (member?.displayColor || 0x0099FF))
                .setTitle(`👤 ${user.tag}`)
                .setThumbnail(user.displayAvatarURL({ size: 256 }))
                .addFields(
                    { name: '🆔 User ID', value: user.id, inline: true },
                    { name: '🤖 Bot', value: user.bot ? 'Yes' : 'No', inline: true },
                    { name: '📅 Account Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true }
                )
                .setTimestamp();

            if (member) {
                const roles = member.roles.cache
                    .filter(r => r.id !== interaction.guild!.id)
                    .sort((a, b) => b.position - a.position)
                    .map(r => r.toString())
                    .slice(0, 15);

                embed.addFields(
                    { name: '📥 Joined Server', value: member.joinedAt ? `<t:${Math.floor(member.joinedTimestamp! / 1000)}:R>` : 'Unknown', inline: true },
                    { name: '🎨 Display Name', value: member.displayName, inline: true },
                    { name: '🔝 Highest Role', value: member.roles.highest.toString(), inline: true },
                    { name: `🏷️ Roles (${member.roles.cache.size - 1})`, value: roles.join(', ') || 'No roles' }
                );

                if (member.premiumSince) {
                    embed.addFields({ name: '🚀 Boosting Since', value: `<t:${Math.floor(member.premiumSinceTimestamp! / 1000)}:R>`, inline: true });
                }
            }

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error in userinfo command:', error);
            await interaction.reply({ content: '❌ An error occurred.', ephemeral: true });
        }
    }
};
