module.exports = (sequelize, DataTypes) => {
  const review = sequelize.define('review', {
    description: DataTypes.TEXT,
    puntuation: DataTypes.FLOAT,
  }, {});

  review.associate = function associate() {
    // associations can be defined here. This method receives a models parameter.
  };

  return review;
};
