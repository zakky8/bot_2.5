import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';

const birthdays = new Map<string, { month: number; day: number }>();

export default {
    data: new SlashCommandBuilder()
        .setName('birthday')
        .setDescription('Set or view birthdays')
        .addSubcommand(sub =>
            sub.setName('set').setDescription('Set your birthday')
                .addIntegerOption((o: any) => o.setName('month').setDescription('Month (1-12)').setRequired(true).setMinValue(1).setMaxValue(12))
                .addIntegerOption((o: any) => o.setName('day').setDescription('Day (1-31)').setRequired(true).setMinValue(1).setMaxValue(31)))
        .addSubcommand(sub =>
            sub.setName('view').setDescription('View someone\'s birthday')
                .addUserOption((o: any) => o.setName('user').setDescription('User to check').setRequired(false)))
        .addSubcommand(sub =>
            sub.setName('upcoming').setDescription('View upcoming birthdays')),
    category: 'engagement',
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const sub = interaction.options.getSubcommand();

            if (sub === 'set') {
                const month = interaction.options.getInteger('month', true);
                const day = interaction.options.getInteger('day', true);
                birthdays.set(interaction.user.id, { month, day });
                const months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                await interaction.reply({ embeds: [new EmbedBuilder().setColor(0xFF69B4).setTitle('🎂 Birthday Set!').setDescription(`Your birthday has been set to **${months[month]} ${day}**`).setTimestamp()], ephemeral: true });
            } else if (sub === 'view') {
                const user = interaction.options.getUser('user') || interaction.user;
                const bd = birthdays.get(user.id);
                if (!bd) return interaction.reply({ content: `${user.tag} hasn't set their birthday yet.`, ephemeral: true });
                const months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                await interaction.reply({ embeds: [new EmbedBuilder().setColor(0xFF69B4).setTitle(`🎂 ${user.tag}'s Birthday`).setDescription(`**${months[bd.month]} ${bd.day}**`).setThumbnail(user.displayAvatarURL()).setTimestamp()] });
            } else {
                const now = new Date();
                const upcoming = [...birthdays.entries()]
                    .map(([userId, bd]) => {
                        const next = new Date(now.getFullYear(), bd.month - 1, bd.day);
                        if (next < now) next.setFullYear(next.getFullYear() + 1);
                        return { userId, ...bd, daysUntil: Math.ceil((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) };
                    })
                    .sort((a, b) => a.daysUntil - b.daysUntil)
                    .slice(0, 10);

                const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const desc = upcoming.length > 0
                    ? upcoming.map(u => `🎂 <@${u.userId}> — ${months[u.month]} ${u.day} (in ${u.daysUntil} days)`).join('\n')
                    : 'No birthdays set yet!';
                await interaction.reply({ embeds: [new EmbedBuilder().setColor(0xFF69B4).setTitle('🎂 Upcoming Birthdays').setDescription(desc).setTimestamp()] });
            }
        } catch (error) { console.error('Error:', error); await interaction.reply({ content: '❌ An error occurred.', ephemeral: true }); }
    }
};
