import express from "express";
import { authorize, authorizeAdmin } from "../../middlewares/auth.js";
import CurrencyControllerObj from "../../controllers/admin/adminCurrencyController.js";
import CouponObj from "../../controllers/admin/CouponController.js";

const CouponRoutes = express.Router();

CouponRoutes.post("/add_coupons", authorizeAdmin, CouponObj.addCoupon);
CouponRoutes.put("/update_coupons", authorizeAdmin, CouponObj.updateCoupon);
CouponRoutes.get("/get_all_coupons", authorizeAdmin, CouponObj.getAllCoupons);
CouponRoutes.get("/get_coupon_by_id", authorizeAdmin, CouponObj.getCouponById);
CouponRoutes.delete(
  "/delete_coupon_by_id",
  authorizeAdmin,
  CouponObj.deleteCouponById
);

CouponRoutes.put(
  "/update_status_by_id",
  authorizeAdmin,
  CouponObj.updateStatusById
);

export default CouponRoutes;
