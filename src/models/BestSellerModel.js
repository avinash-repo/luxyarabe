import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";

const BestSellerModel = dbConnection.define(
  "bestseller",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    variant_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    position: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.ENUM("fashion_trend", "best_seller"),
      defaultValue:'best_seller'
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
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
  { timestamps: false, tableName: "bestseller" }
);

export default BestSellerModel;
