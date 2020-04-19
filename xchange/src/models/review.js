module.exports = (sequelize, DataTypes) => {
  const review = sequelize.define('review', {
    description: DataTypes.TEXT,
    puntuation: DataTypes.FLOAT,
  }, {});

  review.associate = function associate(models) {
    // associations can be defined here. This method receives a models parameter.
    review.belongsTo(models.user, {as: 'user', foreignKey: 'userId'});
  };

  return review;
};
