import express from "express";
import { authorize, authorizeAdmin } from "../../middlewares/auth.js";
import { upload } from "../../helpers/multer.js";
import DashboardControllerObj from "../../controllers/admin/AdminDashboardDataController.js";

const DashboardDataRoutes = express.Router();
DashboardDataRoutes.get(
  "/get",
  authorizeAdmin,
  DashboardControllerObj.get_data
);
DashboardDataRoutes.get(
  "/get_data",
  authorizeAdmin,
  DashboardControllerObj.get_order_data
);

DashboardDataRoutes.get(
  "/get_user_data",
  authorizeAdmin,
  DashboardControllerObj.get_user_data
);

DashboardDataRoutes.get(
  "/get_best_seller_product",
  authorizeAdmin,
  DashboardControllerObj.get_best_seller_product
);
DashboardDataRoutes.get(
  "/get_profit",
  authorizeAdmin,
  DashboardControllerObj.get_profit
);

DashboardDataRoutes.get('/fetch_live_user',DashboardControllerObj.fetch_live_user)
DashboardDataRoutes.get('/fetch_live_insights_clarity',DashboardControllerObj.fetchLiveInsightsClarityData)

export default DashboardDataRoutes;
