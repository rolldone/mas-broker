'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'gateways', // table name
      'middleware_sender', // new field name
      {
        type: Sequelize.JSON,
        allowNull: true,
      },
    )
    await queryInterface.addColumn(
      'gateways', // table name
      'middleware_receiver', // new field name
      {
        type: Sequelize.JSON,
        allowNull: true,
      },
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'gateways', // table name
      'middleware_sender')
    await queryInterface.removeColumn(
      'gateways', // table name
      'middleware_receiver')
  }
};
