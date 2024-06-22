import {
  paymentOptionSchema,
  countrySchema,
  removePaymentOptionSchema,
  addCodZipCodeSchema,
} from "../../helpers/validatePaymentOption.js";
import PaymentOptionObj from "../../services/admin/PaymentOptionServices.js";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

class PaymentOptionController {
  async addPaymentOption(req, res) {
    try {
      let { error } = paymentOptionSchema.validate(req?.body, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }
      PaymentOptionObj.add_payment_option(req, res);
    } catch (error) {
      console.error(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }

  async fetchAllPaymentData(req, res) {
    try {
      PaymentOptionObj.fetchAllPayment(req, res);
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ message: 500, statusCode: 500, success: false });
    }
  }

  async removePaymentOption(req, res) {
    try {
      let { error } = removePaymentOptionSchema.validate(req?.body, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }
      PaymentOptionObj.delete_payment_option(req, res);
    } catch (er) {
      console.error(err)
      return res
        .status(500)
        .json({ message: er?.message, statusCode: 500, success: false });
    }
  }

  async getAllZipCodeData(req, res) {
    try {
      let { error } = countrySchema.validate(req?.query, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }
      PaymentOptionObj.getAllZipCodeAvailableData(req, res);
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  async add_cod_zip_code(req, res) {
    try {
      let { error } = addCodZipCodeSchema.validate(req?.body, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }
      PaymentOptionObj.addZipcodeData(req,res)
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, sucess: false });
    }
  }
}

const PaymentOptionControllerObj = new PaymentOptionController();
export default PaymentOptionControllerObj;
