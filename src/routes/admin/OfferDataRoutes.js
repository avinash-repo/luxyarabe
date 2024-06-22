import express from "express";
import OfferDataControllerObj from "../../controllers/admin/OfferDataController.js";
import { authorize, authorizeAdmin } from "../../middlewares/auth.js";
import { upload } from "../../helpers/multer.js";

const OfferDataRoutes = express.Router();
OfferDataRoutes.post(
  "/add",
  authorizeAdmin,
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  OfferDataControllerObj.add_data
);
OfferDataRoutes.get("/get", authorizeAdmin, OfferDataControllerObj.getAllData);

//for normal user
OfferDataRoutes.get(
  "/get_user_data",
  authorizeAdmin,
  OfferDataControllerObj.getUSerData
);
OfferDataRoutes.delete("/destroy",authorizeAdmin,OfferDataControllerObj.deleteById)
export default OfferDataRoutes;
