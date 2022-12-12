const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const Canvas = require('@napi-rs/canvas');
const { request } = require('undici');
const { Image, Sleep } = require('./../utility.js');
const { tables } = require('./../data-man.js')



module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('info on a user or current server')
		.addSubcommand(subcommand =>
		subcommand
			.setName('user')
			.setDescription('looks up a user')
			.addUserOption(option => option.setName('user').setDescription('the user to lookup')))
		.addSubcommand(subcommand =>
		subcommand
			.setName('server')
			.setDescription('gets server info')),
	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'user') {
			let user = interaction.options.getUser('user');
			if (!user) {
				user = interaction.user
			}
			const userData = await tables.users1.findOne({ where: { userID: user.id } });
			const image = await new Image(750, 250);
			await image.background()
			await image.addText(user.username, 80, 450, 250, 80);
			if (userData) {
				await image.addText(`Level: ${userData.get('level')} | Xp: ${userData.get('xp')}`, 80, 450, 250, 200);
			}
			await image.addRect(250, 120, 450, 10, '#ff007b', true);
			await image.addPFP(25, 25, 100, user);
			image.finish(null, interaction);
			
		} else if (interaction.options.getSubcommand() === 'server') {
			await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
		}
	},
};