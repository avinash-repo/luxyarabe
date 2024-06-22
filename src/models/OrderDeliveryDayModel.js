import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";
const OrderDeliveryDayModel = dbConnection.define(
  "order_delivery_day",
  {
    delivery_day: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    shipping_day: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    out_for_delivery_day: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    country_code: {
      type: DataTypes.STRING,
      defaultValue: "IN",
    },
    country: {
      type: DataTypes.STRING,
      defaultValue: "IN",
    },
    normal_delivery_charges: {
      type: DataTypes.BIGINT,
      allowNull: false,
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
  { timestamps: false, tableName: "order_delivery_day" }
);
export default OrderDeliveryDayModel;
