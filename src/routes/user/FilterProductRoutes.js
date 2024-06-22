import express from "express";
import FilterProductControllerObj from "../../controllers/user/FilterProductController.js";
import { uploaduiimage } from "../../helpers/multerForUi.js";
const FilterProductRoutes = express.Router();
FilterProductRoutes.get("/get_data", FilterProductControllerObj.getData);
FilterProductRoutes.get(
  "/get_filtered_price",
  FilterProductControllerObj.filterMinMaxPriceCountryWise
);
export default FilterProductRoutes;
