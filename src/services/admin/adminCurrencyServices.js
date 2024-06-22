import Currency from "../../models/currencyModel.js";
import axios from "axios";

class CurrencyServices {
  async createCurrency(req, res) {
    try {
      let name = req?.body?.name?.trim();
      let symbol = req?.body?.symbol?.trim();
      let country_code = req?.body?.country_code?.trim();

      //for creating the user in database
      let obj = {
        name,
        symbol,
        country_code,
      };
      let findCurrencyExist = await Currency.findOne({
        where: { name, symbol, country_code },
      });
      if (findCurrencyExist) {
        return res.status(409).json({
          success: false,
          message: "Currency already exist!",
          statusCode: 409,
        });
      } else {
        await Currency.create(obj, { raw: true });

        return res.status(201).json({
          message: "Currency created successfully",
          success: true,
          statusCode: 201,
        });
      }
    } catch (err) {console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
  async updateStatusById(req, res) {
    try {
      if (!req.query.id) {
        return res.status(400).json({
          message: " Currency id is required",
          statusCode: 400,
          success: false,
        });
      }
      let fetchCurrencyObj = await Currency.findOne({
        where: { id: req.query.id },
      });

      if (!fetchCurrencyObj) {
        return res.status(404).json({
          message: "Currency Does not Exist",
          success: false,
          statusCode: 404,
        });
      }

      // await Currency.update({   {isDeleted:1}, {where: { id: req.query.id} } });
      await Currency.update(
        { status: req.query.status },
        { where: { id: req.query.id } }
      );

      return res.status(200).json({
        message: "Curency Updated successfully",
        success: true,
        statusCode: 200,
      });
    } catch (err) {
      console.error(err, "E delete");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async getAllCurrency(req, res) {
    try {
      const getAllCurrency = await Currency.findAll({});
      if (getAllCurrency) {
        return res.status(200).json({
          message: "Fetch category data",
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
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async getCurrencyByName(req, res) {
    try {
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
      console.error(err, "E delete");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
}

const CurrecyServicesObj = new CurrencyServices();
export default CurrecyServicesObj;
