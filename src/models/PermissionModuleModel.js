import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";

const PermissionModuleModel = dbConnection.define(
  "permission_modules",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
    backend_routes: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    frontend_routes: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    // variant_price_details: {
    //   type: DataTypes.JSON,
    //   allowNull: true,
    // },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deleted_at: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  },
  { timestamps: false, tableName: "permission_modules" }
);
export default PermissionModuleModel;
