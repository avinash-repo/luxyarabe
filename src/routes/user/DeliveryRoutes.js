import express from "express";
import { authorize } from "../../middlewares/auth.js";
import DeliveryControllerObj from "../../controllers/user/DeliveryController.js";

const DeliveryRoutes = express.Router();

// CartRoutes.post("/add_to_cart", authorize, CartControllerObj.addToCart);
DeliveryRoutes.get("/get_data", authorize, DeliveryControllerObj.getData);
DeliveryRoutes.get(
  "/get_data_by_id",
  authorize,
  DeliveryControllerObj.getDataById
  );
  DeliveryRoutes.get("/get_delivery_data",  DeliveryControllerObj.getNormalDelivery);

export default DeliveryRoutes;
