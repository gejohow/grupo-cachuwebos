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
    const commentsData = [
      {
        description: 'sdfafasdfadfa',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'obihuweFBLHIUJERWAFGPIJNAREFG',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'hjkbaffyhebwa',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return queryInterface.bulkInsert('comments', commentsData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('comments', null, {}),
};
