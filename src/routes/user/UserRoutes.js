import express from "express";
import UserControllerObj from "../../controllers/user/UserController.js";
import { authorize } from "../../middlewares/auth.js";

const UserRoutes = express.Router();
UserRoutes.post("/register", UserControllerObj.register);
UserRoutes.post("/login", UserControllerObj.login);

UserRoutes.put("/forgot_password", UserControllerObj.forgotPassword);
UserRoutes.put("/verify_otp", UserControllerObj.verify_otp);

UserRoutes.get("/check_user_logged_in", UserControllerObj.check_user_logged_in);
UserRoutes.get("/user_logout", UserControllerObj.user_logout);

UserRoutes.put("/reset_password", UserControllerObj.resetPassword);//
UserRoutes.get("/fetch_users", UserControllerObj.FetchUsers);
UserRoutes.get("/get_allusers", authorize, UserControllerObj.getAllUser);
UserRoutes.post(
  "/update_user_details",
  authorize,
  UserControllerObj.updateUserInfo
);
UserRoutes.post(
  "/update_user_name",
  authorize,
  UserControllerObj.updateUserName
);
UserRoutes.get(
  "/get_user_account_info_data",
  authorize,
  UserControllerObj.getUserAccountInfo
);
UserRoutes.get("/get_user_location", UserControllerObj.getUserLocation);
export default UserRoutes;
