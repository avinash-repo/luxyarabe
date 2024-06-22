import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";


const AdminUserModel = dbConnection.define(
  "admin_users",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email_verified_at: {
      type: DataTypes.DATE,
    },
    password: {
      type: DataTypes.STRING,
    },
    photo: {
      type: DataTypes.STRING,
    },
    country: {
      type: DataTypes.STRING,
      defaultValue: "IN",
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
    role: {
      type: DataTypes.ENUM("admin", "super_admin"),
      allowNull: false,
      defaultValue: "admin",
    },
    remember_token: {
      type: DataTypes.STRING,
    },
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
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // phone: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
  },
  { timestamps: false, tableName: "admin_users" }
);

export default AdminUserModel;
