import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";
const UserAddressModel = dbConnection.define(
  "user_addresses",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    full_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    zipcode: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    house_no: {
      type: DataTypes.STRING(10),
      defaultValue: null,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    landmark: {
      type: DataTypes.STRING(255),
      defaultValue: null,
    },
    mobile: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { timestamps: false, tableName: "user_addresses" }
);

export default UserAddressModel;
