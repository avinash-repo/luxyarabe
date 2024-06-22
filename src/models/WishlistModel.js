import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";

const WishlistModel = dbConnection.define(
  "wishlists",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    // product_variant_id: {
    //   type: DataTypes.BIGINT,
    //   allowNull: false,
    // },
    // color_id: {
    //   type: DataTypes.BIGINT,
    //   allowNull: false,
    // },
    user_id: {
      type: DataTypes.BIGINT,
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
    deleted_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { timestamps: false, tableName: "wishlists" }
);

export default WishlistModel;
