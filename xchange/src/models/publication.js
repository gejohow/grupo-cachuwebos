module.exports = (sequelize, DataTypes) => {
  const publication = sequelize.define('publication', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    state: DataTypes.STRING,
    type: DataTypes.STRING,
    negotiated: DataTypes.STRING,
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  }, {});

  publication.associate = function associate(models) {
    // associations can be defined here. This method receives a models parameter.
    publication.hasMany(models.comment);
    publication.belongsTo(models.user);
  };

  return publication;
};
