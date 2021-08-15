'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'adapters', // table name
      'deletedAt', // new field name
      {
        allowNull: true,
        type: Sequelize.DATE
      },
    )
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.removeColumn(
      'adapters', // table name
      'deletedAt')
  }
};
