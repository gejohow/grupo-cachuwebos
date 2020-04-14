module.exports = (sequelize, DataTypes) => {
  const publication = sequelize.define('publication', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    state: DataTypes.STRING,
    type: DataTypes.STRING,
    negotiated: DataTypes.STRING,
  }, {});

  publication.associate = function associate() {
    // associations can be defined here. This method receives a models parameter.
  };

  return publication;
};
