const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { SendLog } = require('./../utility.js');
const { tables } = require('./../data-man.js')

module.exports = {
    data: new SlashCommandBuilder()
			.setName('start-count')
			.setDescription('makes a channel a counting channel')
			.addChannelOption(option => option.setName('channel').setDescription('the channel to count in'))
			.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
				let channel = interaction.options.getChannel('channel');
				if (!channel) channel = interaction.channel;
				channel.send('count begin: next number is "1"');
				tables.guilds.update({ countingChannelID: channel.id }, { where: { guildID: interaction.guild.id }});
				SendLog(interaction.guild, 'Admin', `user ${interaction.user.username} has made "${channel}" a counting channel`);
				interaction.reply('done!')
    },
};