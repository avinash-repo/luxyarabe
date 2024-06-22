import OfferDataModel from "../../models/OfferDataModel.js";
import axios from "axios";

class OfferDataServices {
  async addData(req, res) {
    try {
      let { title, description, status, id } = req.body;
      title = title?.trim();
      description = description?.trim();
      if (id) {
        let dataExist = await OfferDataModel.findOne({
          where: { id },
          raw: true,
        });
        if (!dataExist) {
          return res.status(400).json({
            message: "Offer not found",
            statusCode: 400,
            success: false,
          });
        } else {
          let object = {
            title: title || dataExist?.title,
            description: description || dataExist?.description,
            status: status || dataExist?.status,
          };
          if (req.files && req.files?.image?.length) {
            object.image = req.files?.image[0]?.filename;
          } else {
            object.image = dataExist?.image;
          }
          await OfferDataModel.update(object, { where: { id } });
          return res.status(200).json({
            message: "Offer data update successfully",
            statusCode: 200,
            success: true,
          });
        }
      } else {
        let image = "";
        if (req.files && req.files?.image?.length) {
          image = req.files?.image[0]?.filename;
        }

        let obj = {
          title,
          description,
          status,
          image,
        };
        let allCount = await OfferDataModel.count();
        obj.position = allCount + 1;
        // console.log(obj, "objectttttttttttt");
        let existCheck = await OfferDataModel.findOne({
          where: { title },
          raw: true,
        });
        if (existCheck) {
          return res.status(400).json({
            message: "Offer already exist",
            statusCode: 400,
            success: false,
          });
        } else {
          await OfferDataModel.create(obj);
          return res.status(201).json({
            message: "Offer add successfully",
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

  async getAllData(req, res) {
    try {
     
      const getAll = await OfferDataModel.findAll({ raw: true });

      if (getAll) {
        return res.status(200).json({
          message: "Fetch data",
          data: getAll,
          success: true,
          statusCode: 200,
        });
      } else {
        return res.status(404).json({
          message: "Data not found",
          success: false,
          statusCode: 404,
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  // for user
  async getDataForUser(req, res) {
    try {
      
      const getAll = await OfferDataModel.findAll({
        where: { status: "active" },
        raw: true,
      });

      if (getAll) {
        return res.status(200).json({
          message: "Fetch data",
          data: getAll,
          success: true,
          statusCode: 200,
        });
      } else {
        return res.status(404).json({
          message: "Data not found",
          success: false,
          statusCode: 404,
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
}

const OfferDataServicesObj = new OfferDataServices();
export default OfferDataServicesObj;
