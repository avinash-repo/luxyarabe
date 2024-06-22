import express from "express";
import UISectionControllerObj from "../../controllers/admin/AdminUISectionController.js";
import { uploaduiimage } from "../../helpers/multerForUi.js";
import { authorizeAdmin } from "../../middlewares/auth.js";
const AdminUISectionRoutes = express.Router();
// AdminUISectionRoutes.get(
//   "/get_landing_page_data",
//   UISectionControllerObj.getLandingPageData
// );
// AdminUISectionRoutes.get(
//   "/get_data_by_category/:category",
//   UISectionControllerObj.getSectionInfoByCategory
// );

AdminUISectionRoutes.get(
  "/get_ui_sections",
  authorizeAdmin,
  UISectionControllerObj.get_ui_section
);



AdminUISectionRoutes.post(
  "/add_ui_sections",
  uploaduiimage.single("ui_image"),
  UISectionControllerObj.addUISections
);
export default AdminUISectionRoutes;
