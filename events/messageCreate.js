const { Events, PermissionsBitField } = require('discord.js');
const { tables } = require('./../data-man.js');
const { SendLog, Sleep } = require('./../utility.js')

async function warn(message, content) {
	x = await message.channel.send(content);
	try {
		await message.delete();
		SendLog(message.guild, 'Automod', `message from ${message.author.username} removed for word "${word}"`);
	} catch (error) {
		
	}
	await Sleep(5000);
	x.delete();
}


module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		if (message.author.bot) return;
		console.log(message.author.bot);
		const stickData = await tables.sticks.findOne({where: { channelID: message.channel.id }});
		if (stickData) {
			try {
				await message.channel.messages.fetch(stickData.get('messageID')).then(message1 => {
				message1.delete()
			});
			} catch (error) {
			}
			const e = await message.channel.send(stickData.message);
			console.log(stickData.get('messageID'))
			console.log(e.id)
			await tables.sticks.update({ messageID: e.id }, {where: { channelID: message.channel.id }});
		};
		if (!message.guild.members.cache.get(message.author.id).permissions.has(PermissionsBitField.Flags.Administrator)) {
			const guildData = await tables.guilds.findOne({ where: { guildID: message.guild.id}});
			if (guildData) {
				let banned = guildData.get('bannedWords');
				if (banned) {
					banned.split(';').forEach(async word => {
						if (message.cleanContent.toLowerCase().includes(word)) {
								warn(message, `${message.author} no using banned words!`)
						};
					});
				}
			}
		}
		const userData = await tables.users1.findOne({ where: { userID: message.author.id }});
		if (!userData) {
			await tables.users1.create({
				userID: message.author.id,
			});
			return;
		};
		//userData.increment('messages');
		userData.increment('xp');
		if (userData.xp >= ( userData.level + 1 ) * ( ( userData.level + 1 ) / 2 * 100 ) ) {
			userData.increment('level');
			message.channel.send(`${message.author.username} is now level ${userData.level + 1}!`);
		};
	},
};