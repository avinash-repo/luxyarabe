import {
  cartSchema,
  cartSchemaUpdate,
} from "../../helpers/validateCartSchema.js";
import { addCurrencySchema } from "../../helpers/validateCurrency.js";
// import CurrecyServicesObj from "../../services/admin/adminCurrencyServices.js";
import CartServicesObj from "../../services/user/CartServices.js";
// import CurrecyServicesObj from "../../services/user/CurrencyServices.js";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};
class CartController {
  async addToCart(req, res) {
    try {
      let { error } = cartSchema.validate(req?.body, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }

      CartServicesObj.AddToCart(req, res);
    } catch (error) {
      console.error(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }

  async getFromCart(req, res) {
    try {
      CartServicesObj.getCartData(req, res);
    } catch (error) {
      console.error(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }
  async getCountFromCart(req, res) {
    try {
      CartServicesObj.getCountFromCartData(req, res);
    } catch (error) {
      console.error(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }
  async getCountCart(req, res) {
    try {
      CartServicesObj.getCountCart(req, res);
    } catch (error) {
      console.error(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }

  async UpdateProductInCart(req, res) {
    try {
      let { error } = cartSchemaUpdate.validate(req?.body, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }

      CartServicesObj.UpdateProductInCart(req, res);
    } catch (error) {
      console.error(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }

  async DeleteOrClearCart(req, res) {
    try {
      CartServicesObj.DeleteOrClearCart(req, res);
    } catch (error) {
      console.error(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }
}

const CartControllerObj = new CartController();
export default CartControllerObj;
