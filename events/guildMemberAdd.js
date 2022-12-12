const { Events } = require('discord.js');
const { tables } = require('./../data-man.js');

module.exports = {
	name: Events.GuildMemberAdd,
	async execute(user) {
		if (user.bot) return;
		try {
			await tables.users.create({
				userID: user.id,
			})
			console.log(`${user.username} has been added to the database`);
		}
		catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
				return console.warn('That user already exists.');
			} else {
				return console.error(error.message);
			}
		}
	},
};