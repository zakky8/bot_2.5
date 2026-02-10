import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { aiService } from '../../core/ai';

export default {
    data: new SlashCommandBuilder()
        .setName('chat')
        .setDescription('Chat with AI (Powered by Shared AI Service)')
        .addStringOption((o: any) => o.setName('message').setDescription('Your message to the AI').setRequired(true))
        .addBooleanOption((o: any) => o.setName('clear').setDescription('Clear conversation history').setRequired(false)),
    category: 'ai',
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const message = interaction.options.getString('message', true);
            const clear = interaction.options.getBoolean('clear');
            const userId = interaction.user.id;

            if (clear) {
                await aiService.clearConversationContext(userId, interaction.guildId || undefined, 'discord');
                return interaction.reply({ content: '🗑️ Conversation history cleared!', ephemeral: true });
            }

            await interaction.deferReply();

            // Attempt AI response
            let responseContent: string;
            try {
                const context = await aiService.getConversationContext(userId, interaction.guildId || undefined, 'discord');
                const result = await aiService.chat(context, message);
                responseContent = result.content;
            } catch (aiError) {
                console.error('AI Service Error:', aiError);
                responseContent = "🤖 I'm having trouble connecting to my AI brain right now. (AI Service Unavailable)";
            }

            const embed = new EmbedBuilder()
                .setColor(0x7C3AED)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
                .setDescription(responseContent.substring(0, 4096))
                .setFooter({ text: '🤖 AI Chat • /chat clear:true to reset' })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Error in chat command:', error);
            const errorMessage = { content: '❌ Failed to generate a response.' };
            if (interaction.replied || interaction.deferred) {
                await interaction.editReply(errorMessage);
            } else {
                await interaction.reply({ ...errorMessage, ephemeral: true });
            }
        }
    }
};
