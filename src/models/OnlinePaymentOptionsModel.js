import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";

const PaymentOptionsModel = dbConnection.define(
  "online_payment_options",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    payment_name: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    country_code: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
    is_local: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    status: {
        type: DataTypes.ENUM,
        allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  { timestamps: false, tableName: "online_payment_options" }
);

export default PaymentOptionsModel;
