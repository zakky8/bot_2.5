import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Display a user\'s avatar')
        .addUserOption((option: any) =>
            option.setName('user')
                .setDescription('The user to show avatar for')
                .setRequired(false)),

    category: 'utility',

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const user = interaction.options.getUser('user') || interaction.user;

            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`🖼️ ${user.tag}'s Avatar`)
                .setImage(user.displayAvatarURL({ size: 4096 }))
                .addFields(
                    {
                        name: 'Links', value: [
                            `[PNG](${user.displayAvatarURL({ extension: 'png', size: 4096 })})`,
                            `[JPG](${user.displayAvatarURL({ extension: 'jpg', size: 4096 })})`,
                            `[WEBP](${user.displayAvatarURL({ extension: 'webp', size: 4096 })})`
                        ].join(' | ')
                    }
                )
                .setTimestamp();

            // Check for server-specific avatar
            const member = interaction.guild?.members.cache.get(user.id);
            if (member?.avatar) {
                embed.addFields({
                    name: 'Server Avatar',
                    value: `[View](${member.displayAvatarURL({ size: 4096 })})`
                });
            }

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error in avatar command:', error);
            await interaction.reply({ content: '❌ An error occurred.', ephemeral: true });
        }
    }
};
