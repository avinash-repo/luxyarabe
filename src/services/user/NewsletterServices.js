import { Op } from "sequelize";
import { environmentVars } from "../../config/environmentVar.js";
import NewsLetterModel from "../../models/NewsletterModel.js";
import { subscribeMailForNewsletter } from "../../helpers/common.js";

let salt = environmentVars.salt;

class NewsLetterServices {
  async subscribeNewsletter(req, res) {
    try {
      let email = req.body.email;
      email = email?.trim();
      let emailExist = await NewsLetterModel.findOne({
        where: { email },
        raw: true,
      });
      // console.log(emailExist,"email exist")
      if (emailExist && emailExist?.id) {
        if (emailExist && emailExist?.status == "inactive") {
          await NewsLetterModel.update(
            { status: "active" },
            {
              where: { email: email },
            }
          );
        } else {
          res.status(200).json({
            message: "Newsletter Already subscribed",
            statusCode: 200,
            success: true,
            isExist: true,
          });
          return;
        }
      } else {
        await NewsLetterModel.create({ email });
      }
      res.status(200).json({
        message: "Newsletter subscribed successfully",
        statusCode: 200,
        success: true,
      });
      await subscribeMailForNewsletter(email);
      return;
    } catch (err) {
      console.log(err,"44")
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
  async unsubscribeNewsletter(req, res) {
    try {
      let email = req.body.email;
      let message = req.body.message;
      email = email?.trim();
      let emailExist = await NewsLetterModel.findOne({
        where: { email },
        raw: true,
      });
      if (emailExist && emailExist?.id) {
        if (emailExist && emailExist?.status == "inactive") {
          return res.status(200).json({
            message: "Already Unsubscribed newsletter",
            statusCode: 200,
            success: true,
          });
        } else {
          await NewsLetterModel.update(
            { status: "inactive", message },
            { where: { email: email } }
          );
          return res.status(200).json({
            message: "Unsubscribed newsletter successfully",
            statusCode: 200,
            success: true,
          });
        }
      } else {
        return res.status(400).json({
          message: "Email not found",
          statusCode: 400,
          success: false,
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async getAllDataForAdmin(req, res) {
    try {
      // if (req?.userData?.role != "admin") {
      //   return res
      //     .status(400)
      //     .json({ message: "Not authorised", statusCode: 400, success: false });
      // }
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
