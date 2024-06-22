import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";

const filterProduct = dbConnection.define(
  "filter_products",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    gender: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    shape: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    color: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    material: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    size: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    weight_group: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    price_range: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    categories: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    frame_type: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { timestamps: false, tableName: "filter_products" }
);

export default filterProduct;
