const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { SendLog } = require('./../utility.js');
const { tables } = require('./../data-man.js')

module.exports = {
    data: new SlashCommandBuilder()
			.setName('stick')
			.setDescription('sticks a message to the front of a channel')
			.addStringOption(option => option.setName('message').setDescription('the message to stick').setRequired(true))
			.addChannelOption(option => option.setName('channel').setDescription('the channel to stick the message'))
			.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
				const message = interaction.options.getString('message');
				let channel = interaction.options.getChannel('channel');
				if (!channel) channel = interaction.channel;
				const x = await channel.send(message);
				try {
					await tables.sticks.create({ channelID: channel.id.toString(), message: message, messageID: x.id});
					SendLog(interaction.guild, 'Admin', `user ${interaction.user.username} has stuck "${message}" to ${channel}`);
					interaction.reply('done!')
				} 
				catch (error) {
					if (error.name === 'SequelizeUniqueConstraintError') {
						return interaction.reply('A message already exists there, use `/change-stick` to change it or `/remove-stick` to remove it.');
					} else {
						return interaction.reply(error.message);
					}
				}
    },
};