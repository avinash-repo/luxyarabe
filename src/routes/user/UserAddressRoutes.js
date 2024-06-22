import express from "express";
import UserAddressControllerObj from "../../controllers/user/UserAddressController.js";
import { authorize } from "../../middlewares/auth.js";

const UserAddressRoutes = express.Router();
UserAddressRoutes.post(
  "/add_address",
  authorize,
  UserAddressControllerObj.addUserAddress
);
UserAddressRoutes.get(
  "/get_user_all_address",
  authorize,
  UserAddressControllerObj.get_user_all_address
);
UserAddressRoutes.get(
  "/get_user_address_by_id",
  authorize,
  UserAddressControllerObj.get_user_address_by_id
);
UserAddressRoutes.put(
  "/edit_address",
  authorize,
  UserAddressControllerObj.edit_address
);
UserAddressRoutes.delete(
  "/delete_address",
  authorize,
  UserAddressControllerObj.delete_address_by_id
);
UserAddressRoutes.put(
  "/changeaddesstodefault",
  authorize,
  UserAddressControllerObj.changeaddesstodefault
);

export default UserAddressRoutes;
