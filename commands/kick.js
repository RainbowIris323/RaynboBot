const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { SendLog } = require('./../utility.js');

module.exports = {
    data: new SlashCommandBuilder()
			.setName('kick')
			.setDescription('kicks a user')
			.addUserOption(option => option.setName('user').setDescription('the user to kick').setRequired(true))
			.addStringOption(option => option.setName('reason').setDescription('why to kick this member'))
			.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
				const reason = interaction.options.getString('reason');
				interaction.guild.members.kick(user);
				SendLog(interaction.guild, 'Mod', `Kicked ${user.username} for "${reason}"`);
				if (reason) return interaction.reply(`Kicked ${user.username} for "${reason}"`);
				return interaction.reply(`Kicked ${user.username}`);
			
    },
};