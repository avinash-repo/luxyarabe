import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";
const CouponModel = dbConnection.define(
  "coupons",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("fixed", "percent", "buy_get"),
      allowNull: false,
      defaultValue: "fixed",
    },

    value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
    new_user: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "inactive",
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    expired_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    min_purchase: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    max_purchase: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    limit: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    category_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    // sub_category_id: {
    //   type: DataTypes.BIGINT,
    //   allowNull: true,
    // },
    // product_id: {
    //   type: DataTypes.BIGINT,
    //   allowNull: true,
    // },
    // variant_id: {
    //   type: DataTypes.BIGINT,
    //   allowNull: true,
    // },
    buy_product: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    get_product: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    used: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    max_uses_per_user: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 1,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "IN",
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
  { timestamps: false, tableName: "coupons" }
);

export default CouponModel;
