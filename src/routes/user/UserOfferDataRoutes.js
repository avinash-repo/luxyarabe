import express from "express";
import UserOfferDataControllerObj from "../../controllers/user/UserOfferDataController.js";
import { authorize, authorizeAdmin } from "../../middlewares/auth.js";
import { upload } from "../../helpers/multer.js";

const UserOfferDataRoutes = express.Router();

//for normal user
UserOfferDataRoutes.get("/get", UserOfferDataControllerObj.getUSerData);

export default UserOfferDataRoutes;
