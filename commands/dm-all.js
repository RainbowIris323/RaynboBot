const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { SendLog } = require('./../utility.js');

module.exports = {
    data: new SlashCommandBuilder()
			.setName('dm-all')
			.setDescription('Dms all users in a server a message')
			.addStringOption(option => option.setName('message').setDescription('the message to send').setRequired(true))
			.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const message = interaction.options.getString('message');
				await interaction.guild.members.cache.forEach(async member => {
					try {
						await member.send(message);
					} catch {
					}
				});
				interaction.reply('sent!');
				SendLog(interaction.guild, 'Admin', `user "${interaction.user.username}" has sent all members "${message}"`)
    },
};