const Sequelize = require('sequelize');

module.exports = {
    name: 'sticks',
    data: {
        channelID: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        message: {
            type: Sequelize.STRING,
            defaultValue: 0,
            allowNull: false,
        },
				messageID: {
            type: Sequelize.STRING,
            defaultValue: 0,
            allowNull: false,
        },
    }
}