import FooterServicesObj from "../../services/user/FooterServices.js";
const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

class FooterController {
  async get_data(req, res) {
    try {
      FooterServicesObj.getAllData(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
}

const FooterControllerObj = new FooterController();
export default FooterControllerObj;
