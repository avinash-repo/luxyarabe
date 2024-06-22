import express from "express";
import ProductReviewControllerObj from "../../controllers/user/ProductReviewController.js";
import { authorize } from "../../middlewares/auth.js";

const ProductReviewRoutes = express.Router();

ProductReviewRoutes.post(
  "/add",
  authorize,
  ProductReviewControllerObj?.addReviewData
);
ProductReviewRoutes.delete(
  "/delete",
  authorize,
  ProductReviewControllerObj?.deleteReviewData
);
ProductReviewRoutes.get(
  "/get_by_id",
  ProductReviewControllerObj?.get_by_id
);
ProductReviewRoutes.get(
  "/check_user_give_review?",authorize,
  ProductReviewControllerObj?.check_user_give_review
);

export default ProductReviewRoutes;
