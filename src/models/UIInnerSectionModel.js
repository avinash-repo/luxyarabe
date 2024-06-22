// models/UiSection.js
import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";
const UiInnerSection = dbConnection.define(
  "ui_inner_sections",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    slug: {
      type: DataTypes.STRING(199),
      allowNull: false,
    },
    heading: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(1000),
    },
    category_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    sub_category_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "#faebd7",
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
    remarks: {
      type: DataTypes.STRING(255),
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    tableName: "ui_inner_sections",
    timestamps: false, // Disable the default timestamps provided by Sequelize
    createdAt: "created_at", // Set the name of the created_at column
    updatedAt: "updated_at", // Set the name of the updated_at column
  }
);

export default UiInnerSection;
