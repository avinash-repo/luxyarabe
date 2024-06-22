import { checkProductAvailableSchema } from "../../helpers/validateProductAvailability.js";
import ProductAvailabilityServicesObj from "../../services/user/ProductAvailabilityServices.js";


const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

class ProductAvailabilityController {
  async isProductAvailable(req, res) {

    let { error } = checkProductAvailableSchema.validate(req?.query, options);
    if (error) {
      return res
        .status(400)
        .json({ message: error.details[0]?.message, success: false });
    }
    ProductAvailabilityServicesObj.isProductAvailable(req,res)

  }
}
const ProductAvailabilityControllerObj = new ProductAvailabilityController();
export default ProductAvailabilityControllerObj