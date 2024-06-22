import express from "express";
import DeliveryControllerObj from "../../controllers/admin/adminDeliveryController.js";
import { authorize, authorizeAdmin } from "../../middlewares/auth.js";

const AdminDeliveryRoutes = express.Router();

AdminDeliveryRoutes.post("/add", authorizeAdmin, DeliveryControllerObj?.add);
AdminDeliveryRoutes.get(
  "/getData",
  authorizeAdmin,
  DeliveryControllerObj?.getData
);
AdminDeliveryRoutes.delete(
  "/delete",
  authorizeAdmin,
  DeliveryControllerObj?.deleteData
);

export default AdminDeliveryRoutes;
