module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('negotiations', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    user1: {
      type: Sequelize.STRING,
    },
    user2: {
      type: Sequelize.STRING,
    },
    objects1: {
      type: Sequelize.STRING,
    },
    objects2: {
      type: Sequelize.STRING,
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

  down: (queryInterface) => queryInterface.dropTable('negotiations'),
};
