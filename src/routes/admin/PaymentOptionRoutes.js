import express from "express";
import { authorizeAdmin } from "../../middlewares/auth.js";
import PaymentOptionControllerObj from "../../controllers/admin/PaymentOptionController.js";

const PaymentOptionRoutes = express.Router();

PaymentOptionRoutes.post(
  "/add_payment_option",
  authorizeAdmin,
  PaymentOptionControllerObj?.addPaymentOption
);
PaymentOptionRoutes.get("/fetch_payment_option",authorizeAdmin,PaymentOptionControllerObj.fetchAllPaymentData)
PaymentOptionRoutes.delete("/remove_payment_option",authorizeAdmin,PaymentOptionControllerObj.removePaymentOption)

//fetch fro produc availablity table 
PaymentOptionRoutes.get("/fetch_all_zipcode_available",authorizeAdmin,PaymentOptionControllerObj?.getAllZipCodeData)
PaymentOptionRoutes.post('/add_cod_zip_code',authorizeAdmin,PaymentOptionControllerObj?.add_cod_zip_code)


export default PaymentOptionRoutes;
