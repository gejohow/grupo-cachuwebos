module.exports = (sequelize, DataTypes) => {
  const negotiation = sequelize.define('negotiation', {
    user1: DataTypes.STRING,
    user2: DataTypes.STRING,
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
  };

  return negotiation;
};
