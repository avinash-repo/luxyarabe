import {
  OrderSchema,
  UpdateOrderSchema,
  cancel_order_schema,
  createPaymentIntentSchema,
  createPaymentNetorkSchema,
  request_return_schema,
  createPaymentCashFreeSchema
} from "../../helpers/validateOrder.js";
import OrderServices from "../../services/user/OrderServices.js";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

class OrderController {
  async createOrder(req, res) {
    try {
      // console.log(req.userData,"req.userData,")
      let { error } = OrderSchema.validate(req?.body, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }

      OrderServices.create_order(req, res);
    } catch (error) {
      console.error(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }
  async updateOrder(req, res) {
    try {
      let { error } = UpdateOrderSchema.validate(req?.body, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }

      OrderServices?.update_order(req, res);
    } catch (error) {
      console.error(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }
  async updateOrderbyNetworkGateway(req, res) {
    try {
      if (!req?.query?.refid) {
        return res.status(400).json({
          message: "Reference Id is required",
          success: false,
          statusCode: 400,
        });
      }
      // console.log(req.query, "11");

      OrderServices?.update_order_by_network_gateway(req, res);
    } catch (error) {
      console.error(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }

  async get_order(req, res) {
    try {
      OrderServices.getAll(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async cancel_order(req, res) {
    try {
      let { error } = cancel_order_schema.validate(req?.body, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }
      OrderServices.cancel_order_by_user(req, res);
    } catch (error) {
      console.error(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }

  async get_track_order(req, res) {
    try {
      if (!req.query?.order_id) {
        return res.status(400).json({
          message: "Order id is mandatory",
          success: false,
          statusCode: 400,
        });
      }
      OrderServices.get_track_order_data(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async request_return(req, res) {
    try {
      if (!req.id) {
        return res
          .status(400)
          .json({ message: "Not authorise", statusCode: 400, success: false });
      }
      let { error } = request_return_schema.validate(req?.query, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }
      OrderServices?.request_return_by_user(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async downloadInvoice(req, res) {
    if (!req.query.order_id) {
      return res.status(400).json({
        message: "order id is mandatory",
        statusCode: 400,
        success: false,
      });
    }
    OrderServices.downloadInvoice(req, res);
  }

  async create_payment_intent(req, res) {
    try {
      let { error } = createPaymentIntentSchema.validate(req?.body, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }
      OrderServices.create_payment_intent_data(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async createPaymentUsingNetwork(req, res) {
    try {
      let { error } = createPaymentNetorkSchema.validate(req?.body, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }
      OrderServices.create_payment_network_data(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  //manage delivery date, shipping date, outfor delivery date

  //cashfree controller
  async cashfreeCreateOrder(req, res) {
    try {
      let { error } = createPaymentCashFreeSchema.validate(req?.body, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }
      OrderServices.cashfreeCreateOrder(req, res);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: err?.message });
    }
  }
  async cashfreeCheckOrder(req, res) {
    try {
      OrderServices.cashfreeCheckOrder(req, res);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: err?.message });
    }
  }
}

const OrderControllerObj = new OrderController();
export default OrderControllerObj;
