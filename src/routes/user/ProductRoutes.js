import express from "express";
import ProductControllerObj from "../../controllers/user/ProductController.js";
import { authorize } from "../../middlewares/auth.js";
import { upload } from "../../helpers/multer.js";

const ProductRoutes = express.Router();

ProductRoutes.post(
  "/fetch_all_product",
  ProductControllerObj.fetch_all_product
);
ProductRoutes.get(
  "/get_all_product_by_search",
  ProductControllerObj.get_all_product_by_search
);
ProductRoutes.get(
  "/fetch_product_by_id?",
  ProductControllerObj.fetch_product_by_id
);
ProductRoutes.post(
  "/search_params_data",
  ProductControllerObj.search_params_data
);
ProductRoutes.get(
  "/fetch_search_params_data",
  ProductControllerObj.search_params_product_data
);
ProductRoutes.get(
  "/check_is_product_purchased",
  authorize,
  ProductControllerObj.check_is_product_purcased
);
ProductRoutes.get(
  "/fetch_variant_data",
  // authorize,
  ProductControllerObj.fetch_variant_data
);

ProductRoutes.get("/get_seo_data", ProductControllerObj?.getSeoData); //get only active

ProductRoutes.get("/seo_get_by_id", ProductControllerObj?.seo_get_by_id);
ProductRoutes.get("/seo_temp", ProductControllerObj?.seo_temp);

export default ProductRoutes;
