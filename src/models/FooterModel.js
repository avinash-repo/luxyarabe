import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";

const FooterModel = dbConnection.define(
  "footer_data",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    h1_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    h1_description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    social_media_data: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    footer_email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    footer_phone: {
      type: DataTypes.STRING,
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
  { timestamps: false, tableName: "footer_data" }
);

export default FooterModel;
