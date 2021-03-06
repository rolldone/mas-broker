'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('events', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            group_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            event_key: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            status: {
                type: Sequelize.INTEGER(1),
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('events');
    }
};
//# sourceMappingURL=20210710074755-CreateEvent.js.map