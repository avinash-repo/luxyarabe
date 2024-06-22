import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";
import UserModel from "./UserModel.js";
import ProductModel from "./ProductModel.js";

const ProductReviewModel = dbConnection.define(
  "product_reviews",
  {
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    rate: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    review: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
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
  { timestamps: false, tableName: "product_reviews" }
);

ProductReviewModel.belongsTo(UserModel, { foreignKey: "user_id" });
// ProductReviewModel.belongsTo(ProductModel, { foreignKey: "id" });

export default ProductReviewModel;
