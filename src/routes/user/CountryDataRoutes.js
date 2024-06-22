import express from "express";
import CountryDataControllerObj from "../../controllers/user/CountryDataController.js";
import { authorize, authorizeAdmin } from "../../middlewares/auth.js";
import { upload } from "../../helpers/multer.js";

const CountryDataRoutes = express.Router();

//for normal user
CountryDataRoutes.get("/get", CountryDataControllerObj.getUSerData);

export default CountryDataRoutes;
