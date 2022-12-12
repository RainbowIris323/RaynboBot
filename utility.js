const { AttachmentBuilder } = require('discord.js');
const Canvas = require('@napi-rs/canvas');
const { request } = require('undici');
const { tables } = require('./data-man.js')

const applyText = (canvas, text, maxSize, maxWidth) => {
	const context = canvas.getContext('2d');
	do {
		context.font = `${maxSize -= 5}px sans-serif`;
	} while (context.measureText(text).width > maxWidth);
	return context.font;
};
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};
module.exports = {
	Sleep: function(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
   },
	SendLog: async function(guild, logType, message) {
		const guildData = await tables.guilds.findOne({ where: { guildID: guild.id } });
		if (!guildData) return;
		if (!guildData.get(`${logType}LogID`)) return;
		guild.channels.cache.get(guildData.get(`${logType}LogID`)).send(message);
	},
	Image: class {
		constructor(width, height) {
			this.canvas = Canvas.createCanvas(width, height);
			this.context = this.canvas.getContext('2d');
		}
		async background(border = '#ff007b') {
			const background =  await Canvas.loadImage('./storage/canvas.jpg');
			this.context.drawImage(background, 0, 0, this.canvas.width, this.canvas.height);
			this.context.strokeStyle = border;
			this.context.strokeRect(0, 0, this.canvas.width, this.canvas.height);
		}
		addText(text, maxSize, maxWidth, x, y, color = '#ff007b') {
			if (!text) return;
			this.context.font = applyText(this.canvas, text, maxSize, maxWidth);
			this.context.fillStyle = color;
			this.context.fillText(text, x, y);
		}
		addRect(x, y, width, height, color = '#ff007b', fill = false) {
			if (fill) {
				this.context.fillStyle = color;
				this.context.fillRect(x, y, width, height);
			} else {
				this.context.strokeStyle = color;
				this.context.strokeRect(x, y, width, height);
			}
		}
		async addPFP(x, y, radius, user, border = '#ff007b') {
			this.context.strokeStyle = border;
			this.context.beginPath();
			this.context.arc(x+radius, y+radius, radius, 0, Math.PI * 2);
			this.context.stroke();
			this.context.closePath();
			this.context.beginPath();
			this.context.arc(x+radius, y+radius, radius, 0, Math.PI * 2, true);
			this.context.closePath();
			this.context.clip();
			const { body } = await request(user.displayAvatarURL({ extension: 'jpg' }));
			const avatar = await Canvas.loadImage(await body.arrayBuffer());
			this.context.drawImage(avatar, x, y, radius*2, radius*2);
		}
		async finish(channel, interaction, name = 'image') {
			if (interaction) {
				interaction.reply({ files: [new AttachmentBuilder(await this.canvas.encode('png'), { name: `${name}.png` })] });
			}
			if (channel){
				channel.send({ files: [new AttachmentBuilder(await this.canvas.encode('png'), { name: `${name}.png` })] });
			}
		}
	}
}