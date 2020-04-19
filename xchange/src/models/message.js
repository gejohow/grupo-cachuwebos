module.exports = (sequelize, DataTypes) => {
  const message = sequelize.define(
    'message',
    {
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        allowNull: false,
      },
      negotiationId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'negotiations',
          key: 'id',
        },
        allowNull: false,
      },
      content: DataTypes.TEXT,
    },
    {},
  );

  message.associate = function associate(models) {
    message.belongsTo(models.user);
    message.belongsTo(models.negotiation);
  };

  return message;
};
