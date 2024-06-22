import express from "express";
import CouponControllerObj from "../../controllers/user/CouponController.js";
import { authorize } from "../../middlewares/auth.js";
const CouponRoutesUser = express.Router();
CouponRoutesUser.get(
  "/get_available_coupons",
  authorize,
  CouponControllerObj.getAvailableCoupons
);
CouponRoutesUser.get(
  "/get_buy_coupons_only",
  authorize,
  CouponControllerObj.getGetBuyCouponsOnly
);
export default CouponRoutesUser;
