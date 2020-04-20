module.exports = (sequelize, DataTypes) => {
  const publicationNegotiation = sequelize.define('publicationNegotiation', {
    publicationId: DataTypes.INTEGER,
    negotiationId: DataTypes.INTEGER,
  }, {});

  publicationNegotiation.associate = function associate() {
    // associations can be defined here. This method receives a models parameter.
  };

  return publicationNegotiation;
};
