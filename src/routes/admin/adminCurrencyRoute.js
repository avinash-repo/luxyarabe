import express from "express";
import { authorize } from "../../middlewares/auth.js";
import CurrencyControllerObj from "../../controllers/admin/adminCurrencyController.js";
// import CurrencyControllerObj from "../../controllers/user/CurrencyController.js";


const AdminCurrencyRoutes = express.Router();

AdminCurrencyRoutes.post(
  "/add_currency",
  authorize,
  CurrencyControllerObj.addCurrency
);

AdminCurrencyRoutes.put(
  "/update_status_for_user_view",
  authorize,
  CurrencyControllerObj.UpdateStatus
);
AdminCurrencyRoutes.get(
  "/get_all_currency",
  authorize,
  CurrencyControllerObj.getAllCurrency
);

AdminCurrencyRoutes.get(
  "/get_currency",
  authorize,
  CurrencyControllerObj.getCurrency
);


AdminCurrencyRoutes.get("/get_currency_user", CurrencyControllerObj.getCurrency);
export default AdminCurrencyRoutes;
