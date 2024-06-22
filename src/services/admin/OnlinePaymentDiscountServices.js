import axios from "axios";
import OnlinePaymentDiscountModel from "../../models/OnlinePaymentDiscountModel.js";
// import { OnlinePaymentDiscountCache } from "../../helpers/redis/redisCacheModels.js";

class OnlinePaymentDiscountServices {
  async addData(req, res) {
    try {
      let { discount, id, country_code } = req.body;
      if (id) {
        let dataExist = await OnlinePaymentDiscountModel.findOne({
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
            discount: discount || dataExist?.discount,
          };
          console.log("888kk");
          // async function updateUser(whereCondition, newData) {
          // const users = await OnlinePaymentDiscountModel.findAll({
          //   where: { id },
          // });

          await OnlinePaymentDiscountModel.update(object, { where: { id } });

          return res.status(200).json({
            message: "Data update successfully",
            statusCode: 200,
            success: true,
          });
        }
      } else {
        let obj = {
          discount,
          country_code,
        };

        let findData = await OnlinePaymentDiscountModel.findOne({
          where: { country_code },
          raw: true,
        });

        if (findData && findData?.id) {
          return res.status(400).json({
            message: "Data already exist",
            statusCode: 400,
            success: false,
          });
        } else {
          console.log(":iii");
          await OnlinePaymentDiscountModel.create(obj);
          return res.status(201).json({
            message: "Data add successfully",
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
      if (!req.query.country_code) {
        return res.status(400).json({
          message: "Country_code is mandatory",
          statusCode: 400,
          success: false,
        });
      }
      let getAll = await OnlinePaymentDiscountModel.findOne({
        where: { country_code: req.query.country_code, status: "active" },
        raw: true,
      });
      if (getAll) {
        return res.status(200).json({
          message: "Fetch data ",
          data: getAll,
          success: true,
          statusCode: 200,
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async changeStatus(req, res) {
    try {
      const { id, status } = req.body;
      let get = await OnlinePaymentDiscountModel.findOne({
        where: { id },
        raw: true,
      });
      if (!get) {
        return res
          .status(400)
          .json({ message: "Data not found", statusCode: 400, success: false });
      }
      await OnlinePaymentDiscountModel.update(
        { status: status },
        { where: { id: id } }
      );

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

  async destroyData(req, res) {
    try {
      const users = await OnlinePaymentDiscountModel.findAll({
        where: { id: req.query.id },
        raw: true,
      });
      if (users.length > 0) {
        await OnlinePaymentDiscountModel.destroy({
          where: { id: req.query.id },
        });
      }
      return res.status(200).json({ message: "deleted data" });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
}

const OnlinePaymentDiscountObj = new OnlinePaymentDiscountServices();
export default OnlinePaymentDiscountObj;
