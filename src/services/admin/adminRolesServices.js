import { Op } from "sequelize";
import PermissionModuleModel from "../../models/PermissionModuleModel.js";
import RolesModel from "../../models/RolesModel.js";
import axios from "axios";

class RoleServices {
  async createRole(req, res) {
    try {
      let name = req?.body?.name?.trim();
      let permissions = req.body.permissions;
      let id = req.body.id;
      let obj = {
        name,
        permissions,
      };
      let fetchData = await PermissionModuleModel.findAll({
        where: { id: permissions },
        raw: true,
      });
      // console.log(fetchData, "eeeeeeeeee");
      for (let i = 0; i < permissions.length; i++) {
        let find = await fetchData?.find((el) => el?.id == permissions[i]);
        // console.log(find, "DDDDDDDDDDDDDDDd", i);
        if (!find) {
          return res.status(400).json({
            message: `This Permission not found ${permissions[i]}`,
            statusCode: 400,
            success: false,
          });
        }
      }
      if (id) {
        let findExist = await RolesModel.findOne({
          where: { id },
          raw: true,
        });
        let findNameExist = await RolesModel.findOne({
          where: { name },
          [Op.not]: id,
          raw: true,
        });
        // console.log(findNameExist, "findfindNameExist@@@@");

        if (findNameExist != null && findNameExist?.id != id) {
          return res.status(400).json({
            message: "Role name must be unique....",
            statusCode: 400,
            success: false,
          });
        }
        if (findExist) {
          await RolesModel.update(obj, { where: { id: findExist?.id } });
          return res.status(200).json({
            success: true,
            message: "Role updated successfully",
            statusCode: 200,
          });
        } else {
          return res.status(400).json({
            message: "Role doest not exist",
            statusCode: 400,
            success: false,
          });
        }
      } else {
        let roleNameExist = await RolesModel.findOne({
          where: { name },
          raw: true,
        });
        // console.log(roleNameExist,"EEEEEEEEEEEEEEEEEEEE")
        if (roleNameExist) {
          return res.status(400).json({
            message: "Role name must be unique",
            statusCode: 400,
            success: false,
          });
        } else {
        }
        await RolesModel.create(obj);
        return res.status(201).json({
          message: "Role created successfully",
          success: true,
          statusCode: 201,
        });
      }
    } catch (err) {console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async updateStatusById(req, res) {
    try {
      let status = req.body.status;
      let id = req.body.id;
      let fetchObj = await RolesModel.findOne({
        where: { id },
        raw: true,
      });

      if (!fetchObj) {
        return res.status(404).json({
          message: "Role Does not Exist",
          success: false,
          statusCode: 404,
        });
      }

      await RolesModel.update({ status }, { where: { id } });
      return res.status(200).json({
        message: "Role status Updated successfully",
        success: true,
        statusCode: 200,
      });
    } catch (err) {
      console.error(err, "E delete");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async getAllRole(req, res) {
    try {
      let getAll = await RolesModel.findAll({
        raw: true,
        order: [["created_at", "DESC"]],
      });
      let temp = [];
      for (let le of getAll) {
        for (let el of le?.permissions) {
          if (!temp.includes(el)) {
            temp.push(el);
          }
        }
      }
      let data = await PermissionModuleModel.findAll({
        where: { id: temp , deleted_at: null  },
        attributes: ["name", "id", "status"],
        raw: true,
      });
      for (let le of getAll) {
        let temp = [];
        let permissionName = [];
        for (let el of le?.permissions) {
          // console.log(el,"eleleleleelelelele")
          let findData = data?.find((elem) => elem?.id == el);
          // console.log(findData,"findDaaaaaaaaaaaa")
          if (findData) {
            temp.push(findData);
            // permissionName.push(findData?.name);
          }
        }
        if (temp) {
          le.permissionData = temp;
        }
        // if (permissionName) {
        //   le.permissionName = permissionName;
        // }
      }

      return res.status(200).json({
        message: "Fetch data",
        data: getAll,
        success: true,
        statusCode: 200,
        // get: data,
      });
    } catch (err) {console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
  async getActiveRole(req, res) {
    try {
      let getAll = await RolesModel.findAll({
        where: { status: "active" },
        raw: true,
        order: [["created_at", "DESC"]],
      });
      let temp = [];
      // for (let le of getAll) {
      //   for (let el of le?.permissions) {
      //     if (!temp.includes(el)) {
      //       temp.push(el);
      //     }
      //   }
      // }
      // let data = await PermissionModuleModel.findAll({
      //   where: { id: temp },
      //   attributes: ["name", "id", "status"],
      //   raw: true,
      // });
      // for (let le of getAll) {
      //   let temp = [];
      //   let permissionName = [];
      //   for (let el of le?.permissions) {
      //     // console.log(el,"eleleleleelelelele")
      //     let findData = data?.find((elem) => elem?.id == el);
      //     // console.log(findData,"findDaaaaaaaaaaaa")
      //     if (findData) {
      //       temp.push(findData);
      //       // permissionName.push(findData?.name);
      //     }
      //   }
      //   if (temp) {
      //     le.permissionData = temp;
      //   }
      //   // if (permissionName) {
      //   //   le.permissionName = permissionName;
      //   // }
      // }

      return res.status(200).json({
        message: "Fetch data",
        data: getAll,
        success: true,
        statusCode: 200,
        // get: data,
      });
    } catch (err) {console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async destroyById(req, res) {
    try {
      let find = await RolesModel.findOne({
        where: { id: req.query.id },
        raw: true,
      });
      // console.log(find,"findndidndid")
      if (!find) {
        return res.status(400).json({
          message: "Role id not found or deleted already",
          statusCode: 400,
          success: false,
        });
      }
      await RolesModel.destroy({ where: { id: req.query.id } });
      return res.status(200).json({
        message: "Role deleted successfully",
        statusCode: 200,
        success: true,
      });
    } catch (err) {console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
}

const RoleServicesObj = new RoleServices();
export default RoleServicesObj;
