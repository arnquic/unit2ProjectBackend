'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class packItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.packItem.belongsToMany(models.record, { through: "packList" });
    }
  };
  packItem.init({
    name: DataTypes.TEXT,
    type: DataTypes.STRING,
    weatherUse: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'packItem',
  });
  return packItem;
};