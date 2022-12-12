const fs = require('node:fs');
const path = require('node:path');
const dataMan = require('./data-man.js');
const { Client, Events, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent ] });

client.commands = new Collection();

let commandsPath = path.join(__dirname, 'commands');
let commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (let file of commandFiles) {
	let filePath = path.join(commandsPath, file);
	let command = require(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

commandsPath = path.join(__dirname, 'commands-test');
commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (let file of commandFiles) {
	filePath = path.join(commandsPath, file);
	command = require(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

try {
	client.login(token);
} catch (error) {
	console.log(error)
}