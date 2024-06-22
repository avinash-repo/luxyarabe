import express from "express";
import UserControllerObj from "../../controllers/user/UserController.js";
import { authorize } from "../../middlewares/auth.js";
import userSocialControllerObj from "../../controllers/user/userSocialController.js";

const UserSocialRoutes = express.Router();
UserSocialRoutes.get("/getuserdata", userSocialControllerObj.getUserData);

export default UserSocialRoutes;
