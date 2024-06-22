import {
  addZipCodeSchema,
  editZipCodeSchema,
} from "../../helpers/validateProductAvailability.js";
import ProductAvailabilityServicesObj from "../../services/user/ProductAvailabilityServices.js";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

class ProductAvailabilityControllerAdmin {
  async addZipCodes(req, res) {
    if (
      req.body.tax_value == null ||
      req.body.tax_value == undefined ||
      req.body.tax_value == ""
    ) {
      req.body.tax_value = 0;
    }
    let { error } = addZipCodeSchema.validate(req?.body, options);
    if (error) {
      return res.status(400).json({
        message: error.details[0]?.message,
        success: false,
        statusCode: 400,
      });
    }

    ProductAvailabilityServicesObj.addZipCodes(req, res);
  }

  async editZipCodesStatus(req, res) {
    let { error } = editZipCodeSchema.validate(req?.body, options);
    if (error) {
      return res.status(400).json({
        message: error.details[0]?.message,
        success: false,
        statusCode: 400,
      });
    }
    ProductAvailabilityServicesObj.changeStatus(req, res);
  }

  async fetchAllData(req, res) {
    ProductAvailabilityServicesObj.getAll(req, res);
  }

  async fetchActive(req, res) {
    ProductAvailabilityServicesObj.getActive(req, res);
  }
}
const ProductAvailabilityControllerAdminObj =
  new ProductAvailabilityControllerAdmin();
export default ProductAvailabilityControllerAdminObj;
