'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class record extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.record.belongsTo(models.user);
      models.record.belongsTo(models.weather);
      models.record.belongsToMany(models.packItem, { through: "packList" });
    }
  };
  record.init({
    cityId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    weatherId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'record',
  });
  return record;
};