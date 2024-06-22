import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";

const ProductImageModel = dbConnection.define(
  "product_images",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    variant_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    images: {
      type: DataTypes.JSON,
      allowNull: false,
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
  { timestamps: false, tableName: "product_images" }
);

export default ProductImageModel;
