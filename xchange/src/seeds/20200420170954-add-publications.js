module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    const publicationsData = [
      {
        name: 'Test Publication 1',
        description: 'Esta es una prueba',
        state: 'new',
        type: 'Other',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Test Publication 2',
        description: 'Esta es una prueba',
        state: 'new',
        type: 'Other',
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return queryInterface.bulkInsert('publications', publicationsData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('publications', null, {}),
};
