import OrderModel from "../../models/OrderModel.js";
import axios from "axios";
import { Op, Sequelize } from "sequelize";
import dbConnection from "../../config/dbConfig.js";
import ProductModel from "../../models/ProductModel.js";
import deliveryModel from "../../models/DeliveryModel.js";

class AdminDeliveryServices {
  // async addData(req, res) {
  //   try {
  //     let { discount, country_code, delivery_charges } = req.body;
  //     let fetchData = await deliveryModel.findOne({ raw: true });
  //     if (fetchData && fetchData.id) {
  //       let countryExist = fetchData?.student_charges?.find(
  //         (el) => el?.country_code == country_code
  //       );
  //       let tempArr = [];
  //       if (countryExist) {
  //         tempArr = fetchData?.student_charges?.map((el) => {
  //           if (el.country_code == country_code) {
  //             el.delivery_charges = delivery_charges;
  //           }
  //           return el;
  //         });
  //       } else {
  //         tempArr = fetchData?.student_charges;
  //         tempArr?.push({
  //           id: Number(tempArr?.length) + 1,

  //           delivery_charges,
  //           country_code,
  //         });
  //       }
  //       let obj = {
  //         discount,
  //         student_charges: tempArr,
  //       };
  //       await deliveryModel.update(obj, { where: { id: fetchData?.id } });
  //       return res.status(200).json({
  //         message: "Update successful",
  //         statusCode: 200,
  //         success: true,
  //       });
  //     } else {
  //       let obj = {
  //         discount,
  //         student_charges: [{ id: 1, country_code, delivery_charges }],
  //       };
  //       console.log(obj, "objectttt");
  //       await deliveryModel.create(obj);
  //       return res
  //         .status(201)
  //         .json({ message: "Add successful", statusCode: 201, success: true });
  //     }
  //   } catch (err) {}
  // }
  //new
  async addData(req, res) {
    try {
      let { country, discount, country_code, delivery_charges } = req.body;
      let fetchData = await deliveryModel.findOne({
        where: { country },
        raw: true,
      });
      if (fetchData && fetchData.id) {
        let obj = {
          discount: discount,
          country: country || fetchData?.country,
          country_code: country_code || fetchData?.country_code,
          delivery_charges: delivery_charges,
        };
        await deliveryModel.update(obj, { where: { id: fetchData?.id } });
        return res.status(200).json({
          message: "Update successful",
          statusCode: 200,
          success: true,
        });
      } else {
        let obj = {
          discount,
          country,
          country_code,
          delivery_charges,
        };
        await deliveryModel.create(obj);
        return res
          .status(201)
          .json({ message: "Add successful", statusCode: 201, success: true });
      }
    } catch (err) {
      console.error(err, "Errrr");
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async get(req, res) {
    try {
      let getData = [];
      if (req.userData.role != "super_admin") {
        getData = await deliveryModel.findAll({
          where: { country_code: req.userData.country },
          raw: true,
        });
      } else {
        getData = await deliveryModel.findAll({ raw: true });
      }
      return res.status(200).json({
        message: "Fetch data",
        data: getData,
        statusCode: 200,
        success: true,
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  async deleteByIdData(req, res) {
    try {
      // let get = await deliveryModel.findOne({ raw: true });
      // let tempArr = get?.student_charges;
      // let findData = tempArr?.find((el) => el?.id == id);
      // if (!findData) {
      //   return res
      //     .status(400)
      //     .json({ message: "Document not found or deleted already" });
      // } else {
      //   tempArr = tempArr?.filter((el) => el?.id != id);
      // }
      // let obj = {
      //   student_charges: tempArr,
      // };
      // await deliveryModel.update(obj, { where: { id: get?.id } });

      // return res.status(200).json({
      //   message: "Document delete successfully",
      //   statusCode: 200,
      //   success: true,
      // });
      let findObj = await deliveryModel.findOne({
        where: { id: req.query.id },
        raw: true,
      });
      // console.log(findObj, "findobjjjjjjjjjjjj");

      if (!findObj) {
        return res.status(400).json({
          message: "Data not found or deleted already",
          statusCode: 400,
          success: false,
        });
      }
      await deliveryModel.destroy({ where: { id: req.query.id } });
      return res.status(200).json({
        message: "Data delete successfully",
        statusCode: 200,
        success: true,
      });
    } catch (er) {
      console.error(er, "Erorororoor");
      return res
        .status(500)
        .json({ message: er?.message, statusCode: 500, success: false });
    }
  }
}

const AdminDeliveryServicesObj = new AdminDeliveryServices();
export default AdminDeliveryServicesObj;
