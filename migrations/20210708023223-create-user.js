'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      first_name : {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_name : {
        type: Sequelize.STRING,
        allowNull: true
      },
      email : {
        type: Sequelize.STRING,
        allowNull: false
      },
      password : {
        type: Sequelize.TEXT,
        allowNull: false
      },
      status : {
        type: Sequelize.INTEGER(1),
        allowNull: false,
        defaultValue : 0
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
    await queryInterface.dropTable('users');
  }
};