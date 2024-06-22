import {
  addPermissionModuleSchema,
  editPermissionModuleSchema,
} from "../../helpers/validatePermissionModule.js";
import PermissionModuleServicesObj from "../../services/admin/PermissionModuleServices.js";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

class PermissionmoduleController {
  async add_data(req, res) {
    try {
      let { error } = addPermissionModuleSchema.validate(req?.body, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }

      PermissionModuleServicesObj.addPermissionData(req, res);
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async edit_data(req, res) {
    try {
      let { error } = editPermissionModuleSchema.validate(req?.body, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }

      PermissionModuleServicesObj.editPermissionData(req, res);
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async get_all_data(req, res) {
    try {
      PermissionModuleServicesObj.getAllPermissionData(req, res);
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async get_active_data(req, res) {
    try {
      PermissionModuleServicesObj.getActivePermissionData(req, res);
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
  async get_permission_data(req, res) {
    try {
      PermissionModuleServicesObj.get_permission(req, res);
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async deleteData(req, res) {
    try {
      if (!req.query.id) {
        return res.status(400).json({
          message: "Permission id is mandatory",
          statusCode: 400,
          success: false,
        });
      }
      PermissionModuleServicesObj.deleteById(req, res);
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
}

const PermissionmoduleControllerObj = new PermissionmoduleController();
export default PermissionmoduleControllerObj;
