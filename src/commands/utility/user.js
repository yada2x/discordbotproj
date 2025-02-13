const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Provides information about the user.'),
    async execute(interaction) {
        await interaction.reply(`Command run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
    },
};
