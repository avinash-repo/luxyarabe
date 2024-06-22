import { DataTypes } from "sequelize";
import dbConnection from "../config/dbConfig.js";
const FrameSizeConfig = dbConnection.define(
  "FrameSizeConfig",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    heading: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: dbConnection.literal("CURRENT_TIMESTAMP"),
      onUpdate: dbConnection.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "frame_sizes_config", // Specify the actual table name in the database
    timestamps: false, // Disable Sequelize's default timestamps behavior
  }
);
export default FrameSizeConfig;
