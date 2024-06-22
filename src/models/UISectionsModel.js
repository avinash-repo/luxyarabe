// models/UiSection.js
import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";
const UiSection = dbConnection.define(
  "UiSection",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    // module_name: {
    //   type: DataTypes.STRING(255),
    //   allowNull: false,
    // },
    slug: {
      type: DataTypes.STRING(199),
      allowNull: false,
    },
    module_heading: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    position: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING(255),
    },
    module_description: {
      type: DataTypes.STRING(1000),
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
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
    tableName: "ui_sections",
    timestamps: false, // Disable the default timestamps provided by Sequelize
    createdAt: "created_at", // Set the name of the created_at column
    updatedAt: "updated_at", // Set the name of the updated_at column
  }
);

export default UiSection;
