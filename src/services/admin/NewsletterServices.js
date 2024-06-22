import { Op } from "sequelize";
import { environmentVars } from "../../config/environmentVar.js";
import NewsLetterModel from "../../models/NewsletterModel.js";
import { subscribeMailForNewsletter } from "../../helpers/common.js";

let salt = environmentVars.salt;

class NewsLetterServices {
  async getAllDataForAdmin(req, res) {
    try {
      let fetch = await NewsLetterModel.findAll({ raw: true });
      res.status(200).json({
        message: "fetch newsletter data",
        data: fetch,
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

const NewsLetterServicesObj = new NewsLetterServices();
export default NewsLetterServicesObj;
