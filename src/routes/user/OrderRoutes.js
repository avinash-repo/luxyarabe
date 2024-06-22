import express from "express";
import { authorize, authorizeAdmin } from "../../middlewares/auth.js";
import OrderControllerObj from "../../controllers/user/OrderController.js";

const OrderRoutes = express.Router();

OrderRoutes.post("/create_order", authorize, OrderControllerObj.createOrder);
OrderRoutes.put("/update_status", authorize, OrderControllerObj.updateOrder);
OrderRoutes.put(
  "/update_status_by_network_gateway",
  authorize,
  OrderControllerObj.updateOrderbyNetworkGateway
);
OrderRoutes.post(
  "/create_payment_intent",
  authorize,
  OrderControllerObj.create_payment_intent
);
OrderRoutes.post(
  "/createpaymentusingnetwork",
  authorize,
  OrderControllerObj.createPaymentUsingNetwork
);

// For User
OrderRoutes.get("/get_order", authorize, OrderControllerObj.get_order);
OrderRoutes.get(
  "/get_track_order",
  authorize,
  OrderControllerObj.get_track_order
);

OrderRoutes.put(
  "/request_return",
  authorize,
  OrderControllerObj.request_return
);

OrderRoutes.put("/cancel_order", authorize, OrderControllerObj.cancel_order);

OrderRoutes.get(
  "/download_invoice",
  authorize,
  OrderControllerObj.downloadInvoice
);

//cashfree routes
OrderRoutes.post(
  "/cashfree_create_order",
  authorize,
  OrderControllerObj.cashfreeCreateOrder
);
OrderRoutes.get(
  "/cashfree_check_order/:orderId",
  authorize,
  OrderControllerObj.cashfreeCheckOrder
);
export default OrderRoutes;
