module.exports = (sequelize, DataTypes) => {
  const comment = sequelize.define('comment', {
    description: DataTypes.TEXT,
    publicationId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'publications',
        key: 'id',
      },
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
      allowNull: false,
    },
  }, {});

  comment.associate = function associate(models) {
    // associations can be defined here. This method receives a models parameter.
    comment.belongsTo(models.publication);
    comment.belongsTo(models.user);
  };

  return comment;
};
