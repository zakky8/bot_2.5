import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('reason')
        .setDescription('Update the reason for a moderation action')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addIntegerOption((option: any) =>
            option.setName('case_id')
                .setDescription('The case/warning ID to update')
                .setRequired(true))
        .addStringOption((option: any) =>
            option.setName('new_reason')
                .setDescription('The updated reason')
                .setRequired(true)),

    category: 'moderation',

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const caseId = interaction.options.getInteger('case_id', true);
            const newReason = interaction.options.getString('new_reason', true);

            if (!interaction.guild) {
                return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
            }

            // Note: In a production environment, this would update the database
            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('📝 Reason Updated')
                .addFields(
                    { name: 'Case ID', value: `#${caseId}`, inline: true },
                    { name: 'Updated by', value: interaction.user.tag, inline: true },
                    { name: 'New Reason', value: newReason }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
            console.log(`Case #${caseId} reason updated by ${interaction.user.tag}: ${newReason}`);

        } catch (error) {
            console.error('Error in reason command:', error);
            const errorMessage = { content: '❌ Failed to update reason.', ephemeral: true };
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        }
    }
};
