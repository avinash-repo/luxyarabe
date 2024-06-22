import express from "express";
import AdminUserControllerObj from "../../controllers/admin/adminControllers.js";
import { authorize, authorizeAdmin } from "../../middlewares/auth.js";

const AdminUserRoutes = express.Router();
AdminUserRoutes.post("/register", AdminUserControllerObj.register);
AdminUserRoutes.post("/login", AdminUserControllerObj.login);
AdminUserRoutes.post('/login_with_otp',AdminUserControllerObj.login_with_otp)
AdminUserRoutes.get("/user_logout", AdminUserControllerObj.user_logout);
AdminUserRoutes.get(
  "/check_user_logged_in",
  AdminUserControllerObj.check_user_logged_in
  );
  
  AdminUserRoutes.put("/forgot_password", AdminUserControllerObj.forgotPassword);
  AdminUserRoutes.put("/verify_otp", AdminUserControllerObj.verify_otp);
  AdminUserRoutes.put("/reset_password", AdminUserControllerObj.resetPassword);
  
  //---------CREATE SUBADMIN    / ADMIN
  AdminUserRoutes.post(
    "/create_admin",
    authorizeAdmin,
    AdminUserControllerObj.create_admin
    );
    // AdminUserRoutes.post("/login_admin", AdminUserControllerObj.login_admin); //not need
    // 
    AdminUserRoutes.get("/get_all_admin",authorizeAdmin, AdminUserControllerObj.get_admin);
    AdminUserRoutes.put(
      "/admin_status_change_data",authorizeAdmin,
      AdminUserControllerObj.adminStatusChangeData
      );
      AdminUserRoutes.put("/edit_admin",authorizeAdmin, AdminUserControllerObj.editAdminData);
      AdminUserRoutes.delete("/delete_admin",authorizeAdmin, AdminUserControllerObj.deleteAdminData);
      
      AdminUserRoutes.get("/admin_logout", AdminUserControllerObj.admin_logout);
// AdminUserRoutes.get("/fetch_users", UserControllerObj.FetchUsers);
// AdminUserRoutes.get("/get_allusers", authorize, UserControllerObj.getAllUser);

export default AdminUserRoutes;
