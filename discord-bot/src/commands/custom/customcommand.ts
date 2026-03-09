import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

// In-memory custom commands store per guild
const customCommands = new Map<string, Map<string, { response: string; creator: string }>>();

export default {
    data: new SlashCommandBuilder()
        .setName('customcommand')
        .setDescription('Manage custom commands')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand((sub: any) =>
            sub.setName('add')
                .setDescription('Add a custom command')
                .addStringOption((o: any) => o.setName('name').setDescription('Command trigger name').setRequired(true))
                .addStringOption((o: any) => o.setName('response').setDescription('Response message').setRequired(true)))
        .addSubcommand((sub: any) =>
            sub.setName('remove')
                .setDescription('Remove a custom command')
                .addStringOption((o: any) => o.setName('name').setDescription('Command trigger name').setRequired(true)))
        .addSubcommand((sub: any) =>
            sub.setName('list')
                .setDescription('List all custom commands')),

    category: 'custom',

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            if (!interaction.guild) return interaction.reply({ content: 'Server only.', ephemeral: true });

            const guildId = interaction.guild.id;
            if (!customCommands.has(guildId)) customCommands.set(guildId, new Map());
            const guildCmds = customCommands.get(guildId)!;

            const sub = interaction.options.getSubcommand();

            if (sub === 'add') {
                const name = interaction.options.getString('name', true).toLowerCase();
                const response = interaction.options.getString('response', true);
                guildCmds.set(name, { response, creator: interaction.user.tag });

                const embed = new EmbedBuilder().setColor(0x00FF00).setTitle('✅ Custom Command Added')
                    .addFields(
                        { name: 'Trigger', value: `\`${name}\``, inline: true },
                        { name: 'Response', value: response.substring(0, 200), inline: true },
                        { name: 'Created by', value: interaction.user.tag }
                    ).setTimestamp();
                await interaction.reply({ embeds: [embed] });

            } else if (sub === 'remove') {
                const name = interaction.options.getString('name', true).toLowerCase();
                if (!guildCmds.has(name)) return interaction.reply({ content: `❌ Custom command \`${name}\` not found.`, ephemeral: true });
                guildCmds.delete(name);
                await interaction.reply({ content: `🗑️ Custom command \`${name}\` has been removed.` });

            } else if (sub === 'list') {
                if (guildCmds.size === 0) return interaction.reply({ content: '📭 No custom commands set up.', ephemeral: true });
                const list = [...guildCmds.entries()].map(([name, cmd]) => `\`${name}\` — by ${cmd.creator}`).join('\n');
                const embed = new EmbedBuilder().setColor(0x0099FF).setTitle('📋 Custom Commands')
                    .setDescription(list).setFooter({ text: `${guildCmds.size} command(s)` }).setTimestamp();
                await interaction.reply({ embeds: [embed] });
            }

        } catch (error) {
            console.error('Error in customcommand:', error);
            const msg = { content: '❌ An error occurred.', ephemeral: true };
            if (interaction.replied || interaction.deferred) await interaction.followUp(msg); else await interaction.reply(msg);
        }
    }
};
