import express from "express";
import AdminReviewControllerObj from "../../controllers/admin/AdminReviewController.js";
import { authorize, authorizeAdmin } from "../../middlewares/auth.js";

const AdminReviewRoutes = express.Router();

AdminReviewRoutes.get(
  "/get_all",
  authorizeAdmin,
  AdminReviewControllerObj?.getReviewData
);
AdminReviewRoutes.put(
  "/review_status_change",
  authorizeAdmin,
  AdminReviewControllerObj?.review_status_change
);
// AdminReviewRoutes.delete(
//   "/delete",
//   authorize,
//   AdminReviewControllerObj?.deleteReviewData
// );

export default AdminReviewRoutes;
