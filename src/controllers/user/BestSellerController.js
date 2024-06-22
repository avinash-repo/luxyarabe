import BestSellerObj from "../../services/user/BestSellerServices.js";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

class BestSellerController {
  async fetch_data(req, res) {
    try {
      BestSellerObj.getData(req,res);
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
}

const BestSellerControllerObj = new BestSellerController();
export default BestSellerControllerObj;
