import express from "express";
import { authorize } from "../../middlewares/auth.js";
import WishListControllerObj from "../../controllers/user/WishlistController.js";

const WishlistRoutes = express.Router();

WishlistRoutes.post(
  "/add_to_wishlist",
  authorize,
  WishListControllerObj.addToWishlist
);
WishlistRoutes.get(
  "/get_wishlist_products",
  authorize,
  WishListControllerObj.getShorlistedData
);
WishlistRoutes.get(
  "/get_wishlist_data",
  authorize,
  WishListControllerObj.getWishlistData
);


//fetch wishisted data of user
WishlistRoutes.get(
  "/get_wishlist_products_data",
  authorize,
  WishListControllerObj.getShorlistedProductData
);
export default WishlistRoutes;
