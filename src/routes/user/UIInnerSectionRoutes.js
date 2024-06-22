import express from "express";
import UISectionControllerObj from "../../controllers/user/UIInnerSectionController.js";
import { uploaduiimage } from "../../helpers/multerForUi.js";
const UIInnerSectionRoutes = express.Router();
UIInnerSectionRoutes.get("/get_data", UISectionControllerObj.get_data);

export default UIInnerSectionRoutes;
