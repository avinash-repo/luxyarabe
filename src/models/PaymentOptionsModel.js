import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";

const PaymentOptionsModel = dbConnection.define(
  "payment_options",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    payment_options: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    zip_codes: {
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
  { timestamps: false, tableName: "payment_options" }
);

export default PaymentOptionsModel;
