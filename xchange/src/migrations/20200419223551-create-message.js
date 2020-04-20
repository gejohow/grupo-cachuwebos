module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('messages', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'publications',
        key: 'id',
      },
      allowNull: false,
    },

    negotiationId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'publications',
        key: 'id',
      },
      allowNull: false,
    },

    content: Sequelize.TEXT,

    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),

  down: (queryInterface) => queryInterface.dropTable('messages'),
};
