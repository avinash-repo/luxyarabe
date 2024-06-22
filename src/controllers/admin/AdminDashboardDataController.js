import { BestSellerSchema } from "../../helpers/validateBestSeller.js";
import DashboardDataServicesObj from "../../services/admin/DashboardDataServices.js";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};
import { Sequelize } from "sequelize";

class DashboardDataController {
  async get_data(req, res) {
    try {
      DashboardDataServicesObj?.getDashboardData(req, res);
    } catch (error) {
      console.error(err);
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }

  async get_order_data(req, res) {
    try {
      DashboardDataServicesObj?.get_order_variant_count_data(req, res);
    } catch (error) {
      console.error(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }

  async get_user_data(req, res) {
    try {
      let filters = {};
      const today = new Date();
      let fromDate;
      let toDate;
      if (req.query.today) {
        const startDateToday = new Date(today);
        startDateToday.setHours(0, 0, 0, 0); // Set to the start of today
        fromDate = startDateToday
          .toISOString()
          .slice(0, 19)
          .replace("T", " "); // Convert to MySQL TIMESTAMP format

        const endDateToday = new Date();
        endDateToday.setHours(23, 59, 59, 999); // Set to the end of today
        toDate = endDateToday
          .toISOString()
          .slice(0, 19)
          .replace("T", " "); // Convert to MySQL TIMESTAMP format
      }

      if (req.query.this_week) {
        const startOfLastSevenDays = new Date(today);
        startOfLastSevenDays.setUTCHours(0, 0, 0, 0);
        startOfLastSevenDays.setUTCDate(today.getUTCDate() - 6); // Subtract 6 days to get the start of the last seven days
        fromDate = startOfLastSevenDays
          .toISOString()
          .slice(0, 19)
          .replace("T", " "); // Convert to MySQL TIMESTAMP format
        const endOfToday = new Date(today);
        endOfToday.setUTCHours(23, 59, 59, 999);
        toDate = endOfToday
          .toISOString()
          .slice(0, 19)
          .replace("T", " "); // Convert to MySQL TIMESTAMP format
      }

      if (req.query.this_month) {
        const today = new Date();
        const startOfLast30Days = new Date(today);
        startOfLast30Days.setUTCDate(today.getUTCDate() - 29); // Subtract 29 days to get the start of the last 30 days
        startOfLast30Days.setUTCHours(0, 0, 0, 0); // Set to the start of the day

        fromDate = startOfLast30Days
          .toISOString()
          .slice(0, 19)
          .replace("T", " "); // Convert to MySQL TIMESTAMP format
        const endOfToday = new Date(today);
        endOfToday.setUTCHours(23, 59, 59, 999); // Set to the end of today

        toDate = endOfToday
          .toISOString()
          .slice(0, 19)
          .replace("T", " "); // Convert to MySQL TIMESTAMP format
      }

      // Filter for this year
      if (req.query.this_year) {
        const today = new Date();
        const startOfLast365Days = new Date(today);
        startOfLast365Days.setUTCDate(today.getUTCDate() - 364); // Subtract 364 days to get the start of the last 365 days
        startOfLast365Days.setUTCHours(0, 0, 0, 0); // Set to the start of the day

        fromDate = startOfLast365Days
          .toISOString()
          .slice(0, 19)
          .replace("T", " "); // Convert to MySQL TIMESTAMP format
        const endOfToday = new Date(today);
        endOfToday.setUTCHours(23, 59, 59, 999); // Set to the end of today

        toDate = endOfToday
          .toISOString()
          .slice(0, 19)
          .replace("T", " "); // Convert to MySQL TIMESTAMP format
      }
      filters.fromDate = fromDate;
      filters.toDate = toDate;
      DashboardDataServicesObj?.getUserData(req, res, filters);
    } catch (error) {
      console.error(err);
      // console.log(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }

  async get_best_seller_product(req, res) {
    try {
      if (!req.query.country_code) {
        return res.status(400).json({
          message: "Country_code is mandatory",
          statusCode: 400,
          success: false,
        });
      }
      let filters = {};
      const today = new Date();
      let fromDate;
      let toDate;
      if (req.query.today) {
        const startDateToday = new Date(today);
        startDateToday.setHours(0, 0, 0, 0); // Set to the start of today
        fromDate = startDateToday
          .toISOString()
          .slice(0, 19)
          .replace("T", " "); // Convert to MySQL TIMESTAMP format

        const endDateToday = new Date();
        endDateToday.setHours(23, 59, 59, 999); // Set to the end of today
        toDate = endDateToday
          .toISOString()
          .slice(0, 19)
          .replace("T", " "); // Convert to MySQL TIMESTAMP format
      }

      if (req.query.this_week) {
        const startOfLastSevenDays = new Date(today);
        startOfLastSevenDays.setUTCHours(0, 0, 0, 0);
        startOfLastSevenDays.setUTCDate(today.getUTCDate() - 6); // Subtract 6 days to get the start of the last seven days
        fromDate = startOfLastSevenDays
          .toISOString()
          .slice(0, 19)
          .replace("T", " "); // Convert to MySQL TIMESTAMP format
        const endOfToday = new Date(today);
        endOfToday.setUTCHours(23, 59, 59, 999);
        toDate = endOfToday
          .toISOString()
          .slice(0, 19)
          .replace("T", " "); // Convert to MySQL TIMESTAMP format
      }

      if (req.query.this_month) {
        const today = new Date();
        const startOfLast30Days = new Date(today);
        startOfLast30Days.setUTCDate(today.getUTCDate() - 29); // Subtract 29 days to get the start of the last 30 days
        startOfLast30Days.setUTCHours(0, 0, 0, 0); // Set to the start of the day

        fromDate = startOfLast30Days
          .toISOString()
          .slice(0, 19)
          .replace("T", " "); // Convert to MySQL TIMESTAMP format
        const endOfToday = new Date(today);
        endOfToday.setUTCHours(23, 59, 59, 999); // Set to the end of today

        toDate = endOfToday
          .toISOString()
          .slice(0, 19)
          .replace("T", " "); // Convert to MySQL TIMESTAMP format
      }

      // Filter for this year
      if (req.query.this_year) {
        const today = new Date();
        const startOfLast365Days = new Date(today);
        startOfLast365Days.setUTCDate(today.getUTCDate() - 364); // Subtract 364 days to get the start of the last 365 days
        startOfLast365Days.setUTCHours(0, 0, 0, 0); // Set to the start of the day

        fromDate = startOfLast365Days
          .toISOString()
          .slice(0, 19)
          .replace("T", " "); // Convert to MySQL TIMESTAMP format
        const endOfToday = new Date(today);
        endOfToday.setUTCHours(23, 59, 59, 999); // Set to the end of today

        toDate = endOfToday
          .toISOString()
          .slice(0, 19)
          .replace("T", " "); // Convert to MySQL TIMESTAMP format
      }
      filters.fromDate = fromDate;
      filters.toDate = toDate;

      DashboardDataServicesObj?.getBestSellerProductWithDetails(
        req,
        res,
        filters
      );
    } catch (error) {
      console.error(err);
      // console.log(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }

  async get_profit(req, res) {
    try {
      if (!req.query.country_code) {
        return res.status(400).json({
          message: "Country_code is mandatory",
          statusCode: 400,
          success: false,
        });
      }
      // let filters = {};
      const today = new Date();
      let fromDate;
      let toDate;
      // if (req.query.today) {
      //   const startDateToday = new Date(today);
      //   startDateToday.setHours(0, 0, 0, 0); // Set to the start of today
      //   fromDate = startDateToday
      //     .toISOString()
      //     .slice(0, 19)
      //     .replace("T", " "); // Convert to MySQL TIMESTAMP format

      //   const endDateToday = new Date();
      //   endDateToday.setHours(23, 59, 59, 999); // Set to the end of today
      //   toDate = endDateToday
      //     .toISOString()
      //     .slice(0, 19)
      //     .replace("T", " "); // Convert to MySQL TIMESTAMP format
      // }

      // if (req.query.this_week) {
      //   const startOfLastSevenDays = new Date(today);
      //   startOfLastSevenDays.setUTCHours(0, 0, 0, 0);
      //   startOfLastSevenDays.setUTCDate(today.getUTCDate() - 6); // Subtract 6 days to get the start of the last seven days
      //   fromDate = startOfLastSevenDays
      //     .toISOString()
      //     .slice(0, 19)
      //     .replace("T", " "); // Convert to MySQL TIMESTAMP format
      //   const endOfToday = new Date(today);
      //   endOfToday.setUTCHours(23, 59, 59, 999);
      //   toDate = endOfToday
      //     .toISOString()
      //     .slice(0, 19)
      //     .replace("T", " "); // Convert to MySQL TIMESTAMP format
      // }

      // if (req.query.this_month) {
      //   const today = new Date();
      //   const startOfLast30Days = new Date(today);
      //   startOfLast30Days.setUTCDate(today.getUTCDate() - 29); // Subtract 29 days to get the start of the last 30 days
      //   startOfLast30Days.setUTCHours(0, 0, 0, 0); // Set to the start of the day

      //   fromDate = startOfLast30Days
      //     .toISOString()
      //     .slice(0, 19)
      //     .replace("T", " "); // Convert to MySQL TIMESTAMP format
      //   const endOfToday = new Date(today);
      //   endOfToday.setUTCHours(23, 59, 59, 999); // Set to the end of today

      //   toDate = endOfToday
      //     .toISOString()
      //     .slice(0, 19)
      //     .replace("T", " "); // Convert to MySQL TIMESTAMP format
      // }

      // // Filter for this year
      // if (req.query.this_year) {
      //   const today = new Date();
      //   const startOfLast365Days = new Date(today);
      //   startOfLast365Days.setUTCDate(today.getUTCDate() - 364); // Subtract 364 days to get the start of the last 365 days
      //   startOfLast365Days.setUTCHours(0, 0, 0, 0); // Set to the start of the day

      //   fromDate = startOfLast365Days
      //     .toISOString()
      //     .slice(0, 19)
      //     .replace("T", " "); // Convert to MySQL TIMESTAMP format
      //   const endOfToday = new Date(today);
      //   endOfToday.setUTCHours(23, 59, 59, 999); // Set to the end of today

      //   toDate = endOfToday
      //     .toISOString()
      //     .slice(0, 19)
      //     .replace("T", " "); // Convert to MySQL TIMESTAMP format
      // }
      // filters.fromDate = fromDate;
      // filters.toDate = toDate;
      // =======-------------------------------------------------------
      //=============================================================
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
      // if (req.query.this_week) {
      //   const today = new Date();
      //   const startOfWeek = new Date(today);
      //   startOfWeek.setUTCHours(0, 0, 0, 0);
      //   startOfWeek.setUTCDate(today.getUTCDate() - today.getUTCDay()); // Set to the first day of the week (Sunday)

      //   const endOfWeek = new Date(today);
      //   endOfWeek.setUTCHours(23, 59, 59, 999);
      //   endOfWeek.setUTCDate(today.getUTCDate() + (6 - today.getUTCDay())); // Set to the last day of the week (Saturday)

      //   filters.order_date = { [Sequelize.Op.between]: [startOfWeek, endOfWeek] };
      // }
      if (req.query.this_week) {
        const today = new Date();
        const endDate = new Date(today);
        endDate.setUTCHours(23, 59, 59, 999); // Set to end of the day

        const startDate = new Date(today);
        startDate.setUTCHours(0, 0, 0, 0); // Set to start of the day
        startDate.setUTCDate(today.getUTCDate() - 6); // Set to 7 days ago

        filters.order_date = {
          [Sequelize.Op.between]: [startDate, endDate],
        };
      }

      // if (req.query.this_month) {
      //   const startOfMonth = new Date();
      //   startOfMonth.setUTCDate(1);
      //   startOfMonth.setUTCHours(0, 0, 0, 0);

      //   const endOfMonth = new Date();
      //   endOfMonth.setUTCMonth(endOfMonth.getUTCMonth() + 1, 0);
      //   endOfMonth.setUTCHours(23, 59, 59, 999);

      //   filters.order_date = {
      //     [Sequelize.Op.between]: [startOfMonth, endOfMonth],
      //   };
      // }
      if (req.query.this_month) {
        const today = new Date();
        const endDate = new Date(today);
        endDate.setUTCHours(23, 59, 59, 999); // Set to end of the day

        const startDate = new Date(today);
        startDate.setUTCHours(0, 0, 0, 0); // Set to start of the day
        startDate.setUTCDate(today.getUTCDate() - 29); // Set to 30 days ago

        filters.order_date = {
          [Sequelize.Op.between]: [startDate, endDate],
        };
      }

      // Filter for this year
      if (req.query.this_year) {
        // const startOfYear = new Date();
        // startOfYear.setUTCMonth(0, 1);
        // startOfYear.setUTCHours(0, 0, 0, 0);

        // const endOfYear = new Date();
        // endOfYear.setUTCMonth(11, 31);
        // endOfYear.setUTCHours(23, 59, 59, 999);

        // filters.order_date = {
        //   [Sequelize.Op.between]: [startOfYear, endOfYear],
        // };
        const today = new Date();
        const endDate = new Date(today);
        endDate.setUTCHours(23, 59, 59, 999); // Set to end of the day

        const startDate = new Date(today);
        startDate.setUTCHours(0, 0, 0, 0); // Set to start of the day
        startDate.setUTCDate(today.getUTCDate() - 364); // Set to 365 days ago

        filters.order_date = {
          [Sequelize.Op.between]: [startDate, endDate],
        };
      }
      if (startDate && endDate) {
        filters.order_date = { [Sequelize.Op.between]: [startDate, endDate] };
      }
      const countryCode = req.query.country_code;
      if (countryCode) {
        filters.country_code = countryCode;
      }
      filters.status = "delivered";

      DashboardDataServicesObj?.getProductProfit(req, res, filters);
    } catch (error) {
      console.error(err);
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }
  async fetch_live_user(req, res) {
    try {
      DashboardDataServicesObj.fetchliveUser(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  async fetchLiveInsightsClarityData(req, res) {
    try {
      DashboardDataServicesObj.fetchLiveInsightsClarity(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
}

const DashboardControllerObj = new DashboardDataController();
export default DashboardControllerObj;
