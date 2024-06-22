import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";
const LogisticData = dbConnection.define(
  "logistic_data",
  {
    status: {
      type: DataTypes.STRING(100),
      allowNull: false,
      after: "id",
    },
    order_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    html_message: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    remark: {
      type: DataTypes.STRING(255),
      allowNull: true,
      after: "html_message",
    },
    waybill: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      after: "remark",
    },
    refnum: {
      type: DataTypes.STRING(255),
      allowNull: true,
      after: "waybill",
    },
    logistic_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      after: "refnum",
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Date.now(),
      after: "logistic_name",
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Date.now(),
      after: "created_at",
    },
  },
  { timestamps: false, tableName: "logistic_data" }
);
export default LogisticData;
