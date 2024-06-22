import { ContactUS } from "../../helpers/validateContactUs.js";
import ContactusObj from "../../services/user/ContactUsServices.js";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

class ContactUs {
  async ContactUs(req, res) {
    try {
      let { error } = ContactUS.validate(req?.body, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }

      ContactusObj.ContactUS(req, res);
    } catch (error) {
      console.error(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }
  async getGoogleAuth(req, res) {
    ContactusObj.authgoogle(req, res);
  }
  async getGoogleAuth2(req, res) {
    ContactusObj.callback(req, res);
  }
  async getcreateFile(req, res) {
    ContactusObj.createFile(req, res);
  }
  async getcreateCode(req, res) {
    ContactusObj.getcreateCodeData(req, res);
  }
}

const ContactUsObj = new ContactUs();
export default ContactUsObj;
