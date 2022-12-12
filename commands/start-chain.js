const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { SendLog } = require('./../utility.js');
const { tables } = require('./../data-man.js')

module.exports = {
    data: new SlashCommandBuilder()
			.setName('start-chain')
			.setDescription('makes a channel a chain channel')
			.addStringOption(option => option.setName('chained').setDescription('the word for the chain').setRequired(true))
			.addChannelOption(option => option.setName('channel').setDescription('the channel to make a chain in'))
			.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
				let channel = interaction.options.getChannel('channel');
				let phrase = interaction.options.getString('chained');
				if (!channel) channel = interaction.channel;
				channel.send('chain has begun...');
				channel.send(phrase);
				tables.guilds.update({ chainChannelID: channel.id }, { where: { guildID: interaction.guild.id }});
				SendLog(interaction.guild, 'Admin', `user ${interaction.user.username} has made "${channel}" a chain channel`);
				interaction.reply('done!')
    },
};