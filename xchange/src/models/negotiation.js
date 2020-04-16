module.exports = (sequelize, DataTypes) => {
  const negotiation = sequelize.define('negotiation', {
    user1: DataTypes.STRING,
    user2: DataTypes.STRING,
    objects1: DataTypes.STRING,
    objects2: DataTypes.STRING,
  }, {});

  negotiation.associate = function associate() {
    // associations can be defined here. This method receives a models parameter.
  };

  return negotiation;
};
