import express from "express";
import { authorize, authorizeAdmin } from "../../middlewares/auth.js";
import RoleControllerObj from "../../controllers/admin/adminRoleController.js";
// import CurrencyControllerObj from "../../controllers/user/CurrencyController.js";


const AdminRoleRoutes = express.Router();

AdminRoleRoutes.post(
  "/add",
  authorizeAdmin,
  RoleControllerObj.add_role
);

AdminRoleRoutes.put(
  "/update_status",
  authorizeAdmin,
  RoleControllerObj.UpdateStatus
);

AdminRoleRoutes.get(
  "/get_all",
  authorizeAdmin,
  RoleControllerObj.get_all
);

AdminRoleRoutes.get(
  "/get_active",
  authorizeAdmin,
  RoleControllerObj.get_active
);

AdminRoleRoutes.delete("/destroy",authorizeAdmin,RoleControllerObj.destroy)

// AdminRoleRoutes.get("/get_currency_user", CurrencyControllerObj.getCurrency);
export default AdminRoleRoutes;
