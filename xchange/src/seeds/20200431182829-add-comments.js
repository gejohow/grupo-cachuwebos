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
    const commentsData = [
      {
        description: "Comentario 1",
        userId: 1,
        publicationId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: "Comentario 2",
        userId: 2,
        publicationId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return queryInterface.bulkInsert('comments', commentsData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('comments', null, {}),
};
