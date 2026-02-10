import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('membercount')
        .setDescription('Display member statistics for the server'),

    category: 'utility',

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const guild = interaction.guild;
            if (!guild) return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });

            const members = guild.members.cache;
            const humans = members.filter((m: any) => !m.user.bot).size;
            const bots = members.filter((m: any) => m.user.bot).size;
            const online = members.filter((m: any) => m.presence?.status === 'online').size;
            const idle = members.filter((m: any) => m.presence?.status === 'idle').size;
            const dnd = members.filter((m: any) => m.presence?.status === 'dnd').size;
            const offline = members.filter((m: any) => !m.presence || m.presence.status === 'offline').size;

            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`👥 Member Count — ${guild.name}`)
                .addFields(
                    { name: '📊 Total', value: `**${guild.memberCount}**`, inline: true },
                    { name: '👤 Humans', value: `${humans}`, inline: true },
                    { name: '🤖 Bots', value: `${bots}`, inline: true },
                    { name: '🟢 Online', value: `${online}`, inline: true },
                    { name: '🟡 Idle', value: `${idle}`, inline: true },
                    { name: '🔴 DND', value: `${dnd}`, inline: true },
                    { name: '⚫ Offline', value: `${offline}`, inline: true }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error in membercount command:', error);
            await interaction.reply({ content: '❌ An error occurred.', ephemeral: true });
        }
    }
};
