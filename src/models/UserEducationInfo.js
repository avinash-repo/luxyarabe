import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";

const UserEducationInfoModel = dbConnection.define(
  "user_education_info",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    full_name: {
      type: DataTypes.STRING,
    },
    university_name: {
      type: DataTypes.STRING,
    },
    id_card_img: {
      type: DataTypes.STRING,
    },
    university_id: {
      type: DataTypes.BIGINT,
    },
    used: {
      type: DataTypes.TINYINT,
      defaultValue:0
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
    approve: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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
  { timestamps: false, tableName: "user_education_info" }
);

export default UserEducationInfoModel;
