const Sequelize = require('sequelize');
const fs = require('node:fs');

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const tables = {};
const tableFiles = fs.readdirSync('./database/tables').filter(file => file.endsWith('.js'));

for (const file of tableFiles) {
	const table = require(`./database/tables/${file}`);
	tables[table.name] = sequelize.define(table.name, table.data);
	tables[table.name].sync();
}
const sequelize2 = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'do_not_remove.sqlite',
});

/*
xp: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        level: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
							*/

tables['users1'] = sequelize2.define('users1', {
	userID: {
		type: Sequelize.INTEGER,
		unique: true,
		allowNull: false
  },
	xp: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	level: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
}});

tables['users1'].sync();

module.exports = {
	tables: tables
};