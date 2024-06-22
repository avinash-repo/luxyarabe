import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";
const ProductAvailability = dbConnection.define(
  "ProductAvailability",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    country_code: {
      type: DataTypes.STRING(2),
      allowNull: false,
      defaultValue: "IN",
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "India",
    },
    currency_symbol: {
      type: DataTypes.STRING(5),
      defaultValue: "₹",
    },
    zipcodes: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "active",
    },
    tax_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tax_value: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false, // Set to true if you want Sequelize to manage createdAt and updatedAt fields
    tableName: "product_availability",
  }
);

// module.exports = ProductAvailability;
export default ProductAvailability;
