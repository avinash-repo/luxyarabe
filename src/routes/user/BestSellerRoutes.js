import express from "express";
import BestSellerControllerObj from "../../controllers/user/BestSellerController.js";

const BestSellerUserRoutes = express.Router();

BestSellerUserRoutes.get("/get", BestSellerControllerObj.fetch_data);

export default BestSellerUserRoutes;
