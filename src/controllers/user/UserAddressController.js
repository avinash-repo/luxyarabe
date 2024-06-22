import {
  addAddressSchema,
  deleteSchema,
  editAddressSchema,
  getAddressSchema,
} from "../../helpers/validateUserAddress.js";
import UserAddressServicesObj from "../../services/user/UserAddressServices.js";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

class UserAddressController {
  async addUserAddress(req, res) {
    try {
      let { error } = addAddressSchema.validate(req?.body, options);
      if (error) {
        return res
          .status(400)
          .json({ message: error.details[0]?.message, success: false });
      }
      UserAddressServicesObj.addUserAddress(req, res);
    } catch (err) {
      console.error(err);
      // console.log(err,"EEEEEEEEEEEEE")
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async FetchUsers(req, res) {
    // console.log(req.cookies._token);
  }

  async get_user_all_address(req, res) {
    try {
      UserAddressServicesObj.getUSerAllAddressData(req, res);
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async get_user_address_by_id(req, res) {
    try {
      let { error } = getAddressSchema.validate(req?.query, options);
      if (error) {
        return res
          .status(400)
          .json({ message: error.details[0]?.message, success: false });
      }
      UserAddressServicesObj.getUserAddressByIdData(req, res);
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
  async edit_address(req, res) {
    try {
      // console.log(req.params,"EEEEEEEEEE")
      if (!req.userData) {
        return res.status(400).json({
          message: "Not authorise to edit business",
          success: false,
          statusCode: 400,
        });
      }
      let { error } = editAddressSchema.validate(req?.body, options);
      if (error) {
        return res
          .status(400)
          .json({ message: error.details[0]?.message, success: false });
      }
      UserAddressServicesObj.editUserAddress(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async changeaddesstodefault(req, res) {
    try {
      // console.log(req.params,"EEEEEEEEEE")
      if (!req.userData) {
        return res.status(400).json({
          message: "Not authorise to edit address",
          success: false,
          statusCode: 400,
        });
      }
      // let { error } = editAddressSchema.validate(req?.body, options);
      // if (error) {
      //   return res
      //     .status(400)
      //     .json({ message: error.details[0]?.message, success: false });
      // }
      UserAddressServicesObj.setDefaultAddress(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  async delete_address_by_id(req, res) {
    try {
      if (!req.userData) {
        return res.status(400).json({
          message: "Not authorise to delete business",
          success: false,
          statusCode: 400,
        });
      }
      let { error } = deleteSchema.validate(req?.query, options);
      if (error) {
        return res
          .status(400)
          .json({ message: error.details[0]?.message, success: false });
      }
      UserAddressServicesObj.deleteAddressById(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
}

const UserAddressControllerObj = new UserAddressController();
export default UserAddressControllerObj;
