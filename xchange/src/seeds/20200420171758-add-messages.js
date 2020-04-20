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
    const messagesData = [
      {
        userId: 1,
        negotiationId: 1,
        content: "Mensaje 1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        negotiationId: 1,
        content: "Respuesta Mensaje 1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        negotiationId: 2,
        content: "Mensaje 2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        negotiationId: 2,
        content: "Respuesta Mensaje 2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return queryInterface.bulkInsert('messages', messagesData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('messages', null, {}),
};

