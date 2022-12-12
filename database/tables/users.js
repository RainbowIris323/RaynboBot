const Sequelize = require('sequelize');

module.exports = {
    name: 'users',
    data: {
        userID: {
            type: Sequelize.INTEGER,
            unique: true,
            allowNull: false
        },
        messages: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
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
        },
    }
}