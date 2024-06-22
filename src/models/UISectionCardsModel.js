// models/UiSection.js
import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";
const UISectionCards = dbConnection.define(
  "UiSectionCards",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    slug: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ui_section_id: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    price: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    image1: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    image2: {
      type: DataTypes.STRING(255),
      allowNull: true,
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
    tableName: "ui_section_cards",
    timestamps: false, // Disable the default timestamps provided by Sequelize
    createdAt: "created_at", // Set the name of the created_at column
    updatedAt: "updated_at", // Set the name of the updated_at column
  }
);

export default UISectionCards;
