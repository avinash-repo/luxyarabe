import express from "express";
import PagesObj from "../../controllers/admin/PagesController.js";
import { authorize } from "../../middlewares/auth.js";
const UserPagesRoutes = express.Router();
// UserPagesRoutes.get(
//   "/get_about_us",
//   PagesObj
// );
export default UserPagesRoutes;
