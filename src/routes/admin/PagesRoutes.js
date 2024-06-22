import express from "express";
import { authorize, authorizeAdmin } from "../../middlewares/auth.js";
import CurrencyControllerObj from "../../controllers/admin/adminCurrencyController.js";
import PagesObj from "../../controllers/admin/PagesController.js";
import { upload } from "../../helpers/multer.js";

const PagesRoutes = express.Router();

PagesRoutes.post(
  "/add_pages",
  authorizeAdmin,
  upload.fields([
    {
      name: "pages_image",
      maxCount: 1,
    },
  ]),
  PagesObj.addPage
);
PagesRoutes.delete(
  "/delete_pages",
  authorizeAdmin,
  PagesObj.deletePagesById
);

// PagesRoutes.get(
//   "/get_all_coupons",
//   authorize,
//   CouponObj.getAllCoupons
// );
// PagesRoutes.get(
//   "/get_coupon_by_id",
//   authorize,
//   CouponObj.getCouponById
// );
// PagesRoutes.delete(
//   "/delete_coupon_by_id",
//   authorize,
//   CouponObj.deleteCouponById
// );

export default PagesRoutes;
