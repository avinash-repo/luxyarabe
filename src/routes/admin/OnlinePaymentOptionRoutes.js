import express from "express";
import { authorizeAdmin } from "../../middlewares/auth.js";
import OnlinePaymentOptionControllerObj from "../../controllers/admin/OnlinePaymentOptionController.js";

const OnlinePaymentOptionsRoutes = express.Router();

OnlinePaymentOptionsRoutes.post(
  "/add_online_payment_option",
  authorizeAdmin,
  OnlinePaymentOptionControllerObj?.addOnlinePaymentOption
);


export default OnlinePaymentOptionsRoutes;
