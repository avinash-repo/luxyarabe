import OrderModel from "../../models/OrderModel.js";
import ProductReviewModel from "../../models/ProductReviewModel.js";
import axios from "axios";
import { Op, Sequelize } from "sequelize";
import dbConnection from "../../config/dbConfig.js";
import ProductModel from "../../models/ProductModel.js";

class AdminReviewServices {
  async getReview(req, res) {
    try {
      let listQuery = `
      SELECT
        pr.id,
        pr.product_id,
        pr.user_id,
        pr.rate,
        pr.review,
        pr.status,
        p.id AS product_id,
        p.title AS product_title
      FROM
        product_reviews pr
      LEFT JOIN
        products p ON pr.product_id = p.id
    `;

      const replacements = {};
      let whereClauseAdded = false;

      listQuery += " GROUP BY p.id, pr.id";

      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      const offset = (page - 1) * limit;

      listQuery += ` LIMIT ${limit} OFFSET ${offset}`;

      let fetchOrderData = await dbConnection.query(listQuery, {
        replacements,
        type: dbConnection.QueryTypes.SELECT,
      });

      res.status(200).json({
        message: "Get",
        statusCode: 200,
        data: fetchOrderData,
        success: true,
      });
    } catch (err) {
      console.error(err, "Errrrrddd");
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  async reviewStatusChange(req, res) {
    try {
      let { review_id, status } = req.body;
      let fetchData = await ProductReviewModel.findOne({
        where: { id: review_id },
        raw: true,
      });
      if (fetchData) {
        await ProductReviewModel.update(
          { status: status },
          { where: { id: review_id } }
        );
        return res.status(200).json({
          message: "Review status changed successfully",
          statusCode: 200,
          success: true,
        });
      } else {
        return res.status(400).json({
          message: "Review not found",
          statusCode: 400,
          success: false,
        });
      }
    } catch (err) {console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  async deleteReview(req, res) {
    try {
      let { review_id } = req.query;
      let fetchReviewData = await ProductReviewModel.findOne({
        where: { user_id: req.id, id: review_id },
        raw: true,
      });
      if (!fetchReviewData) {
        return res.status(400).json({
          message: "Review not found or already deleted",
          statusCode: 400,
          success: false,
        });
      }
      await ProductReviewModel.destroy({ where: { id: fetchReviewData?.id } });
      return res.status(200).json({
        message: "Review deleted successfully",
        statusCode: 200,
        success: true,
      });
    } catch (err) {console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
}

const AdminReviewServicesObj = new AdminReviewServices();
export default AdminReviewServicesObj;
