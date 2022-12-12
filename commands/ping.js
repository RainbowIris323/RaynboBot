const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('ping').setDescription('says pong'),
    async execute(interaction) {
        await interaction.reply('pong');
    },
};