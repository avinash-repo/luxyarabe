import express from "express";
import CategoryControllerObj from "../../controllers/admin/CategoryController.js";
import { authorize, authorizeAdmin } from "../../middlewares/auth.js";
import {
  upload,
  uploadForCategry,
  uploadForGender,
  uploadOfFilterProductCategory,
} from "../../helpers/multer.js";

const AdminCategoryRoutes = express.Router();
AdminCategoryRoutes.post(
  "/add_category",
  authorizeAdmin,
  uploadForCategry.fields([
    {
      name: "gender_image",
      maxCount: 5,
    },
    { name: "shape_image", maxCount: 1 },
  ]),
  CategoryControllerObj.addCategory
);

AdminCategoryRoutes.post(
  "/add_only_category",
  authorizeAdmin,
  uploadForCategry.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  CategoryControllerObj.addOnlyCateogry
);
AdminCategoryRoutes.post(
  "/add_only_gender",
  authorizeAdmin,
  uploadForGender.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  CategoryControllerObj.addOnlyGender
);

AdminCategoryRoutes.put(
  "/edit_category_status",
  authorizeAdmin,
  uploadOfFilterProductCategory.fields([
    {
      name: "image",
      maxCount: 2,
    },
  ]),
  CategoryControllerObj.editCategoryStatus
);

AdminCategoryRoutes.get(
  "/get_category_for_admin",
  authorizeAdmin,
  CategoryControllerObj.get_category_for_admin
);
// AdminCategoryRoutes.put(
//   "/edit_category",
//   authorizeAdmin,
//   upload.fields([
//     {
//       name: "category_image",
//       maxCount: 1,
//     },
//   ]),
//   CategoryControllerObj.edit_category
// );

// delete category
AdminCategoryRoutes.delete(
  "/delete_category_by_id",
  authorizeAdmin,
  CategoryControllerObj.delete_category_by_id
);

//user
AdminCategoryRoutes.get("/get_category", CategoryControllerObj.get_category);
export default AdminCategoryRoutes;
