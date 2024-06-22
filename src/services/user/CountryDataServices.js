import ProductAvailability from "../../models/ProductAvailability.js";

// for user
class CountryDataServices {
  async getDataForUser(req, res) {
    try {
    
      const getAll = await ProductAvailability.findAll({
        where: { status: "active" },
        attributes: ["country_code", "country",'currency_symbol'],
        raw: true,
      });

      return res.status(200).json({
        message: "Fetch data",
        data: getAll,
        success: true,
        statusCode: 200,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
}

const CountryDataServicesObj = new CountryDataServices();
export default CountryDataServicesObj;
