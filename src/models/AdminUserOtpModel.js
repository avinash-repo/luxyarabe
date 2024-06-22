import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";

const adminUserOtpModel = dbConnection.define(
  "admin_user_otps",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "admin_users", // Assuming 'users' is the name of your users table
        key: "id",
      },
    },
    otp_code: {
      type: DataTypes.STRING(4),
      allowNull: false,
    },
    creation_time: {
      type: DataTypes.BIGINT,
      defaultValue: Date.now(), // DataTypes.NOW,
      allowNull: false,
    },
    used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
  { timestamps: false, tableName: "admin_user_otps" }
);

export default adminUserOtpModel;
