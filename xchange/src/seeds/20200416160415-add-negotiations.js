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
    const negotiationsData = [
      {
        userOneId: 1,
        userTwoId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userOneId: 2,
        userTwoId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return queryInterface.bulkInsert('negotiations', negotiationsData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('negotiations', null, {}),
};
