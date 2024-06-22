import express from "express";
import { authorize } from "../../middlewares/auth.js";
import CurrencyControllerObj from "../../controllers/user/CurrencyController.js";

const CurrencyRoutes = express.Router();

// For Admin
// CurrencyRoutes.post(
//   "/add_currency",
//   authorize,
//   CurrencyControllerObj.addCurrency
// );

// For Admin
// CurrencyRoutes.delete(
//   "/delete_currency",
//   authorize,
//   CurrencyControllerObj.deleteCurrency
// );

// For Admin
// CurrencyRoutes.get(
//   "/get_all_currency",
//   authorize,
//   CurrencyControllerObj.getAllCurrency
// );

// For Admin
// CurrencyRoutes.get(
//   "/get_currency",
//   authorize,
//   CurrencyControllerObj.getCurrency
// );

// For User
CurrencyRoutes.get(
  "/get_all_currency_user",
  CurrencyControllerObj.getAllCurrency
);

// For User
CurrencyRoutes.get("/get_currency_user", CurrencyControllerObj.getCurrency);

export default CurrencyRoutes;
