import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";

const ProductMaterialModel = dbConnection.define(
  "product_materials",
  {
    material_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: true,
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
  { timestamps: false, tableName: "product_materials" }
);

export default ProductMaterialModel;
