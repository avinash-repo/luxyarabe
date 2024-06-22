import axios from "axios";
import PaymentOptionsModel from "../../models/PaymentOptionsModel.js";
import ProductAvailability from "../../models/ProductAvailability.js";

class PaymentOptionServices {
  async add_payment_option(req, res) {
    try {
      let { option, description, country, id } = req.body;
      let findCountryObj = await PaymentOptionsModel.findOne({
        where: { country },
        raw: true,
      });
      let message = "Update payment option";
      let statusCode = 200;
      let obj = {
        payment_options: [{ id: 1, option: option, description }],
        country: country,
      };
      if (findCountryObj) {
        if (id) {
          for (let el of findCountryObj?.payment_options) {
            if (el?.id == id) {
              (el.option = option), (el.description = description);
            }
          }
          await PaymentOptionsModel.update(
            { payment_options: findCountryObj?.payment_options },
            { where: { country: country } }
          );
        } else {
          
          let index = findCountryObj.payment_options[findCountryObj.payment_options?.length-1]?.id;
          findCountryObj?.payment_options?.push({
            id: index + 1,
            option,
            description,
          });
          message = "Add payment option";
          statusCode = 201;
          await PaymentOptionsModel.update(
            { payment_options: findCountryObj?.payment_options },
            { where: { country: country } }
          );
        }
      } else {
        message = "Add payment option";
        statusCode = 201;
        await PaymentOptionsModel.create(obj);
      }
      return res.status(statusCode).json({ message, statusCode });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  async fetchAllPayment(req, res) {
    try {
      let get = await PaymentOptionsModel.findAll({ raw: true });
      return res.status(400).json({
        message: "fetch data",
        success: true,
        statusCode: 200,
        data: get,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async delete_payment_option(req, res) {
    try {
      let { id, country } = req.body;
      let findObj = await PaymentOptionsModel.findOne({
        where: { country },
        raw: true,
      });
      if (!findObj) {
        return res.status(400).json({
          message: `This country "${country}" is not exist`,
          statusCode: 400,
          success: false,
        });
      }
      let existCheck = findObj?.payment_options?.find((le) => le?.id == id);
      if (!existCheck) {
        return res
          .status(400)
          .json({
            message: "Data not found or deleted already",
            statusCode: 400,
            success: false,
          });
      }
      let temp = findObj?.payment_options?.filter((el) => el?.id != id);

      await PaymentOptionsModel.update(
        { payment_options: temp },
        { where: { country } }
      );
      return res.status(200).json({
        message: "Success! delete payment option",
        statusCode: 200,
        success: true,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  //add zipcode for COD
  async addZipcodeData(req, res) {
    try {
      let { country, zip_codes } = req.body;
      let fetchObj = await PaymentOptionsModel.findOne({
        where: { country },
        raw: true,
      });
      if (!fetchObj) {
        return res.status(400).json({
          message: "Country not found",
          statusCode: 400,
          success: false,
        });
      }
      zip_codes = new Set(zip_codes);
      zip_codes = [...zip_codes];
      await PaymentOptionsModel.update(
        { zip_codes },
        {
          where: { country: country },
        }
      );
      return res.status(200).json({
        message: "Data update successfully",
        statusCode: 200,
        success: true,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async getAllZipCodeAvailableData(req, res) {
    try {

      let arr = await ProductAvailability.findOne({
        where: { country_code: req.query.country },
        raw: true,
      });
      return res.status(200).json({
        message: "Fetch data",
        statusCode: 400,
        success: true,
        data: arr,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
}

const PaymentOptionObj = new PaymentOptionServices();
export default PaymentOptionObj;
