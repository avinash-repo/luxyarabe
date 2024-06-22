import express from "express";
import ContactUsObj from "../../controllers/user/ContactUsController.js";

const ContactUs = express.Router();

ContactUs.post("/query", ContactUsObj.ContactUs);
ContactUs.get("/googleAuth", ContactUsObj.getGoogleAuth);
ContactUs.get("/auth/callback", ContactUsObj.getGoogleAuth2);
ContactUs.get("/auth/createCode", ContactUsObj.getcreateCode);
ContactUs.get("/auth/createFile", ContactUsObj.getcreateFile);

export default ContactUs;
