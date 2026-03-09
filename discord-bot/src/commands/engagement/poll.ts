import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Create a poll')
        .addStringOption((o: any) => o.setName('question').setDescription('The poll question').setRequired(true))
        .addStringOption((o: any) => o.setName('option1').setDescription('Option 1').setRequired(true))
        .addStringOption((o: any) => o.setName('option2').setDescription('Option 2').setRequired(true))
        .addStringOption((o: any) => o.setName('option3').setDescription('Option 3').setRequired(false))
        .addStringOption((o: any) => o.setName('option4').setDescription('Option 4').setRequired(false))
        .addStringOption((o: any) => o.setName('option5').setDescription('Option 5').setRequired(false)),
    category: 'engagement',
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const question = interaction.options.getString('question', true);
            const options: string[] = [];
            for (let i = 1; i <= 5; i++) {
                const opt = interaction.options.getString(`option${i}`);
                if (opt) options.push(opt);
            }

            const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];
            const description = options.map((opt, i) => `${emojis[i]} ${opt}`).join('\n\n');

            const embed = new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle(`📊 ${question}`)
                .setDescription(description)
                .setFooter({ text: `Poll by ${interaction.user.tag} • React to vote!` })
                .setTimestamp();

            const msg = await interaction.reply({ embeds: [embed], fetchReply: true });
            for (let i = 0; i < options.length; i++) {
                await msg.react(emojis[i]);
            }
        } catch (error) { console.error('Error:', error); await interaction.reply({ content: '❌ An error occurred.', ephemeral: true }); }
    }
};
