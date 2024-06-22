import CountryDataServicesObj from "../../services/user/CountryDataServices.js";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

//for user
class CountryDataController {
  async getUSerData(req, res) {
    try {
      CountryDataServicesObj?.getDataForUser(req, res);
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
}

const CountryDataControllerObj = new CountryDataController();
export default CountryDataControllerObj;
