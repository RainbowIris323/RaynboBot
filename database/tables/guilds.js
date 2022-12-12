const Sequelize = require('sequelize');

module.exports = {
    name: 'guilds',
    data: {
        guildID: {
            type: Sequelize.INTEGER,
            unique: true,
            allowNull: false
        },
        AdminLogID: {
            type: Sequelize.STRING,
            defaultValue: null,
            allowNull: true,
        },
				ModLogID: {
            type: Sequelize.STRING,
            defaultValue: null,
            allowNull: true,
        },
				TicketLogID: {
            type: Sequelize.STRING,
            defaultValue: null,
            allowNull: true,
        },
				ErrorLogID: {
            type: Sequelize.STRING,
            defaultValue: null,
            allowNull: true,
        },
				GiveawayLogID: {
            type: Sequelize.STRING,
            defaultValue: null,
            allowNull: true,
        },
				AutomodLogID: {
            type: Sequelize.STRING,
            defaultValue: null,
            allowNull: true,
        },
				CommandLogID: {
            type: Sequelize.STRING,
            defaultValue: null,
            allowNull: true,
        },
				BotLogID: {
            type: Sequelize.STRING,
            defaultValue: null,
            allowNull: true,
        },
				Lv5roleID: {
            type: Sequelize.STRING,
            defaultValue: null,
            allowNull: true,
        },
				Lv10roleID: {
            type: Sequelize.STRING,
            defaultValue: null,
            allowNull: true,
        },
				Lv20roleID: {
            type: Sequelize.STRING,
            defaultValue: null,
            allowNull: true,
        },
				Lv30roleID: {
            type: Sequelize.STRING,
            defaultValue: null,
            allowNull: true,
        },
				countingChannelID: {
            type: Sequelize.STRING,
            defaultValue: null,
            allowNull: true,
        },
				chainChannelID: {
            type: Sequelize.STRING,
            defaultValue: null,
            allowNull: true,
        },
				bannedWords: {
						type: Sequelize.STRING,
            defaultValue: null,
            allowNull: true,
				},
			
    }
}