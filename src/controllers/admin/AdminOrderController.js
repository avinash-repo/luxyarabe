import {
  UpdateDeliveryDateSchema,
  UpdateDeliveryDayForAllSchema,
  UpdateOrderPaymentStatusSchema,
  UpdateOrderStatusSchema,
  cancel_order_schema,
  get_filter_order_data_schema,
  request_return_schema,
} from "../../helpers/validateOrder.js";
import OrderServices from "../../services/admin/OrderServices.js";
import { Sequelize } from "sequelize";
const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

class OrderController {
  async update_delivery_date(req, res) {
    try {
      let { error } = UpdateDeliveryDateSchema.validate(req?.body, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }

      OrderServices?.update_delivery_date_data(req, res);
    } catch (error) {
      console.error(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }
  async update_order_status_date(req, res) {
    try {
      let { error } = UpdateOrderStatusSchema.validate(req?.body, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }

      OrderServices?.update_Order_status_data(req, res);
    } catch (errupdate_order_statusor) {
      console.error(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }
  async update_order_payment_status(req, res) {
    try {
      let { error } = UpdateOrderPaymentStatusSchema.validate(
        req?.body,
        options
      );
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }

      OrderServices?.update_Order_payment_status_data(req, res);
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
      console.log(error, "Error ");
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
      console.error(err)
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
      console.error(err)
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

  async get_all(req, res) {
    try {
      OrderServices.getAll(req, res);
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  async getFilteredOrders(req, res) {
    try{
      let { error } = get_filter_order_data_schema.validate(req?.query, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }
    let filters = {};
    const startDate = req.query.start_date;
    const endDate = req.query.end_date;
    if (req.query.today) {
      const startDateToday = new Date();
      startDateToday.setHours(0, 0, 0, 0);
      const endDateToday = new Date();
      endDateToday.setHours(23, 59, 59, 0);
      filters.order_date = {
        [Sequelize.Op.between]: [startDateToday, endDateToday],
      };
    }
    if (req.query.this_week) {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setUTCHours(0, 0, 0, 0);
      startOfWeek.setUTCDate(today.getUTCDate() - today.getUTCDay()); // Set to the first day of the week (Sunday)

      const endOfWeek = new Date(today);
      endOfWeek.setUTCHours(23, 59, 59, 999);
      endOfWeek.setUTCDate(today.getUTCDate() + (6 - today.getUTCDay())); // Set to the last day of the week (Saturday)

      filters.order_date = { [Sequelize.Op.between]: [startOfWeek, endOfWeek] };
    }
    if (req.query.this_month) {
      const startOfMonth = new Date();
      startOfMonth.setUTCDate(1);
      startOfMonth.setUTCHours(0, 0, 0, 0);

      const endOfMonth = new Date();
      endOfMonth.setUTCMonth(endOfMonth.getUTCMonth() + 1, 0);
      endOfMonth.setUTCHours(23, 59, 59, 999);

      filters.order_date = {
        [Sequelize.Op.between]: [startOfMonth, endOfMonth],
      };
    }

    // Filter for this year
    if (req.query.this_year) {
      const startOfYear = new Date();
      startOfYear.setUTCMonth(0, 1);
      startOfYear.setUTCHours(0, 0, 0, 0);

      const endOfYear = new Date();
      endOfYear.setUTCMonth(11, 31);
      endOfYear.setUTCHours(23, 59, 59, 999);

      filters.order_date = { [Sequelize.Op.between]: [startOfYear, endOfYear] };
    }
    if (startDate && endDate) {
      filters.order_date = { [Sequelize.Op.between]: [startDate, endDate] };
    }
    const countryCode = req.query.country_code;
    if (countryCode) {
      filters.country_code = countryCode;
    }
    OrderServices.getFilteredOrders(req, res, filters);
  }catch(err){
    return res.status(500).json({message:err?.message,statusCode:500,success:false})
  }
  }
  async fetchGraphDataSubtotal(req, res) {
    let filters = {};
    const startDate = req.query.start_date;
    const endDate = req.query.end_date;
    if (req.query.today) {
      const startDateToday = new Date();
      startDateToday.setHours(0, 0, 0, 0);
      const endDateToday = new Date();
      endDateToday.setHours(23, 59, 59, 0);
      filters.order_date = {
        [Sequelize.Op.between]: [startDateToday, endDateToday],
      };
    }
    if (req.query.this_week) {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setUTCHours(0, 0, 0, 0);
      startOfWeek.setUTCDate(today.getUTCDate() - today.getUTCDay()); // Set to the first day of the week (Sunday)

      const endOfWeek = new Date(today);
      endOfWeek.setUTCHours(23, 59, 59, 999);
      endOfWeek.setUTCDate(today.getUTCDate() + (6 - today.getUTCDay())); // Set to the last day of the week (Saturday)

      filters.order_date = { [Sequelize.Op.between]: [startOfWeek, endOfWeek] };
    }
    if (req.query.this_month) {
      const startOfMonth = new Date();
      startOfMonth.setUTCDate(1);
      startOfMonth.setUTCHours(0, 0, 0, 0);

      const endOfMonth = new Date();
      endOfMonth.setUTCMonth(endOfMonth.getUTCMonth() + 1, 0);
      endOfMonth.setUTCHours(23, 59, 59, 999);

      filters.order_date = {
        [Sequelize.Op.between]: [startOfMonth, endOfMonth],
      };
    }

    // Filter for this year
    if (req.query.this_year) {
      const startOfYear = new Date();
      startOfYear.setUTCMonth(0, 1);
      startOfYear.setUTCHours(0, 0, 0, 0);

      const endOfYear = new Date();
      endOfYear.setUTCMonth(11, 31);
      endOfYear.setUTCHours(23, 59, 59, 999);

      filters.order_date = { [Sequelize.Op.between]: [startOfYear, endOfYear] };
    }
    if (startDate && endDate) {
      filters.order_date = { [Sequelize.Op.between]: [startDate, endDate] };
    }
    const countryCode = req.query.country_code;
    if (countryCode) {
      filters.country_code = countryCode;
    }
    filters.status = "delivered";
    OrderServices.fetchGraphDataSubtotal(filters, req, res);
  }
  async fetchGraphDataOrders(req, res) {
    let filters = {};
    const startDate = req.query.start_date;
    const endDate = req.query.end_date;
    if (req.query.today) {
      const startDateToday = new Date();
      startDateToday.setHours(0, 0, 0, 0);
      const endDateToday = new Date();
      endDateToday.setHours(23, 59, 59, 0);
      filters.order_date = {
        [Sequelize.Op.between]: [startDateToday, endDateToday],
      };
    }
    if (req.query.this_week) {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setUTCHours(0, 0, 0, 0);
      startOfWeek.setUTCDate(today.getUTCDate() - today.getUTCDay()); // Set to the first day of the week (Sunday)

      const endOfWeek = new Date(today);
      endOfWeek.setUTCHours(23, 59, 59, 999);
      endOfWeek.setUTCDate(today.getUTCDate() + (6 - today.getUTCDay())); // Set to the last day of the week (Saturday)

      filters.order_date = { [Sequelize.Op.between]: [startOfWeek, endOfWeek] };
    }
    if (req.query.this_month) {
      const startOfMonth = new Date();
      startOfMonth.setUTCDate(1);
      startOfMonth.setUTCHours(0, 0, 0, 0);

      const endOfMonth = new Date();
      endOfMonth.setUTCMonth(endOfMonth.getUTCMonth() + 1, 0);
      endOfMonth.setUTCHours(23, 59, 59, 999);

      filters.order_date = {
        [Sequelize.Op.between]: [startOfMonth, endOfMonth],
      };
    }

    // Filter for this year
    if (req.query.this_year) {
      const startOfYear = new Date();
      startOfYear.setUTCMonth(0, 1);
      startOfYear.setUTCHours(0, 0, 0, 0);

      const endOfYear = new Date();
      endOfYear.setUTCMonth(11, 31);
      endOfYear.setUTCHours(23, 59, 59, 999);

      filters.order_date = { [Sequelize.Op.between]: [startOfYear, endOfYear] };
    }
    if (startDate && endDate) {
      filters.order_date = { [Sequelize.Op.between]: [startDate, endDate] };
    }
    const countryCode = req.query.country_code;
    if (countryCode) {
      filters.country_code = countryCode;
    }
    filters.status = "delivered";
    OrderServices.fetchGraphDataOrders(filters, req, res);
  }
  //update delivery data below
  async update_delivery_day_for_all(req, res) {
    try {
      let { error } = UpdateDeliveryDayForAllSchema.validate(
        req?.body,
        options
      );
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }

      OrderServices?.update_delivery_day_data(req, res);
    } catch (error) {
      console.log(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }
  async fetch_delivery_data(req, res) {
    try {
      OrderServices?.get_delivery_day_data(req,res)
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  async delete_delivery_data(req, res) {
    try {
      if(!req.query.id){
        return res.status(400).json({message:"id is mandatory",statusCode:400,success:false})
      }
      OrderServices?.delete_delivery_day_data(req,res)
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

}

const OrderControllerObj = new OrderController();
export default OrderControllerObj;
