module.exports = (sequelize, DataTypes) => {
  const review = sequelize.define('review', {
    description: DataTypes.TEXT,
    puntuation: DataTypes.FLOAT,
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
      allowNull: false,
    },
    creatorId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
      allowNull: false,
    }
  }, {});

  review.associate = function associate(models) {
    // associations can be defined here. This method receives a models parameter.
    review.belongsTo(models.user);
    review.belongsTo(models.user, {as: 'creator'});
  };

  return review;
};
