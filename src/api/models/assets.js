"use strict";

const { Model } = require("sequelize");
// const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Assets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Assets.init(
    {
      ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      price: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
    },
    {
      sequelize,
      modelName: "Assets",
      tableName: "Assets".toLowerCase(),
    }
  );
  // const level = await Assets.findAll();
  return Assets;
};
