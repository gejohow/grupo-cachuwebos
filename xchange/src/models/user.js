module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    password: DataTypes.STRING,
  }, {});

  user.associate = function associate() {
    // associations can be defined here. This method receives a models parameter.
  };

  return user;
};
