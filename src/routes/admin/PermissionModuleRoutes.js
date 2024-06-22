import express from "express";
import PermissionmoduleControllerObj from "../../controllers/admin/PermissionModuleController.js";
import { authorize, authorizeAdmin } from "../../middlewares/auth.js";

const PermissionMOduleReviewRoutes = express.Router();

PermissionMOduleReviewRoutes.post(
  "/add",
  authorizeAdmin,
  PermissionmoduleControllerObj?.add_data
);
PermissionMOduleReviewRoutes.put(
  "/edit",
  authorizeAdmin,
  PermissionmoduleControllerObj?.edit_data
);

PermissionMOduleReviewRoutes.get(
  "/get_all_data",
  authorizeAdmin,
  PermissionmoduleControllerObj?.get_all_data
);
// get_active_data
PermissionMOduleReviewRoutes.get(
  "/get_active_data",
  authorizeAdmin,
  PermissionmoduleControllerObj?.get_active_data
);
PermissionMOduleReviewRoutes.get(
  "/get_permission_data",
  authorizeAdmin,
  PermissionmoduleControllerObj?.get_permission_data
);
PermissionMOduleReviewRoutes.delete(
  "/destroy_by_id",
  authorizeAdmin,
  PermissionmoduleControllerObj?.deleteData
);

export default PermissionMOduleReviewRoutes;
