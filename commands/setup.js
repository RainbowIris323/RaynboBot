const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { tables } = require('./../data-man.js');
const { SendLog } = require('./../utility.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setup')
		.setDescription('perform server setup')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand(subcommand =>
			subcommand
				.setName('server')
				.setDescription('set up the servers data in the database'))
		.addSubcommandGroup(subcommandgroup =>
		subcommandgroup
			.setName('blacklist')
			.setDescription('manage blacklisted words')
			.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('add a blacklisted word')
				.addStringOption(option => option.setName('word').setDescription('word to add(no spaces)').setRequired(true)))
			.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('remove a blacklisted word')
				.addStringOption(option => option.setName('word').setDescription('word to remove').setRequired(true)))
			.addSubcommand(subcommand =>
			subcommand
				.setName('remove-all')
				.setDescription('remove all blacklisted words')))
		.addSubcommandGroup(subcommandgroup =>
		subcommandgroup
			.setName('channel')
			.setDescription('setup channels for different functions')
			.addSubcommand(subcommand =>
			subcommand
				.setName('logs')
				.setDescription('set up log channels'))),
	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'server') {
			try {
				await tables.guilds.create({
					guildID: interaction.guild.id,
				})
				SendLog(interaction.guild, 'Admin', `${interaction.user.username} has set up the server in the database`);
				return interaction.reply(`this server has been added to the database.`);
			} catch (error) {
				if (error.name === 'SequelizeUniqueConstraintError') {
					return interaction.reply('this server already exists on the database.');
				} else {
					return interaction.reply(error.message);
				}
			};
		} else if (interaction.options.getSubcommandGroup() === 'channel') {
			if (interaction.options.getSubcommand() === 'logs') {
				const row = new ActionRowBuilder()
					.addComponents(
						new StringSelectMenuBuilder()
							.setCustomId('LogMaker')
							.setPlaceholder('pick log types')
							.setMinValues(1)
							.setMaxValues(6)
							.addOptions([
								{
									label: 'Admin logs',
									description: 'Admin logs include database/server setup',
									value: 'admin',
								},
								{
									label: 'Mod logs',
									description: 'Mod logs include things like banning and kicking',
									value: 'mod',
								},
								{
									label: 'Ticket logs',
									description: 'Ticket logs include automatic ticket actions',
									value: 'ticket',
								},
								{
									label: 'Error logs',
									description: 'this includes errors with code mainly for debug reasons',
									value: 'error',
								},
								{
									label: 'Giveaway logs',
									description: 'Giveaway logs include made/canceled/finished giveaways',
									value: 'giveaway',
								},
								{
									label: 'Automod logs',
									description: 'Automod logs include offenses by members and how the bot responded',
									value: 'automod',
								},
								{
									label: 'Command logs',
									description: 'Command logs include all commands executed',
									value: 'command',
								},
								{
									label: 'Bot logs',
									description: 'Bot logs include actions from the bot not triggered by a user',
									value: 'bot',
								},
							]),
					);
				await interaction.reply({ content: 'Select Logs To Add', components: [row] });
			}
		} else if (interaction.options.getSubcommandGroup() === 'blacklist') {
			if (interaction.options.getSubcommand() === 'add') {
				const word = interaction.options.getString('word');
				if (!word) return interaction.reply('please select a word!');
				if (word.includes(' ') || word.includes(';')) return interaction.reply('no spaces or semi-colons!');
				const guildData = await tables.guilds.findOne({ where: { guildID: interaction.guild.id } });
				if (!guildData) return interaction.reply('please add your server to the database!');
				const banned = guildData.get('bannedWords');
				if (banned) {
					await tables.guilds.update({ bannedWords: `${guildData.get('bannedWords')};${word}` }, { where: { guildID: interaction.guild.id } });
				} else if (!banned) {
					await tables.guilds.update({ bannedWords: word }, { where: { guildID: interaction.guild.id } });
				}
				SendLog(interaction.guild, 'Admin', `${interaction.user.username} added "${word}" to the banned word list`)
				return interaction.reply('added the word to the blacklist!')
				
			} else if (interaction.options.getSubcommand() === 'remove') {
				const word = interaction.options.getString('word');
				if ( word.includes(' ') || word.includes(';') ) return interaction.reply('no spaces or semi-colons!');
				const guildData = await tables.guilds.findOne({ where: { guildID: interaction.guild.id } });
				if (!guildData) return interaction.reply('please add your server to the database!');
				let banned = guildData.get('bannedWords');
				if (!banned) return interaction.reply('there are no banned words!');
				if (!banned.includes(word)) return interaction.reply('that word is not banned!');
				if (banned.includes(';')) {
					banned = banned.split(';').filter(function(ele){ return ele != word; });
					await tables.guilds.update({ bannedWords: banned.join(';') }, { where: { guildID: interaction.guild.id } });
				} else {
					await tables.guilds.update({ bannedWords: null }, { where: { guildID: interaction.guild.id } });
				};
				SendLog(interaction.guild, 'Admin', `${interaction.user.username} removed "${word}" to the banned word list`)
				return interaction.reply('removed the word from the blacklist!')
			} else if (interaction.options.getSubcommand() === 'remove-all') {
				await tables.guilds.update({ bannedWords: null }, { where: { guildID: interaction.guild.id } });
				SendLog(interaction.guild, 'Admin', `${interaction.user.username} removed all words from the banned word list`)
				return interaction.reply('removed all the words from the blacklist!')
			}
		}
	}
};