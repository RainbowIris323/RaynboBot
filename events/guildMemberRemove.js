const { Events } = require('discord.js');
const { tables } = require('./../data-man.js');

module.exports = {
	name: Events.GuildMemberRemove,
	async execute(user) {
		if (user.bot) return;
		const rowCount = await tables.users.destroy({ where: { userID: user.id } });
		if (!rowCount) return console.warn(`${user.username} doesn't exist on the database.`);
		console.log(`${user.username} has been removed from the database`);
	},
};