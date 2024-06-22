import express from "express";
import BestSellerControllerObj from "../../controllers/admin/AdminBestSellerController.js";
import { authorize, authorizeAdmin } from "../../middlewares/auth.js";
import { upload, uploadOfBestSeller } from "../../helpers/multer.js";

const BestSellerRoutes = express.Router();
BestSellerRoutes.post(
  "/add",
  authorizeAdmin,
  uploadOfBestSeller.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  BestSellerControllerObj.add_data
);
BestSellerRoutes.get("/get", authorizeAdmin, BestSellerControllerObj.get_data);
BestSellerRoutes.delete("/delete", authorizeAdmin, BestSellerControllerObj.delete_by_id);

export default BestSellerRoutes;
