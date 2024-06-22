import { addCurrencySchema } from "../../helpers/validateCurrency.js";
import { ReviewRatingStatusChangedchema, ReviewRatingchema } from "../../helpers/validateProductReview.js";
import AdminReviewServicesObj from "../../services/admin/AdminReviewServices.js";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

class AdminReviewController {
  async getReviewData(req, res) {
    try {
      AdminReviewServicesObj?.getReview(req, res);
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  async review_status_change(req, res) {
    try {
      let { error } = ReviewRatingStatusChangedchema.validate(req?.body, options);
      if (error) {
        return res
          .status(400)
          .json({ message: error.details[0]?.message, success: false });
      }

      AdminReviewServicesObj?.reviewStatusChange(req, res);
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  // async deleteReviewData(req, res) {
  //   try {
  //     if (!req.query.review_id) {
  //       return res.status(400).json({
  //         message: "Review id is mandatory",
  //         success: false,
  //         statusCode: 400,
  //       });
  //     }
  //     ReviewServicesObj?.deleteReview(req, res);
  //   } catch (err) {
  //     return res
  //       .status(500)
  //       .json({ message: err?.message, statusCode: 500, success: false });
  //   }
  // }
}

const AdminReviewControllerObj = new AdminReviewController();
export default AdminReviewControllerObj;
