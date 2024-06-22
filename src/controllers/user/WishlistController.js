import { registerSchema } from "../../helpers/validateUser.js";
import { addWishlistSchema } from "../../helpers/validateWishlist.js";
import WishListServicesObj from "../../services/user/WishlistsServices.js";

class WishListController {
  async addToWishlist(req, res) {
    try {
      // const {  } = req.query;
      // let { error } = addWishlistSchema.validate(req.query, options);
      // // console.log(error, "eeeeeeee register");
      // if (error) {
      //     return res.status(400).json({
      //       message: error.details[0]?.message,
      //       success: false,
      //       statusCode: 400,
      //     });
      // }
      WishListServicesObj.AddToWishlist(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  async getShorlistedData(req, res) {
    try {
      WishListServicesObj.getShorlistedData(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  async getShorlistedProductData(req, res) {
    try {
      WishListServicesObj.getShorlistedProductDataAl(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async getWishlistData(req, res) {
    try {
      WishListServicesObj.getWishlistLength(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  
}

const WishListControllerObj = new WishListController();
export default WishListControllerObj;
