const { Events, PermissionFlagsBits } = require('discord.js');
const { tables } = require('./../data-man.js');
const { SendLog } = require('./../utility.js')

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}
	
			try {
				SendLog(interaction.guild, 'Command', `${interaction.user.username} ran command "${interaction.commandName}"`);
				await command.execute(interaction);
			} catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
			}
		} else if (interaction.isStringSelectMenu()) {
			if (interaction.customId === 'LogMaker') {
				for ( const value of interaction.values ) {
					const guildData = tables.guilds.findOne({ where: { guildID: interaction.guild.id } });
					if (!guildData) return interaction.channel.send('please add your server to the database!');
					const channel = await interaction.guild.channels.create({name: value});
					interaction.channel.send(channel.id)
					interaction.channel.send('made channel');
					if (value === 'admin') {
						await tables.guilds.update({ AdminLogID: channel.id.toString() }, { where: { guildID: interaction.guild.id } });
						interaction.channel.send('admin log added to database!');
						SendLog(interaction.guild, 'Admin', `${interaction.user.username} has added a admin log channel`);
					} else if (value === 'mod') {
						await tables.guilds.update({ ModLogID: channel.id.toString() }, { where: { guildID: interaction.guild.id } });
						interaction.channel.send('mod log added to database!');
						SendLog(interaction.guild, 'Admin', `${interaction.user.username} has added a mod log channel`);
					} else if (value === 'ticket') {
						await tables.guilds.update({ TicketLogID: channel.id.toString() }, { where: { guildID: interaction.guild.id } });
						interaction.channel.send('ticket log added to database!');
						SendLog(interaction.guild, 'Admin', `${interaction.user.username} has added a ticket log channel`);
					} else if (value === 'error') {
						await tables.guilds.update({ ErrorLogID: channel.id.toString() }, { where: { guildID: interaction.guild.id } });
						interaction.channel.send('error log added to database!');
						SendLog(interaction.guild, 'Admin', `${interaction.user.username} has added a error log channel`);
					} else if (value === 'giveaway') {
						await tables.guilds.update({ GiveawayLogID: channel.id.toString() }, { where: { guildID: interaction.guild.id } });
						interaction.channel.send('giveaway log added to database!');
						SendLog(interaction.guild, 'Admin', `${interaction.user.username} has added a giveaway log channel`);
					} else if (value === 'automod') {
						await tables.guilds.update({ AutomodLogID: channel.id.toString() }, { where: { guildID: interaction.guild.id } });
						interaction.channel.send('automod log added to database!');
						SendLog(interaction.guild, 'Admin', `${interaction.user.username} has added a admin log channel`);
					} else if (value === 'command') {
						await tables.guilds.update({ CommandLogID: channel.id.toString() }, { where: { guildID: interaction.guild.id } });
						interaction.channel.send('Command log added to database!');
						SendLog(interaction.guild, 'Admin', `${interaction.user.username} has added a command log channel`);
					} else if (value === 'bot') {
						await tables.guilds.update({ BotLogID: channel.id.toString() }, { where: { guildID: interaction.guild.id } });
						interaction.channel.send('bot log added to database!');
						SendLog(interaction.guild, 'Admin', `${interaction.user.username} has added a bot log channel`);
					}
				}
				interaction.reply('done!')
			}
		};
	},
};