const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { SendLog } = require('./../utility.js');

module.exports = {
    data: new SlashCommandBuilder()
			.setName('ban')
			.setDescription('bans a user')
			.addUserOption(option => option.setName('user').setDescription('the user to ban').setRequired(true))
			.addStringOption(option => option.setName('reason').setDescription('why to ban this member'))
			.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
				const reason = interaction.options.getString('reason');
				interaction.guild.members.ban(user);
				SendLog(interaction.guild, 'Mod', `Banned ${user.username} for "${reason}"`);
				if (reason) return interaction.reply(`Banned ${user.username} for "${reason}"`);
				return interaction.reply(`Banned ${user.username}`);
    },
};