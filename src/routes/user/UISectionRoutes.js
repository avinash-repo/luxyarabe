import express from "express";
import UISectionControllerObj from "../../controllers/user/UISectionController.js";
import { uploaduiimage } from "../../helpers/multerForUi.js";
const UISectionRoutes = express.Router();
UISectionRoutes.get(
  "/get_landing_page_data",
  UISectionControllerObj.getLandingPageData
);
UISectionRoutes.get(
  "/get_data_by_category/:category",
  UISectionControllerObj.getSectionInfoByCategory
);
UISectionRoutes.get('/get_data_by_section/:id',UISectionControllerObj.getLandingPageSectionCards)


export default UISectionRoutes;
