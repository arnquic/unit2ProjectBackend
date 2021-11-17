'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class weather extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.weather.hasMany(models.record);
    }
  };
  weather.init({
    past5days: DataTypes.STRING,
    today: DataTypes.STRING,
    next7days: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'weather',
  });
  return weather;
};