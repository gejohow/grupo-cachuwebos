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
  }, {});

  comment.associate = function associate(models) {
    // associations can be defined here. This method receives a models parameter.
    comment.belongsTo(models.publication);
  };

  return comment;
};
