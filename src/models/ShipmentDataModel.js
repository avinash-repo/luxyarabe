import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";
const ShipmentData = dbConnection.define(
  "shipment_data",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    product_num: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
    },
    shipment_length: {
      type: DataTypes.DOUBLE.UNSIGNED,
      allowNull: false,
    },
    shipment_width: {
      type: DataTypes.DOUBLE.UNSIGNED,
      allowNull: false,
    },
    shipment_height: {
      type: DataTypes.DOUBLE.UNSIGNED,
      allowNull: false,
    },
    shipment_weight: {
      type: DataTypes.DOUBLE.UNSIGNED,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: dbConnection.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: dbConnection.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    timestamps: false, // Disable sequelize-generated timestamps
  }
);
export default ShipmentData;
