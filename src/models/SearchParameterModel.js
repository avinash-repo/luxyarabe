import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";

const SearchParametersModel = dbConnection.define(
  "search_parameters",
  {
    search_params: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    search_count: {
      type: DataTypes.BIGINT,
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
  { timestamps: false, tableName: "search_parameters" }
);

export default SearchParametersModel;
