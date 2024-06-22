import Currency from "../../models/currencyModel.js";
import axios from "axios";

class CurrencyServices {
  async getAllCurrency(req, res) {
    try {
      const getAllCurrency = await Currency.findAll({
        where: { status: "active" },
      });

      if (getAllCurrency) {
        return res.status(200).json({
          message: "Fetch Currency data",
          data: getAllCurrency,
          success: true,
          statusCode: 200,
        });
      } else {
        return res.status(404).json({
          message: "Data not found",
          success: false,
          statusCode: 404,
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async getCurrencyByName(req, res) {
    try {
      // console.log("req,re", req.query.name,req.query);
      if (!req.query.name) {
        return res.status(400).json({
          message: " Currency Name is required",
          statusCode: 400,
          success: false,
        });
      }
      let fetchCurrencyObj = await Currency.findOne({
        where: { name: req.query.name },
      });
      if (!fetchCurrencyObj) {
        return res.status(404).json({
          message: "Currency Does not Exist",
          success: false,
          statusCode: 404,
        });
      }

      const getRatesForCurrency = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/${req.query.name}`
      );

      if (getRatesForCurrency) {
        return res.status(200).json({
          message: "Currency Fetches successfully",
          success: true,
          statusCode: 200,
          data: getRatesForCurrency?.data?.rates?.INR,
        });
      } else {
        return res.status(404).json({
          message: "Unsupported Code",
          success: false,
          statusCode: 404,
        });
      }
    } catch (err) {
      console.log(err, "E delete");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
}

const CurrecyServicesObj = new CurrencyServices();
export default CurrecyServicesObj;
