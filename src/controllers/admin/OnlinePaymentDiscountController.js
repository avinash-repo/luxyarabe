import { editStatusonlinePaymentDiscountSchema, onlinePaymentDiscountSchema } from "../../helpers/validateOnlinePaymentDiscount.js";
import OnlinePaymentDiscountServices from "../../services/admin/OnlinePaymentDiscountServices.js";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

class OnlinePaymentDiscountController {
  async add(req, res) {
    try {
      let { error } = onlinePaymentDiscountSchema.validate(req?.body, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }

      OnlinePaymentDiscountServices.addData(req, res);
    } catch (error) {
      console.error(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }

  async getData(req, res) {
    try {
      OnlinePaymentDiscountServices.getData(req, res);
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  async updateStatus(req, res) {
    try {
      let { error } = editStatusonlinePaymentDiscountSchema.validate(req?.body, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }

      OnlinePaymentDiscountServices.changeStatus(req, res);
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  async destroyDataOf(req, res) {
    try {
      OnlinePaymentDiscountServices.destroyData(req, res);
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
}

const OnlinePaymentDiscountControllerObj = new OnlinePaymentDiscountController();
export default OnlinePaymentDiscountControllerObj;
