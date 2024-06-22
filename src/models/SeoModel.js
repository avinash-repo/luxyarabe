import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";
import ProductModel from "./ProductModel.js";

const SeoModel = dbConnection.define(
  "seo",
  {
    // title: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    meta_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    meta_description: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
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
  { timestamps: false, tableName: "seo" }
);

// SeoModel.belongsTo(ProductModel, { foreignKey: "product_id" });

export default SeoModel;
