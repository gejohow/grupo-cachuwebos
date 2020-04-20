module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('publicationNegotiations', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    publicationId: {
      type: Sequelize.INTEGER,
    },
    negotiationId: {
      type: Sequelize.INTEGER,
    },

    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),

  down: (queryInterface) => queryInterface.dropTable('publicationNegotiations'),
};
