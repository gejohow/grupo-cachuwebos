module.exports = (sequelize, DataTypes) => {
  const comment = sequelize.define('comment', {
    description: DataTypes.TEXT,
  }, {});

  comment.associate = function associate() {
    // associations can be defined here. This method receives a models parameter.
  };

  return comment;
};
