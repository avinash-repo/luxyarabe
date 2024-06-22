import { getValidateFilterdatafochema } from "../../helpers/validateFilterData.js";
import { uiSectionSchema } from "../../helpers/validateUiSections.js";
import FilterProductServices from "../../services/user/FilterProductServices.js";
const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};
class filterProductController {
  async getData(req, res) {
    FilterProductServices.getAllFilterProductData(req, res);
  }
  async filterMinMaxPriceCountryWise(req, res) {

      let { error } = getValidateFilterdatafochema.validate(req?.query, options);
      if (error) {
        return res
          .status(400)
          .json({ message: error.details[0]?.message, success: false });
      }
    if (!req.query.country_code) {
      return res.status(400).json({
        message: "Country_code is mandatory",
        statusCode: 400,
        success: false,
      });
    }
    FilterProductServices.filterMinMaxPriceCountryWise(req, res);
  }
}
const FilterProductControllerObj = new filterProductController();
export default FilterProductControllerObj;
