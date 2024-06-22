import FooterModel from "../../models/FooterModel.js";

class FooterServices {
  async getAllData(req, res) {
    try {
      let fetchArray = await FooterModel.findOne({ raw: true });
      res.status(200).json({
        message: "Fetch category data",
        data: fetchArray,
        success: true,
        statusCode: 200,
      });
      return;
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
}

const FooterServicesObj = new FooterServices();
export default FooterServicesObj;
