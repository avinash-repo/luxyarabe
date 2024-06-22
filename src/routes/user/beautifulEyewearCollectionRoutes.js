import express from "express";
import beautifulEyewearCollectionObj from "../../controllers/user/BeautifulEyewearCollection.js";
const BeautifulEyewearCollectionRoutes = express.Router();
BeautifulEyewearCollectionRoutes.get(
  "/get_beautiful_eyewear",
  beautifulEyewearCollectionObj.getBeautifulEyewearCollection
);
export default BeautifulEyewearCollectionRoutes;
