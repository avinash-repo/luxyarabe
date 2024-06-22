import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";
const LogisticPartnerModel = dbConnection.define(
  "logistic_partners",

  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: dbConnection.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "logistic_partners",
    timestamps: false,
  }
);

export default LogisticPartnerModel;
