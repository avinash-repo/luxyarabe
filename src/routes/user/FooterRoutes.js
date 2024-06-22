import express from "express";
import FooterControllerObj from "../../controllers/user/FooterController.js";

const FooterRoutes = express.Router();

FooterRoutes.get("/get", FooterControllerObj.get_data);
export default FooterRoutes;
