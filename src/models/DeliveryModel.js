import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";

const deliveryModel = dbConnection.define(
  "delivery",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      default: "india",
    },
    country_code: {
      type: DataTypes.STRING,
      defaultValue: "IN",
    },
    discount: { type: DataTypes.BIGINT, allowNull: true },
    delivery_charges: { type: DataTypes.BIGINT },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { timestamps: false, tableName: "delivery" }
);

export default deliveryModel;
