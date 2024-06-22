import express from "express";
import UISectionControllerObj from "../../controllers/admin/AdminUIInnerSectionController.js";
import { uploaduiimage } from "../../helpers/multerForUi.js";
import { authorizeAdmin } from "../../middlewares/auth.js";
const AdminUIInnerSectionRoutes = express.Router();

AdminUIInnerSectionRoutes.get(
  "/get_data",
  UISectionControllerObj.getAllData
);

AdminUIInnerSectionRoutes.post(
  "/add_ui_inner_sections",
  authorizeAdmin,
  uploaduiimage.single("ui_image"),
  UISectionControllerObj.addUIInnerSections
);
AdminUIInnerSectionRoutes.post('/add_ui_frame_config',  authorizeAdmin, UISectionControllerObj.updateFrameConfig)
AdminUIInnerSectionRoutes.get("/get_ui_frame_config",authorizeAdmin,  UISectionControllerObj.getFrameConfig)
export default AdminUIInnerSectionRoutes;
