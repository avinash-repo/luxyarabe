import express from "express";
import NewsletterControllerObj from "../../controllers/admin/NewsletterController.js";
import { authorizeAdmin } from "../../middlewares/auth.js";

const AdminNewsletterRoutes = express.Router();

//admin routes
AdminNewsletterRoutes.get("/get",authorizeAdmin, NewsletterControllerObj.get_newsletter_data);

export default AdminNewsletterRoutes;
