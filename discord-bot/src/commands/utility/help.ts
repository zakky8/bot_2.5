import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Display all available commands and help information')
        .addStringOption((option: any) =>
            option.setName('command')
                .setDescription('Get help for a specific command')
                .setRequired(false)),

    category: 'utility',

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const specificCommand = interaction.options.getString('command');

            if (specificCommand) {
                const command = (interaction.client as any).commands.get(specificCommand);
                if (!command) {
                    return interaction.reply({ content: `❌ Command \`/${specificCommand}\` not found.`, ephemeral: true });
                }

                const embed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle(`📖 Help: /${command.data.name}`)
                    .setDescription(command.data.description)
                    .addFields({ name: 'Category', value: command.category || 'General', inline: true })
                    .setTimestamp();

                if (command.data.options?.length) {
                    const opts = command.data.options.map((o: any) =>
                        `\`${o.name}\` — ${o.description}${o.required ? ' *(required)*' : ''}`
                    ).join('\n');
                    embed.addFields({ name: 'Options', value: opts });
                }

                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const commands = (interaction.client as any).commands;
            const categories: Record<string, string[]> = {};

            commands.forEach((cmd: any) => {
                const cat = cmd.category || 'other';
                if (!categories[cat]) categories[cat] = [];
                categories[cat].push(`\`/${cmd.data.name}\` — ${cmd.data.description}`);
            });

            const categoryEmojis: Record<string, string> = {
                moderation: '🛡️', leveling: '📊', custom: '⚙️', reactionroles: '🎭',
                engagement: '🎉', social: '📱', ai: '🤖', utility: '🔧'
            };

            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('📚 Bot Help')
                .setDescription('Here are all available commands organized by category.\nUse `/help command:<name>` for details on a specific command.')
                .setTimestamp()
                .setFooter({ text: `${commands.size} commands available` });

            for (const [cat, cmds] of Object.entries(categories).sort()) {
                const emoji = categoryEmojis[cat] || '📁';
                embed.addFields({
                    name: `${emoji} ${cat.charAt(0).toUpperCase() + cat.slice(1)} (${cmds.length})`,
                    value: cmds.join('\n') || 'No commands'
                });
            }

            await interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (error) {
            console.error('Error in help command:', error);
            await interaction.reply({ content: '❌ An error occurred.', ephemeral: true });
        }
    }
};
