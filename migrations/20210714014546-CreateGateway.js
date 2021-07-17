'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('gateways', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id : {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      group_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      sender_id : {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      receiver_id : {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      sender_name : {
        type: Sequelize.STRING,
        allowNull:false
      },
      receiver_name : {
        type : Sequelize.STRING,
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
    await queryInterface.dropTable('gateways');
  }
};
