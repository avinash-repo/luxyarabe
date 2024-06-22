import OrderModel from "../../models/OrderModel.js";
import ProductReviewModel from "../../models/ProductReviewModel.js";
import axios from "axios";
import { Op, Sequelize, literal } from "sequelize";
import dbConnection from "../../config/dbConfig.js";
import ProductModel from "../../models/ProductModel.js";
import UserModel from "../../models/UserModel.js";

class ReviewServices {
  async addReview(req, res) {
    try {
      // console.log(req.id, "req.idreq.idreq.idreq.id");
      const { product_id, rate, review } = req.body;

      // let query = `
      //   SELECT
      //     id,
      //     order_id,
      //     user_id,
      //     address_id,
      //     variant_quantity,
      //     coupon_id,
      //     sub_total,
      //     delivery_charges,
      //     payment_method,
      //     payment_status,
      //     status,
      //     card_details,
      //     country_code,
      //     card_data,
      //     txn_id,
      //     order_date,
      //     delivery_date,
      //     delivery_instructions
      //   FROM
      //     orders
      //   WHERE
      //     user_id = :userId
      //     AND JSON_CONTAINS(variant_quantity, JSON_ARRAY(JSON_OBJECT('product_id', :productId)), '$')
      //   LIMIT 1;
      // `;

      // let fetchOrderData = await dbConnection.query(query, {
      //   type: dbConnection.QueryTypes.SELECT,
      //   replacements: { userId: req.id, productId: product_id },
      // });

      let fetchOrderData = await OrderModel.findAll({
        where: literal(`
          user_id = ${req.id} AND 
          JSON_CONTAINS(variant_quantity, '{"product_id": ${product_id}}') 
        `),
        raw: true,
        attributes: ["variant_quantity", "user_id", "order_id", "id", "status"],
      });
      fetchOrderData = fetchOrderData.filter((el) => el?.status == "delivered");
      // console.log(fetchOrderData,"fetchOrderDatafetchOrderData")
      if (fetchOrderData && fetchOrderData?.length == 0) {
        return res.status(400).json({
          message: "Dont have access to review this product",
          statusCode: 400,
          success: false,
        });
      }

      let checkProductIsActive = await ProductModel.findOne({
        where: { id: product_id, status: "active" },
        raw: true,
      });
      // console.log(
      //   checkProductIsActive,
      //   "checkProductIsActivecheckProductIsActive"
      // );
      if (!checkProductIsActive) {
        return res.status(400).json({
          message: "Product is not available",
          statusCode: 400,
          success: false,
        });
      }
      let checkReviewGiven = await ProductReviewModel.findOne({
        where: { user_id: req.id, product_id: product_id },
        raw: true,
      });

      let obj = {
        user_id: req.id,
        product_id,
        rate,
        review,
        status: "active",
      };
      let statusCode;
      let message = "";
      if (checkReviewGiven && checkReviewGiven?.id) {
        statusCode = 200;
        obj.updated_at = Date.now();
        await ProductReviewModel.update(obj, {
          where: { id: checkReviewGiven?.id },
        });
        
        message = "Review update successfully";
      } else {
        await ProductReviewModel.create(obj);
        statusCode = 200;
        message = "Review add successfully";
      }
      res.status(statusCode).json({
        message,
        statusCode: statusCode,
        success: true,
      });
    } catch (err) {
      console.log(err, "Errrrrddd");
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
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async fetchProductReviewById(req, res) {
    try {
      // console.log(req.query.id, "eeeeeeeeee");
      let fetchData;
        fetchData = await ProductReviewModel.findAll({
          where: { product_id: req.query.id, status: "active" },
          include: [
            {
              model: UserModel,
              attributes: ["id", "name"],
              raw: true,
            },
          ],
          // raw: true,
        });
      fetchData?.sort(
        (a, b) => new Date(b?.created_at) - new Date(a?.created_at)
      );

      // console.log(fetchData, "eeeeeeeee");
      const ratings = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      let totalUsers = 0;

      // fetchData.forEach((review) => {
      //   const rating = review?.rate;
      //   ratings[rating] = (ratings[rating] || 0) + 1;
      //   totalUsers += 1;
      // });
      if (fetchData && fetchData.length) {
        fetchData.forEach((review) => {
          const rating = review?.rate;
          ratings[rating] += 1;
          totalUsers += 1;
        });
      }
      const percentageRatings = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      for (const rating in ratings) {
        const percentage = (ratings[rating] / totalUsers) * 100;
        if (percentage) {
          percentageRatings[rating] = percentage.toFixed(1);
        }
      }
      // console.log(percentageRatings);
      let totalWeightedSum = 0;
      for (const rating in ratings) {
        totalWeightedSum += rating * ratings[rating];
      }
      let overallRating = totalWeightedSum / totalUsers;
      if (overallRating) {
        overallRating = overallRating.toFixed(1);
      }
      return res.status(200).json({
        message: "get data",
        statusCode: 200,
        success: true,
        data: ratings,
        overallRating: overallRating,
        percentageRatings,
        fetchData,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async fetchProductReviewByIdUSer(req, res) {
    try {
      let fetchData;
   
        fetchData = await ProductReviewModel.findAll({
          where: { product_id: req.query.id, status: "active" },
          raw: true,
        });
      const ratings = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      let totalUsers = 0;

      // fetchData.forEach((review) => {
      //   const rating = review?.rate;
      //   ratings[rating] = (ratings[rating] || 0) + 1;
      //   totalUsers += 1;
      // });
      if (fetchData && fetchData.length) {
        fetchData.forEach((review) => {
          const rating = review?.rate;
          ratings[rating] += 1;
          totalUsers += 1;
        });
      }
      const percentageRatings = {};
      for (const rating in ratings) {
        const percentage = (ratings[rating] / totalUsers) * 100;
        if (percentage) {
          percentageRatings[rating] = percentage.toFixed(1);
        }
      }
      // console.log(percentageRatings);
      let totalWeightedSum = 0;
      for (const rating in ratings) {
        totalWeightedSum += rating * ratings[rating];
      }
      let overallRating = totalWeightedSum / totalUsers;
      if (overallRating) {
        overallRating = overallRating.toFixed(1);
      }
      return res.status(200).json({
        message: "get data",
        statusCode: 200,
        success: true,
        data: ratings,
        overallRating: overallRating,
        percentageRatings,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  async check_user_give_review_data(req, res) {
    try {
      // console.log(req.id, "req.iddddddddddddddddddddd");
      let findProductExist = await ProductModel.findOne({
        where: { id: req.query.id },
        raw: true,
      });
      if (!findProductExist) {
        return res.status(400).json({
          message: "Product not exit",
          statusCode: 400,
          success: false,
        });
      }
      let fetchOrderData = await OrderModel.findAll({
        where: literal(`
          user_id = ${req.id} AND 
          JSON_CONTAINS(variant_quantity, '{"product_id": ${req.query.id}}') 
        `),
        raw: true,
        attributes: ["variant_quantity", "user_id", "order_id", "id", "status"],
      });
      fetchOrderData = fetchOrderData.filter((el) => el?.status == "delivered");

      if (fetchOrderData?.length == 0) {
        return res.status(400).json({
          message: "Product not purchase yet",
          statusCode: 400,
          success: false,
        });
      }
      let checkUserGiveReview = await ProductReviewModel.findOne({
        where: { user_id: req.id, product_id: req.query.id },
        raw: true,
      });
      if (checkUserGiveReview && checkUserGiveReview.id) {
        return res.status(200).json({
          message: "Edit",
          statusCode: 200,
          success: false,
        });
      } else {
        return res.status(200).json({
          message: "User eligible for giving review",
          statusCode: 200,
          success: true,
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
}

const ReviewServicesObj = new ReviewServices();
export default ReviewServicesObj;
