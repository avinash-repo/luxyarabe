import express from "express";
import ProductAvailabilityControllerAdminObj from "../../controllers/admin/ProductAvailabilityControllerAdmin.js";
import { authorizeAdmin } from "../../middlewares/auth.js";
const ProductAvailabilityRoutesAdmin = express.Router();


ProductAvailabilityRoutesAdmin.post(
  "/add_zipcodes",
  authorizeAdmin,
  ProductAvailabilityControllerAdminObj.addZipCodes
);

ProductAvailabilityRoutesAdmin.put(
  "/edit_status_zipcodes",
  authorizeAdmin,
  ProductAvailabilityControllerAdminObj.editZipCodesStatus
);


ProductAvailabilityRoutesAdmin.get(
  "/get",authorizeAdmin,
  ProductAvailabilityControllerAdminObj.fetchAllData
);
ProductAvailabilityRoutesAdmin.get(
  "/get_active",
  ProductAvailabilityControllerAdminObj.fetchActive
);


export default ProductAvailabilityRoutesAdmin;
