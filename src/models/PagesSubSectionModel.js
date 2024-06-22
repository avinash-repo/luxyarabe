import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";

const PagesSubSectionModel = dbConnection.define(
  "pages_sub_sections",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    position: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    page_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    heading_one: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    heading_two: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paragraph: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    button: {
      type: DataTypes.JSON,
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
  { timestamps: false, tableName: "pages_sub_sections" }
);

export default PagesSubSectionModel;
