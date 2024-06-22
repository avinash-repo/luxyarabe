import express from "express";
import CategoryControllerObj from "../../controllers/user/CategoryController.js";
import { authorize, authorizeAdmin } from "../../middlewares/auth.js";
import { upload } from "../../helpers/multer.js";

const CategoryRoutes = express.Router();

//user
CategoryRoutes.get("/get_category", CategoryControllerObj.get_category);
CategoryRoutes.get('/get_category_by_id/:id',CategoryControllerObj.getCategoryById)
export default CategoryRoutes;
