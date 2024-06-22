import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";
// import ProductModel from "./ProductModel.js";

const OnlinePaymentDiscountModel = dbConnection.define(
  "online_payment_discount",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    discount: {
      type: DataTypes.BIGINT,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
    country_code: {
      type: DataTypes.STRING,
      defaultValue: "IN",
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
  { timestamps: false, tableName: "online_payment_discount" }
);

export default OnlinePaymentDiscountModel;
