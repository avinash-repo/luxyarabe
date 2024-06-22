import { addCurrencySchema } from "../../helpers/validateCurrency.js";
import { addDeliverySchema } from "../../helpers/validateDelivery.js";
import CurrecyServicesObj from "../../services/admin/adminCurrencyServices.js";
import AdminDeliveryServicesObj from "../../services/admin/AdminDeliveryServices.js";
// import CurrecyServicesObj from "../../services/user/CurrencyServices.js";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

class DeliveryController {
  async add(req, res) {
    try {
      let { error } = addDeliverySchema.validate(req?.body, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }

      AdminDeliveryServicesObj.addData(req, res);
    } catch (error) {
      console.error(err);
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }

  async getData(req, res) {
    try {
      AdminDeliveryServicesObj.get(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  async deleteData(req, res) {
    try {
      if (!req.query.id) {
        return res.status(400).json({
          message: "id is mandatory",
          statusCode: 400,
          success: false,
        });
      }
      AdminDeliveryServicesObj.deleteByIdData(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  // async getCurrency(req, res) {
  //   try {
  //     CurrecyServicesObj.getCurrencyByName(req, res);
  //   } catch (err) {
  //     return res
  //       .status(500)
  //       .json({ message: err?.message, statusCode: 500, success: false });
  //   }
  // }
}

const DeliveryControllerObj = new DeliveryController();
export default DeliveryControllerObj;
