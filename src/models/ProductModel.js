import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";
import ProductVariantModel from "./ProductVariantModel.js";
import CategoryModel from "./CategoryModel.js";
import SeoModel from "./SeoModel.js";

const ProductModel = dbConnection.define(
  "products",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    frame_type_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    summary: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    condition: {
      type: DataTypes.ENUM("hot", "new"),
      defaultValue: "default",
    },

    gender: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
    thumbnail_img: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    cat_id: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    weight_group_id: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    size_id: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    is_student: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
    frame_width: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    lens_width: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    lens_height: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    bridge_width: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    temple_length: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    material_id: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    shape_id: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
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
  { timestamps: false, tableName: "products" }
);

// ProductModel.hasMany(ProductVariantModel, {
//   as: "variants",
//   foreignKey: "product_id",
// });

export default ProductModel;
