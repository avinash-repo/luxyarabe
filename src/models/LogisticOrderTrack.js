import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";
const LogisticOrderTrack = dbConnection.define(
  "logistic_order_track",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    awb_number: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    latest_scan_time: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    live_status: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    remark: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    edd_date: {
      type: DataTypes.STRING(255),
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
    },
  },
  {
    timestamps: false,
    tableName: "logistic_order_track",
  }
);
export default LogisticOrderTrack;
