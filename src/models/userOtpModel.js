import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";
const userOtpModel = dbConnection.define(
  "user_otps",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', // Assuming 'users' is the name of your users table
        key: 'id'
      }
    },
    otp_code: {
      type: DataTypes.STRING(4),
      allowNull: false
    },
    creation_time: {
      type: DataTypes.BIGINT,
      defaultValue: Date.now(), // DataTypes.NOW,
      allowNull: false
    },
    used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  { timestamps: false,tableName:"user_otps" }
);

export default userOtpModel;