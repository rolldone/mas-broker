'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'adapter_events', // table name
      'deletedAt', // new field name
      {
        allowNull: true,
        type: Sequelize.DATE
      },
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'adapter_events', // table name
      'deletedAt')
  }
};
