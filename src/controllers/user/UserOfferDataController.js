import { OfferDatachema } from "../../helpers/validateOfferData.js";
import UserOfferDataServicesObj from "../../services/user/UserOfferDataServices.js";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

class UserOfferDataController {
  //for user
  async getUSerData(req, res) {
    try {
      UserOfferDataServicesObj?.getDataForUser(req, res);
    } catch (err) {console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
}

const UserOfferDataControllerObj = new UserOfferDataController();
export default UserOfferDataControllerObj;
