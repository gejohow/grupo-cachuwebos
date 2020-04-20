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
    const usersData = [
      {
        description: 'Este wn es piola',
        puntuation: 3.5,
        userId: 1,
        creatorId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Este wn es piola',
        puntuation: 5,
        userId: 1,
        creatorId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return queryInterface.bulkInsert('reviews', usersData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('reviews', null, {}),
};
