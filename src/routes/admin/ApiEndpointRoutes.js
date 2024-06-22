import express from "express";
import { authorizeAdmin } from "../../middlewares/auth.js";
import ApiEndpointControllerObj from "../../controllers/admin/ApiEndpointController.js";

const ApiEndpointRoutes = express.Router();

ApiEndpointRoutes.post("/add", authorizeAdmin, ApiEndpointControllerObj?.add);
ApiEndpointRoutes.get("/get", authorizeAdmin, ApiEndpointControllerObj?.get); //get only active
ApiEndpointRoutes.put(
  "/change_status",
  authorizeAdmin,
  ApiEndpointControllerObj?.change_status
);
ApiEndpointRoutes.get(
  "/get_data",
  authorizeAdmin,
  ApiEndpointControllerObj?.get_data
);
ApiEndpointRoutes.get(
  "/get_all",
  authorizeAdmin,
  ApiEndpointControllerObj?.get_all
); 
ApiEndpointRoutes.delete(
  "/delete_endpoint_by_id",
  authorizeAdmin,
  ApiEndpointControllerObj?.delete_endpoint_byid
); 




//get all active
// ApiEndpointRoutes.put(
//   "/review_status_change",
//   authorizeAdmin,
//   ApiEndpointControllerObj?.review_status_change
// );

export default ApiEndpointRoutes;
