import { addCurrencySchema } from "../../helpers/validateCurrency.js";
import CurrecyServicesObj from "../../services/user/CurrencyServices.js";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

class CurrencyController {
  async getAllCurrency(req, res) {
    try {
      CurrecyServicesObj.getAllCurrency(req, res);
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  async getCurrency(req, res) {
    try {
      CurrecyServicesObj.getCurrencyByName(req, res);
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
}

const CurrencyControllerObj = new CurrencyController();
export default CurrencyControllerObj;
