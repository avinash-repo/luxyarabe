import express from "express";
import ProductAvailabilityControllerObj from "../../controllers/user/ProductAvailabilityController.js";
const ProductAvailabilityRoutes = express.Router();
ProductAvailabilityRoutes.get(
  "/is_product_available",
  ProductAvailabilityControllerObj.isProductAvailable
);

export default ProductAvailabilityRoutes;
