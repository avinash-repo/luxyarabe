import NewsLetterServicesObj from "../../services/admin/NewsletterServices.js";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

class NewsletterController {
  async get_newsletter_data(req, res) {
    try {
      NewsLetterServicesObj.getAllDataForAdmin(req, res);
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
}
const NewsletterControllerObj = new NewsletterController();
export default NewsletterControllerObj;
