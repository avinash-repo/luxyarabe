import express from "express";
import { authorizeAdmin } from "../../middlewares/auth.js";
import { uploadForFooter, uploadForFooter2 } from "../../helpers/multer.js";
import FooterControllerObj from "../../controllers/admin/FooterController.js";

const AdminFooterRoutes = express.Router();
AdminFooterRoutes.post(
  "/add",
  authorizeAdmin,
  uploadForFooter.fields([
 
    { name: "h1_image", maxCount: 1 },
  ]),
  FooterControllerObj.add
);

AdminFooterRoutes.post(
  "/add_social_media",
  authorizeAdmin,
  uploadForFooter2.fields([
    {
      name: "social_media_image",
      maxCount: 10,
    },
  ]),
  FooterControllerObj.add_social_data
);
AdminFooterRoutes.delete(
  "/delete_by_id",
  authorizeAdmin,
  FooterControllerObj.delete_social_data
);

AdminFooterRoutes.get("/get", authorizeAdmin, FooterControllerObj.get_data);

export default AdminFooterRoutes;