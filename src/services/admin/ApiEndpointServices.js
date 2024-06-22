import axios from "axios";
import ApiEndpoint from "../../models/apiEndpointModel.js";

class ApiEndpointServices {
  async addData(req, res) {
    try {
      let { name, type, status, id } = req.body;
      name = name?.trim();
      console.log("oooo",id)
      if (id) {
        let dataExist = await ApiEndpoint.findOne({
          where: { id },
          raw: true,
        });
        if (!dataExist) {
          return res.status(400).json({
            message: "Data not found",
            statusCode: 400,
            success: false,
          });
        } else {
          let object = {
            name: name || dataExist?.name,
            type: type || dataExist?.type,
            status: status || dataExist?.status,
          };
          await ApiEndpoint.update(object, { where: { id } });
          return res.status(200).json({
            message: "Data update successfully",
            statusCode: 200,
            success: true,
          });
        }
      } else {
        let obj = {
          name,
          type,
          status,
        };
        let existCheck = await ApiEndpoint.findOne({
          where: { name },
          raw: true,
        });
        if (existCheck) {
          return res.status(400).json({
            message: "Endpoint already exist",
            statusCode: 400,
            success: false,
          });
        } else {
          await ApiEndpoint.create(obj);
          return res.status(201).json({
            message: "Api endpoint add successfully",
            statusCode: 201,
            success: true,
          });
        }
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async getData(req, res) {
    try {
      let getAll = await ApiEndpoint.findAll({
        where: { status: "active" },
        raw: true,
      });
      getAll = getAll?.sort((a, b) => b.created_at - a.created_at);
      return res.status(200).json({
        message: "Fetch data",
        data: getAll,
        success: true,
        statusCode: 200,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async getAllData(req, res) {
    try {
      let getAll = await ApiEndpoint.findAll({
        raw: true,
      });
      getAll = getAll?.sort((a, b) => b.created_at - a.created_at);
      return res.status(200).json({
        message: "Fetch data",
        data: getAll,
        success: true,
        statusCode: 200,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
  async getByQuery(req, res) {
    try {
      const getAll = await ApiEndpoint.findAll({
        where: { type: req.query.type, status: "active" },
        raw: true,
      });
      return res.status(200).json({
        message: "Fetch data",
        data: getAll,
        success: true,
        statusCode: 200,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async changeStatus(req, res) {
    try {
      const { id, status } = req.body;
      const get = await ApiEndpoint.findOne({
        where: { id },
        raw: true,
      });
      if (!get) {
        return res
          .status(400)
          .json({ message: "Data not found", statusCode: 400, success: false });
      }
      await ApiEndpoint.update({ status: status }, { where: { id: id } });
      return res.status(200).json({
        message: "Status update successfully",
        success: true,
        statusCode: 200,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
  async deleteEndpointById(req, res) {
    try {
      const { id } = req.query;
      console.log("dddddddd",id)

      const getData = await ApiEndpoint.findOne({
        where: { id },
        raw: true,
      });
      if (!getData) {
        return res
          .status(400)
          .json({ message: "Data not found", statusCode: 400, success: false });
      }
      // await ApiEndpoint.update({ status: status }, { where: { id: id } });
      // return res.status(200).json({
      //   message: "Status update successfully",
      //   success: true,
      //   statusCode: 200,
      // });

      await ApiEndpoint.destroy({ where: { id: id } });
      return res.status(200).json({
        message: "Data delete successfully",
        statusCode: 200,
        success: true,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
}

const ApiEndpointServicesObj = new ApiEndpointServices();
export default ApiEndpointServicesObj;
