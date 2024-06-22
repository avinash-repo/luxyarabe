import CategoryModel from "../../models/CategoryModel.js";
import { Op } from "sequelize";
import { environmentVars } from "../../config/environmentVar.js";
import { generateAccessToken } from "../../helpers/validateUser.js";
import filterProduct from "../../models/filterDataModel.js";
import deliveryModel from "../../models/DeliveryModel.js";
import OrderDeliveryDayModel from "../../models/OrderDeliveryDayModel.js";

class DeliveryServices {
  async getAllData(req, res) {
    try {
      let fetchData = {};
      // await deliveryModel.findOne({ raw: true });
      // let obj = {};
      // obj.discount = fetchData?.discount;
      if (req.query.country_code) {
        fetchData = await deliveryModel.findOne({
          where: { country_code: req.query.country_code },
          raw: true,
        });
      } else {
        res.status(400).json({
          message: "Country_code is mandatory",
          success: false,
          statusCode: 400,
        });
        return;
      }
      res.status(200).json({
        message: "Fetch data",
        data: fetchData,
        success: true,
        statusCode: 200,
      });
      return;
    } catch (err) {
      console.log(err, "err, delivery");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async getNormalDeliveryData(req, res) {
    try {
      let fetchData = {};
      fetchData = await OrderDeliveryDayModel.findOne({
        where: { country_code: req.query.country_code },
        raw: true,
      });
      res.status(200).json({
        message: "Fetch data",
        data: fetchData,
        success: true,
        statusCode: 200,
      });
      return;
    } catch (err) {
      console.log(err, "err, delivery");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
  async getById(req, res) {
    try {
      const data = await deliveryModel.findOne({
        where: { id: req.query.id },
        raw: true,
      });
      return res.status(200).json({
        success: true,
        message: "Data fetched",
        data: data,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message });
    }
  }
}

const DeliveryServicesObj = new DeliveryServices();
export default DeliveryServicesObj;
