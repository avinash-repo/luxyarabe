import express from "express";
import ProductControllerObj from "../../controllers/admin/ProductController.js";
import { authorize, authorizeAdmin } from "../../middlewares/auth.js";
import { upload } from "../../helpers/multer.js";
import SeoControllerObj from "../../controllers/admin/SeoController.js";

const AdminProductRoutes = express.Router();

AdminProductRoutes.post(
  "/add_product",
  authorizeAdmin,
  upload.fields([
    {
      name: "thumbnail_img",
      maxCount: 1,
    },
  ]),
  ProductControllerObj.addProduct
);

AdminProductRoutes.post(
  "/edit_product",
  authorizeAdmin,
  upload.fields([
    {
      name: "thumbnail_img",
      maxCount: 1,
    },
  ]),
  ProductControllerObj.editProduct
);

AdminProductRoutes.post(
  "/add_product_variant",
  authorizeAdmin,
  upload.fields([
    {
      name: "variant_image_Arr",
      maxCount: 10,
    },
  ]),
  ProductControllerObj.addProductVariant   // no need for images upload
);
AdminProductRoutes.post(
  "/edit_product_variant",
  authorizeAdmin,
  upload.fields([
    {
      name: "variant_image",
      maxCount: 1,
    },
  ]),
  ProductControllerObj.editProductVariant  
);
AdminProductRoutes.put(
  "/add_country_only",
  authorizeAdmin,
  ProductControllerObj.add_country_only
);
AdminProductRoutes.put(
  "/add_country_data",
  authorizeAdmin,
  ProductControllerObj.add_country_data
);
AdminProductRoutes.put(
  "/edit_variant_country_status",
  authorizeAdmin,
  ProductControllerObj.edit_variant_country_status
);

AdminProductRoutes.post(
  "/add_product_variant_Images",
  authorizeAdmin,
  upload.fields([
    {
      name: "variant_image_Arr",
      maxCount: 100,
    },
  ]),
  ProductControllerObj.add_product_variant_Images
);
AdminProductRoutes.put(
  "/edit_product_variant_Images",
  authorizeAdmin,
  ProductControllerObj.edit_product_variant_Images
);

AdminProductRoutes.get(
  "/fetch_all_product",
  authorizeAdmin,
  ProductControllerObj.fetch_all_product
);

AdminProductRoutes.get(
  "/fetch_all_product_admin",
  authorizeAdmin,
  ProductControllerObj.fetch_all_product_admin
);

AdminProductRoutes.delete(
  "/destro_product_by_id",
  authorizeAdmin,
  ProductControllerObj.destro_product_by_id
);
AdminProductRoutes.delete(
  "/destro_product_variant_by_id",
  authorizeAdmin,
  ProductControllerObj.destro_product_variant_by_id
);
AdminProductRoutes.delete(
  "/destro_product_variant_country_by_id",
  authorizeAdmin,
  ProductControllerObj.destro_product_variant_country_by_id
);
AdminProductRoutes.put(
  "/change_status_product",
  authorizeAdmin,
  ProductControllerObj.change_status_product
);
AdminProductRoutes.put(
  "/change_status_product_variant",
  authorizeAdmin,
  ProductControllerObj.change_status_product_variant
);
AdminProductRoutes.get(
  "/fetch_product_by_id",
  authorizeAdmin,
  ProductControllerObj.fetch_product_by_id
);
AdminProductRoutes.get(
  "/fetch_product_variant_by_id",
  authorizeAdmin,
  ProductControllerObj.fetch_product_variant_by_id
);
AdminProductRoutes.put(
  "/add_stock",
  authorizeAdmin,
  ProductControllerObj.add_stock
);
//SEO

AdminProductRoutes.post("/add_seo_data" , authorizeAdmin, SeoControllerObj?.add);
AdminProductRoutes.get("/get_seo_data", SeoControllerObj?.get); //get only active
AdminProductRoutes.put(
  "/change_status_seo_data",
  authorizeAdmin,
  SeoControllerObj?.change_status
);
AdminProductRoutes.get(
  "/seo_get_by_id",
  authorizeAdmin,
  SeoControllerObj?.seo_get_by_id
);

export default AdminProductRoutes;
