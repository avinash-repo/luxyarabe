import express from "express";
import { authorize, authorizeAdmin } from "../../middlewares/auth.js";
import OrderControllerObj from "../../controllers/user/OrderController.js";
import EducationInfoControllerObj from "../../controllers/user/EducationInfoController.js";
import { educationImage } from "../../helpers/multer.js";

const EducationInfoRoutes = express.Router();

EducationInfoRoutes.post(
  "/add",
  educationImage.single("id_card_img"),
  authorize,
  EducationInfoControllerObj.add
);
// EducationInfoRoutes.get("/get_one", authorize, EducationInfoControllerObj.get_one);
// EducationInfoRoutes.get("/get_by_id", authorize, EducationInfoControllerObj.get_by_id);
EducationInfoRoutes.get("/get", authorize, EducationInfoControllerObj.get);
EducationInfoRoutes.put(
  "/change_status",
  authorize,
  EducationInfoControllerObj.change_status
);

// OrderRoutes.put("/update_status", authorize, EducationInfoControllerObj.updateOrder);
// OrderRoutes.post(
//   "/create_payment_intent",
//   authorize,
//   OrderControllerObj.create_payment_intent
// );

// // For User
// OrderRoutes.get("/get_order", authorize, OrderControllerObj.get_order);
// OrderRoutes.get(
//   "/get_track_order",
//   authorize,
//   OrderControllerObj.get_track_order
// );

// OrderRoutes.put(
//   "/request_return",
//   authorize,
//   OrderControllerObj.request_return
// );

// OrderRoutes.put("/cancel_order", authorize, OrderControllerObj.cancel_order);

// OrderRoutes.get(
//   "/download_invoice",
//   authorize,
//   OrderControllerObj.downloadInvoice
// );

export default EducationInfoRoutes;
