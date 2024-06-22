import express from "express";
import { authorize, authorizeAdmin } from "../../middlewares/auth.js";
import OrderControllerObj from "../../controllers/user/OrderController.js";
import AdminEducationInfoControllerObj from "../../controllers/admin/EducationInfoController.js";
import { educationImage } from "../../helpers/multer.js";

const AdminEducationInfoRoutes = express.Router();


AdminEducationInfoRoutes.get("/get_all", authorizeAdmin, AdminEducationInfoControllerObj.get);
AdminEducationInfoRoutes.put("/change_status", authorizeAdmin, AdminEducationInfoControllerObj.change_status);

export default AdminEducationInfoRoutes;
