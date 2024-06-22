import express from "express";
import { authorize, authorizeAdmin } from "../../middlewares/auth.js";
import OrderControllerObj from "../../controllers/admin/AdminOrderController.js";
const OrderAdminRoutes = express.Router();

OrderAdminRoutes.put(
  "/update_delivery_date",
  authorizeAdmin,
  OrderControllerObj.update_delivery_date
);
OrderAdminRoutes.put(
  "/update_order_status",
  authorizeAdmin,
  OrderControllerObj.update_order_status_date
);
OrderAdminRoutes.put(
  "/update_order_payment_status",
  authorizeAdmin,
  OrderControllerObj.update_order_payment_status
);
OrderAdminRoutes.get("/get_all", authorizeAdmin, OrderControllerObj.get_all);
OrderAdminRoutes.get(
  "/get_filtered_orders",
  authorizeAdmin,
  OrderControllerObj.getFilteredOrders
);
// api for total revenue graph on admin
OrderAdminRoutes.get(
  "/get_graph_data_subtotal",
  authorizeAdmin,
  OrderControllerObj.fetchGraphDataSubtotal
);
// api for total orders graph on admin
OrderAdminRoutes.get(
  "/get_graph_data_order",
  authorizeAdmin,
  OrderControllerObj.fetchGraphDataOrders
);

//delivery_Date, shipping_date, out_for_delivery_date, delivery charges manage here
OrderAdminRoutes.post(
  "/change_delivery_days",
  authorizeAdmin,
  OrderControllerObj.update_delivery_day_for_all
);
OrderAdminRoutes.get(
  "/get_delivery_day_data",
  authorizeAdmin,
  OrderControllerObj.fetch_delivery_data
);
OrderAdminRoutes.delete(
  "/delete_delivery_day_data",
  authorizeAdmin,
  OrderControllerObj.delete_delivery_data
);
export default OrderAdminRoutes;
