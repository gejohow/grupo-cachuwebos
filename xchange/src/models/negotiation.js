module.exports = (sequelize, DataTypes) => {
  const negotiation = sequelize.define('negotiation', {
    userOneId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    userTwoId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    objects1: DataTypes.STRING,
    objects2: DataTypes.STRING,
  }, {});

  negotiation.associate = function associate(models) {
    // associations can be defined here. This method receives a models parameter.
    negotiation.belongsToMany(models.publication, {
      through: 'publicationNegotiation',
      as: 'publications',
      foreignKey: 'negotiationId',
      otherKey: 'publicationId',
    });
    negotiation.belongsTo(models.user, { as: 'userOne' });
    negotiation.belongsTo(models.user, { as: 'userTwo' });
  };

  return negotiation;
};
