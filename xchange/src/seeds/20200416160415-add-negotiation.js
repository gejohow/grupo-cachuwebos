module.exports = {
  up: (queryInterface) => {
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
        user1: 'Germán',
        user2: 'Negro',
        objects1: 'pelota',
        objects2: 'bicicleta',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user1: 'thrth',
        user2: 'Nrthrth',
        objects1: 'pthhh',
        objects2: 'bicighg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return queryInterface.bulkInsert('negotiations', negotiationsData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('negotiations', null, {}),
};
