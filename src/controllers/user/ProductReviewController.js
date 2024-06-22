import { addCurrencySchema } from "../../helpers/validateCurrency.js";
import { ReviewRatingchema } from "../../helpers/validateProductReview.js";
import ReviewServicesObj from "../../services/user/ProductReviewServices.js";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

class ProductReviewController {
  async addReviewData(req, res) {
    try {
      let { error } = ReviewRatingchema.validate(req?.body, options);
      if (error) {
        return res
          .status(400)
          .json({ message: error.details[0]?.message, success: false });
      }

      ReviewServicesObj?.addReview(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async deleteReviewData(req, res) {
    try {
      if (!req.query.review_id) {
        return res
          .status(400)
          .json({
            message: "Review id is mandatory",
            success: false,
            statusCode: 400,
          });
      }
      ReviewServicesObj?.deleteReview(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  
  async get_by_id(req, res) {
    try {
      if (!req.query.id) {
        return res
          .status(400)
          .json({
            message: "Product id is mandatory",
            success: false,
            statusCode: 400,
          });
      }
      ReviewServicesObj?.fetchProductReviewById(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }


  async check_user_give_review(req, res) {
    try {
      if (!req.query.id) {
        return res
          .status(400)
          .json({
            message: "Product id is mandatory",
            success: false,
            statusCode: 400,
          });
      }
      ReviewServicesObj?.check_user_give_review_data(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  
}

const ProductReviewControllerObj = new ProductReviewController();
export default ProductReviewControllerObj;
