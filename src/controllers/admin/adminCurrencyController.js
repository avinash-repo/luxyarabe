import { addCurrencySchema } from "../../helpers/validateCurrency.js";
import CurrecyServicesObj from "../../services/admin/adminCurrencyServices.js";
// import CurrecyServicesObj from "../../services/user/CurrencyServices.js";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

class CurrencyController {
  async addCurrency(req, res) {
    try {
      let { error } = addCurrencySchema.validate(req?.body, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }

      CurrecyServicesObj.createCurrency(req, res);
    } catch (error) {
      console.error(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }

  async UpdateStatus(req, res) {
    try {
      CurrecyServicesObj.updateStatusById(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  async getAllCurrency(req, res) {
    try {
      CurrecyServicesObj.getAllCurrency(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  async getCurrency(req, res) {
    try {
      CurrecyServicesObj.getCurrencyByName(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
}

const CurrencyControllerObj = new CurrencyController();
export default CurrencyControllerObj;
