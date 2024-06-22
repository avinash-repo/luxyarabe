import express from "express";
import { authorize } from "../../middlewares/auth.js";
import paymentOptionsControllerObj from "../../controllers/user/PaymentOptionsController.js";

const PaymentOptionsRoutes = express.Router();

PaymentOptionsRoutes.get(
  "/get_payment_options/:country",
  authorize,
  paymentOptionsControllerObj.getPaymentMethods
);

export default PaymentOptionsRoutes;
