import { newsletterSchema } from "../../helpers/validateNewsletter.js";
import NewsLetterServicesObj from "../../services/user/NewsletterServices.js";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

class NewsletterController {
  async newsletterSubscribe(req, res) {
    try {
      let { error } = newsletterSchema.validate(req?.body, options);
      if (error) {
        return res
          .status(400)
          .json({
            message: error.details[0]?.message,
            success: false,
            statusCode: 400,
          });
      }
      NewsLetterServicesObj.subscribeNewsletter(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
  async newsletterUnSubscribe(req, res) {
    try {
      if (!req.body.email) {
        return res
          .status(400)
          .json({
            message: "Email is mandatory",
            success: false,
            statusCode: 400,
          });
      }
      let { error } = newsletterSchema.validate(req?.body, options);
      if (error) {
        return res
          .status(400)
          .json({
            message: error.details[0]?.message,
            success: false,
            statusCode: 400,
          });
      }
      NewsLetterServicesObj.unsubscribeNewsletter(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async get_newsletter_data(req, res) {
    try {
      NewsLetterServicesObj.getAllDataForAdmin(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
}
const NewsletterControllerObj = new NewsletterController();
export default NewsletterControllerObj;
