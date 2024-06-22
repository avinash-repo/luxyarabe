import express from "express";
import { authorize } from "../../middlewares/auth.js";
import CartControllerObj from "../../controllers/user/CartController.js";

const CartRoutes = express.Router();

CartRoutes.post("/add_to_cart", authorize, CartControllerObj.addToCart);
CartRoutes.get("/get_from_cart", authorize, CartControllerObj.getFromCart);
CartRoutes.get("/get_cart_count", authorize, CartControllerObj.getCountCart);
CartRoutes.put(
  "/update_product_in_cart",
  authorize,
  CartControllerObj.UpdateProductInCart
);
CartRoutes.delete(
  "/delete_or_clear_cart",
  authorize,
  CartControllerObj.DeleteOrClearCart
);
CartRoutes.get(
  "/get_count_from_cart",
  authorize,
  CartControllerObj.getCountFromCart
);

export default CartRoutes;
