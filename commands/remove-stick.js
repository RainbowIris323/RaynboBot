const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { SendLog } = require('./../utility.js');
const { tables } = require('./../data-man.js')

module.exports = {
    data: new SlashCommandBuilder()
			.setName('remove-stick')
			.setDescription('removes a stuck message')
			.addChannelOption(option => option.setName('channel').setDescription('the channel to remove the stuck message'))
			.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
				let channel = interaction.options.getChannel('channel');
				if (!channel) channel = interaction.channel;
				await tables.sticks.destroy({ where: { channelID: channel.id } });
				interaction.reply('done!')
				SendLog(interaction.guild, 'Admin', `${interaction.user.username} has removed a message in ${channel}`);
    },
};