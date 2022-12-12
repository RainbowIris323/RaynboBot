const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { tables } = require('./../data-man.js');
const { SendLog } = require('./../utility.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('database')
		.setDescription('access the DataBase')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommandGroup(subcommandgroup =>
		subcommandgroup
			.setName('users')
			.setDescription('access the user database')
			.addSubcommand(subcommand =>
			subcommand
				.setName('view')
				.setDescription('view user data from the database')
				.addUserOption(option => option.setName('user').setDescription('the user to view').setRequired(true)))
			.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('add a user to the database')
				.addUserOption(option => option.setName('user').setDescription('the user to add').setRequired(true)))
			.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('removes a user from the database')
				.addUserOption(option => option.setName('user').setDescription('The user to remove').setRequired(true)))
			.addSubcommand(subcommand =>
					subcommand
						.setName('addall')
						.setDescription('adds all server members to the database'))),
	async execute(interaction) {
		if (interaction.options.getSubcommandGroup() === 'users') {
			if (interaction.options.getSubcommand() === 'add') {
				try {
					const user = interaction.options.getUser('user');
					await tables.users.create({
						userID: user.id,
					})
					SendLog(interaction.guild, 'Admin', `${interaction.user.username} has added ${user.username} to the database!`);
					return interaction.reply(`${user.username} has been added to the database`);
				}
				catch (error) {
					if (error.name === 'SequelizeUniqueConstraintError') {
						return interaction.reply('That user already exists.');
					} else {
						return interaction.reply(error.message);
					}
				}
			} else if (interaction.options.getSubcommand() === 'remove') {
				const user = interaction.options.getUser('user');
				const rowCount = await tables.users.destroy({ where: { userID: user.id } });
				if (!rowCount) return interaction.reply(`${user.username} doesn't exist on the database.`);
				SendLog(interaction.guild, 'Admin', `${interaction.user.username} has removed ${user.username} to the database.`);
				interaction.reply(`${user.username} has been removed from the database`);
			} else if (interaction.options.getSubcommand() === 'view') {
				const user = interaction.options.getUser('user');
				const userData = await tables.users.findOne({ where: { userID: user.id } });
				if (!userData) return interaction.reply(`${user.username} doesn't exist on the database.`);
				return interaction.reply(`data for user ${user.username}:\n messages: ${userData.messages}\n xp: ${userData.xp}\n level: ${userData.level}`)
			} else if (interaction.options.getSubcommand() === 'addall') {
				interaction.guild.members.fetch().then(members => members.forEach(async user => {
					if (user.bot) return;
					try {
						await tables.users.create({
							userID: user.id,
						})
						return interaction.channel.send(`${user.username} has been added to the database`);
					}
					catch (error) {
						if (error.name === 'SequelizeUniqueConstraintError') {
							return interaction.channel.send('That user already exists.');
						} else {
							return interaction.channel.send(error.message);
						}
					};
				}));
				SendLog(interaction.guild, 'Admin', `${interaction.user.username} has added all users to the database!`);
				interaction.reply('done!')
			}
		}
	}
};