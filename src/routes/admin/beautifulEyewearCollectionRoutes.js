import express from "express";
import beautifulEyewearCollectionControllerObj from "../../controllers/admin/beautifulEyewearCollection.js";
import beautifulEyewearCollectionObj from "../../controllers/user/BeautifulEyewearCollection.js";
import { uploadOfBeautifulCollection } from "../../helpers/multer.js";
import { authorizeAdmin } from "../../middlewares/auth.js";
const BeautifulEyeWearAdminRouter = express.Router();
BeautifulEyeWearAdminRouter.post(
  "/add_beautiful_eyewear",
  authorizeAdmin,
  uploadOfBeautifulCollection.single("collection_img"),
  beautifulEyewearCollectionControllerObj.addBeautifulEyewearCollection
);
BeautifulEyeWearAdminRouter.delete(
  "/delete_beautiful_eyewear/:id",
  authorizeAdmin,
  beautifulEyewearCollectionControllerObj.deleteBeautifulEyewearCollection
);
BeautifulEyeWearAdminRouter.get(
  "/get_beautiful_eyewear",
  beautifulEyewearCollectionControllerObj.getBeautifulEyewearCollection
);
export default BeautifulEyeWearAdminRouter;
