import { addCurrencySchema } from "../../helpers/validateCurrency.js";
import { addRoleSchema, editRoleSchema } from "../../helpers/validateRole.js";
import RoleServicesObj from "../../services/admin/adminRolesServices.js";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

class RoleController {
  async add_role(req, res) {
    try {
      // console.log(req.body, "eeed");
      // console.log(req.originalUrl, "aaaaaaaaaaaaaaaaaaassssssssssss");
      // return;
      let { error } = addRoleSchema.validate(req?.body, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }

      RoleServicesObj.createRole(req, res);
    } catch (error) {
      console.log(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }

  async UpdateStatus(req, res) {
    try {
      let { error } = editRoleSchema.validate(req?.body, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }

      RoleServicesObj.updateStatusById(req, res);
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  async get_all(req, res) {
    try {
      RoleServicesObj.getAllRole(req, res);
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  async get_active(req, res) {
    //working here
    try {
      RoleServicesObj.getActiveRole(req, res);
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  async destroy(req, res) {
    try {
      if (!req.query.id) {
        return res.status(400).json({
          message: "Id is mandatory",
          statusCode: 400,
          success: false,
        });
      }
      RoleServicesObj.destroyById(req, res);
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
}

const RoleControllerObj = new RoleController();
export default RoleControllerObj;
