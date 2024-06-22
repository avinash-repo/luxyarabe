import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";
import ProductColorModel from "./ProductColorModel.js";

const ProductVariantModel = dbConnection.define(
  "product_variants",
  {
    variant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    product_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    thumbnail_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    color_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    variant_price_details: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "active",
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
  { timestamps: false, tableName: "product_variants" }
);
export default ProductVariantModel;
