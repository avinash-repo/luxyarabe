import express from "express";
import { authorizeAdmin } from "../../middlewares/auth.js";
import OnlinePaymentDiscountControllerObj from "../../controllers/admin/OnlinePaymentDiscountController.js";

const OnlinePaymentDiscountRoutes = express.Router();

OnlinePaymentDiscountRoutes.post(
  "/add",
  authorizeAdmin,
  OnlinePaymentDiscountControllerObj?.add
);
OnlinePaymentDiscountRoutes.get(
  "/get",
  authorizeAdmin,
  OnlinePaymentDiscountControllerObj?.getData
); //get only active
OnlinePaymentDiscountRoutes.put(
  "/change_status",
  authorizeAdmin,
  OnlinePaymentDiscountControllerObj?.updateStatus
);
OnlinePaymentDiscountRoutes.delete(
  "/destroyDataOf",
  // authorizeAdmin,
  OnlinePaymentDiscountControllerObj?.destroyDataOf
);

export default OnlinePaymentDiscountRoutes;
