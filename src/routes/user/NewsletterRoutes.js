import express from "express";
import NewsletterControllerObj from "../../controllers/user/NewsletterController.js";
import { authorizeAdmin } from "../../middlewares/auth.js";

const NewsletterRoutes = express.Router();
NewsletterRoutes.post("/subscribe", NewsletterControllerObj.newsletterSubscribe);
NewsletterRoutes.post("/unsubscribe", NewsletterControllerObj.newsletterUnSubscribe);


//admin routes
NewsletterRoutes.get("/get",authorizeAdmin, NewsletterControllerObj.get_newsletter_data);

export default NewsletterRoutes;
