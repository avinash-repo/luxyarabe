import PermissionModuleModel from "../../models/PermissionModuleModel.js";
import { Op } from "sequelize";
import { environmentVars } from "../../config/environmentVar.js";
import filterProduct from "../../models/filterDataModel.js";
import ProductModel from "../../models/ProductModel.js";
import ProductVariantModel from "../../models/ProductVariantModel.js";
import dbConnection from "../../config/dbConfig.js";
import ApiEndpoint from "../../models/apiEndpointModel.js";

class PermissionModuleServices {
  //add new , change status
  async addPermissionData(req, res) {
    try {
      let { name, status, backend_routes, frontend_routes } = req.body;
      name = name?.trim();

      let checkExist = await PermissionModuleModel.findOne({
        where: { name },
        raw: true,
      });
      let message = "";
      let statusCode;
      let fetApiData = [];
      if (frontend_routes) {
        fetApiData = [...frontend_routes];
      }
      if (backend_routes) {
        fetApiData = [...fetApiData, ...backend_routes];
      }
      let fetchApiRoutes = await ApiEndpoint.findAll({
        where: { id: fetApiData },
        raw: true,
      });
      // console.log(fetchApiRoutes, "fetchApiRoutesfetchApiRoutes");
      // let splitFrontenData=fetchApiRoutes?.filter()
      // if (fetchApiRoutes?.length == 0) {
      //   return res.status(400).json({
      //     message: "Api routes are invalid",
      //     statusCode: 400,
      //     success: false,
      //   });
      // } else {
      for (let el of fetchApiRoutes) {
        if (el?.status != "active") {
          const newRoute = el?.name?.replace(/^\/api\/admin/, "");
          return res
            .status(400)
            .json({ message: `This api '${newRoute}' is not active` });
        }
        // }
      }
      let obj = {
        name,
        status: status || "active",
        backend_routes,
        frontend_routes,
      };

      if (checkExist && checkExist.id) {
        return res.status(400).json({
          message: "Permission already exist with this name",
          statusCode: 400,
          success: false,
        });
      } else {
        await PermissionModuleModel.create(obj);
        message = "Permission module data added successfully";
        statusCode = 201;
      }
      return res
        .status(statusCode)
        .json({ message: message, statusCode, success: true });
    } catch (err) {
      console.log(err, "Error incat");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async editPermissionData(req, res) {
    try {
      let { name, status, id, frontend_routes, backend_routes } = req.body;
      name = name?.trim();

      let checkExist = await PermissionModuleModel.findOne({
        where: { id },
        raw: true,
      });
      if (!checkExist) {
        return res.status(400).json({
          message: "Permission not found",
          statusCode: 400,
          success: false,
        });
      }
      let obj = {
        name,
        status,
        frontend_routes:frontend_routes|| checkExist?.frontend_routes,
        backend_routes:backend_routes|| checkExist?.backend_routes,
      };
      let message = "";
      let statusCode;
      let apiRoutesData = [];
      if (frontend_routes) {
        apiRoutesData = [...frontend_routes];
      }
      if (backend_routes) {
        apiRoutesData = [...apiRoutesData, ...backend_routes];
      }
      let fetchApiRoutes = await ApiEndpoint.findAll({
        where: { id: apiRoutesData },
        raw: true,
      });
      for (let el of fetchApiRoutes) {
        if (el?.status != "active") {
          const newRoute = el?.name?.replace(/^\/api\/admin/, "");
          return res
            .status(400)
            .json({ message: `This api '${newRoute}' is not active` });
        }
      }

      let nameExist = await PermissionModuleModel.findOne({
        where: {
          name,
          id: {
            [Op.not]: id,
          },
          deleted_at: null,
        },
      });
      if (nameExist && nameExist?.id != id) {
        return res.status(400).json({
          message: "Permission name must be unique",
          statusCode: 400,
          success: false,
        });
      } else {
        await PermissionModuleModel.update(obj, { where: { id } });
        return res.status(200).json({
          message: "Permission data update successfully",
          statusCode: 200,
          success: true,
        });
      }
    } catch (err) {
      console.log(err, "Error incat");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async getAllPermissionData(req, res) {
    try {
      // let fetch = await PermissionModuleModel.findAll({
      //   where: {
      //     deleted_at: null,
      //   },
      //   raw: true,
      // });
      const ListQuery = `
      SELECT p.id,
        p.frontend_routes,
        p.backend_routes,
        p.name
      FROM permission_modules p
    `;

      const fetch = await dbConnection.query(ListQuery, {
        type: dbConnection.QueryTypes.SELECT,
      });

      for (const module of fetch) {
        if (module.frontend_routes && module.frontend_routes.length > 0) {
          const frontendRoutesData = await dbConnection.query(
            `SELECT * FROM api_endpoint WHERE id IN (${module.frontend_routes.join(
              ","
            )})`,
            { type: dbConnection.QueryTypes.SELECT }
          );
          module.frontend_routes = frontendRoutesData;
        }
        if (module.backend_routes && module.backend_routes.length > 0) {
          const backendRoutesData = await dbConnection.query(
            `SELECT * FROM api_endpoint WHERE id IN (${module.backend_routes.join(
              ","
            )})`,
            { type: dbConnection.QueryTypes.SELECT }
          );
          module.backend_routes = backendRoutesData;
        }
      }

      let groupedPermissions = {};
      for (let permission of fetch) {
        let firstLetter = permission.name.split(" ")[0].toUpperCase();
        if (!groupedPermissions[firstLetter]) {
          groupedPermissions[firstLetter] = [];
        }
        groupedPermissions[firstLetter].push(permission);
      }

      let groupedPermissionsArray = Object.values(groupedPermissions);
      return res.status(200).json({
        message: "fetch data ",
        statusCode: 200,
        success: true,
        data: groupedPermissionsArray,
      });
    } catch (err) {
      console.log(err, "Errorororororororo");
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  //fetch active permission lists
  async getActivePermissionData(req, res) {
    try {
      // let fetch = await PermissionModuleModel.findAll({
      //   where: {
      //     status: "active",
      //     [Op.or]: [{ deleted_at: null }],
      //   },
      //   raw: true,
      // });
      const ListQuery = `
      SELECT p.id,
        p.frontend_routes,
        p.backend_routes,
        p.name
      FROM permission_modules p
      WHERE p.status = 'active'
      AND p.deleted_at IS NULL
    `;

      const fetch = await dbConnection.query(ListQuery, {
        type: dbConnection.QueryTypes.SELECT,
      });

      for (const module of fetch) {
        if (module.frontend_routes && module.frontend_routes.length > 0) {
          const frontendRoutesData = await dbConnection.query(
            `SELECT * FROM api_endpoint WHERE id IN (${module.frontend_routes.join(
              ","
            )})`,
            { type: dbConnection.QueryTypes.SELECT }
          );
          module.frontend_routes = frontendRoutesData;
        }
        if (module.backend_routes && module.backend_routes.length > 0) {
          const backendRoutesData = await dbConnection.query(
            `SELECT * FROM api_endpoint WHERE id IN (${module.backend_routes.join(
              ","
            )})`,
            { type: dbConnection.QueryTypes.SELECT }
          );
          module.backend_routes = backendRoutesData;
        }
      }

      let groupedPermissions = {};
      for (let permission of fetch) {
        let firstLetter = permission.name.split(" ")[0].toUpperCase();
        if (!groupedPermissions[firstLetter]) {
          groupedPermissions[firstLetter] = [];
        }
        groupedPermissions[firstLetter].push(permission);
      }

      let groupedPermissionsArray = Object.values(groupedPermissions);
      return res.status(200).json({
        message: "fetch data ",
        statusCode: 200,
        success: true,
        data: groupedPermissionsArray,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async deleteById(req, res) {
    try {
      let id = req.query.id;
      let findDoc = await PermissionModuleModel.findOne({
        where: {
          id: id,
          [Op.or]: [{ deleted_at: null }],
        },
        raw: true,
      });
      // console.log(findDoc, "fndocccc");
      if (findDoc) {
        await PermissionModuleModel.update(
          { deleted_at: new Date() },
          { where: { id } }
        );
        return res.status(200).json({
          message: "Permission delete successfulyy",
          statusCode: 200,
          success: true,
        });
      } else {
        return res.status(400).json({
          message: "Permission not found or deleted already",
          statusCode: 400,
          success: false,
        });
      }
    } catch (er) {
      return res
        .status(500)
        .json({ message: er?.message, statusCode: 500, success: false });
    }
  }

  async get_permission(req, res) {
    try {
      // let get = await PermissionModuleModel.findAll({
      //   where: {
      //     [Op.or]: [{ deleted_at: null }],
      //   },
      //   raw: true,
      // });
      const ListQuery = `
      SELECT p.id,
        p.frontend_routes,
        p.backend_routes,
        p.name,p.created_at,p.updated_at,p.id,p.status
      FROM permission_modules p
      WHERE p.deleted_at IS NULL
    `;

      let get = await dbConnection.query(ListQuery, {
        type: dbConnection.QueryTypes.SELECT,
      });

      for (const module of get) {
        if (module.frontend_routes && module.frontend_routes.length > 0) {
          const frontendRoutesData = await dbConnection.query(
            `SELECT * FROM api_endpoint WHERE id IN (${module.frontend_routes.join(
              ","
            )})`,
            { type: dbConnection.QueryTypes.SELECT }
          );
          module.frontend_routes = frontendRoutesData;
        }
        if (module.backend_routes && module.backend_routes.length > 0) {
          const backendRoutesData = await dbConnection.query(
            `SELECT * FROM api_endpoint WHERE id IN (${module.backend_routes.join(
              ","
            )})`,
            { type: dbConnection.QueryTypes.SELECT }
          );
          module.backend_routes = backendRoutesData;
        }
      }

      get = get?.sort((a, b) => b.created_at - a.created_at);
      return res.status(200).json({
        message: "Fetched data",
        data: get,
        statusCode: 200,
        success: true,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
}

const PermissionModuleServicesObj = new PermissionModuleServices();
export default PermissionModuleServicesObj;
