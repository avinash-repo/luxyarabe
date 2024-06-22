import UserModel from "../../models/UserModel.js";
import bcrypt from "bcrypt";
import geoip from "geoip-lite";
import crypto from "crypto";
import CartModel from "../../models/CartModel.js";
import WishlistModel from "../../models/WishlistModel.js";
import CouponModel from "../../models/couponModel.js";
import {
  sendPasswordViaEmail,
  forgotPasswordEmail,
  encryptStringWithKey,
} from "../../helpers/common.js";
import { Op, where } from "sequelize";
import userOtpModel from "../../models/userOtpModel.js";
import { environmentVars } from "../../config/environmentVar.js";
import { generateAccessToken } from "../../helpers/validateUser.js";
import jwt from "jsonwebtoken";
import axios from "axios";

let salt = environmentVars.salt;
// console.log(environmentVars?.secretCapcha,"lll")env

class UserServices {
  async createUser(req, res) {
    try {
      let email = req.body.email.trim();
      let phone = req.body.phone;
      let country = req.body.country;
      let captchaValue = req.body.captchaValue;

      const capchaSecret = environmentVars?.secretCapcha;
      const response = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${capchaSecret}&response=${captchaValue}`
      );
      if (response.data.success) {
        let salt = environmentVars.salt;

        // let randomPassword = crypto.randomBytes(10).toString("base64");
        let randomPassword = encryptStringWithKey(
          req.body.email.toLowerCase()?.slice(0, 6)
        );
        let hashPassword = await bcrypt.hash(`${randomPassword}`, `${salt}`);

        let obj = {
          name: req.body.name?.trim(),
          email: email,
          phone: phone,
          country: country,
          password: hashPassword,
          is_verified: false,
          is_social_login: 0,
        };
        //for smtp
        let data = {
          name: req.body.name?.trim(),
          email: email,
          phone: phone,
          country: country,
          userPassword: `${randomPassword}`,
        };
        let findEmailExist = await UserModel.findOne({
          where: { email: email },
        });
        if (findEmailExist) {
          return res.status(400).json({
            success: false,
            message: "Email already exist!",
            statusCode: 400,
          });
          // } else if (
          //   findEmailExist &&
          //   findEmailExist.email &&
          //   findEmailExist.is_verified == false
          // ) {
          //   await sendPasswordViaEmail(res, data);
          //   return;
        } else {
          const userData = await UserModel.create(obj, { raw: true });
          if (userData) {
            let check = await sendPasswordViaEmail(res, data);
            if (check) {
              res.status(201).json({
                success: true,
                statusCode: 201,
                message:
                  "User registered successfully , Please check the mail for password",
              });
            } else {
              res.status(201).json({
                success: true,
                statusCode: 201,
                message: "User registered successfully,", //ask content
              });
            }
          }
        }
      } else {
        return res
          .status(400)
          .json({ success: false, message: "reCAPTCHA verification failed." });
      }
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async loginUser(req, res) {
    try {
      let { email, password, captchaValue } = req.body;

      const capchaSecret = environmentVars?.secretCapcha;
      const response = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${capchaSecret}&response=${captchaValue}`
      );

      if (response.data.success) {
        let emailExistCheck = await UserModel.findOne({
          where: { email },
          raw: true,
        });
        if (!emailExistCheck) {
          return res.status(400).json({
            message: "Email not found",
            success: false,
            statusCode: 400,
          });
        }
        // return
        if (
          emailExistCheck?.is_social_login == 1 &&
          emailExistCheck?.password == null
        ) {
          return res.status(400).json({
            message: "Password invalid",
            success: false,
            statusCode: 400,
          });
        }
        let checkpassword = await bcrypt.compare(
          password,
          emailExistCheck?.password
        );

        if (!checkpassword) {
          return res.status(400).json({
            message: "Password invalid",
            success: false,
            statusCode: 400,
          });
        }
        delete emailExistCheck?.password;
        // console.log(emailExistCheck, "emailExistCheck22222emailExistCheck");
        let token = generateAccessToken(emailExistCheck);
        let expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 1); // Expires in 1 days
        // expiryDate.setTime(expiryDate.getTime() + (60 * 1000)); // Current time + 1 minute

        res
          .cookie("_token", token, {
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            secure: true, // Requires HTTPS connection
            sameSite: "strict", // Restricts the cookie to be sent only in same-site requests
            expires: expiryDate, // Set the expiry date
          })
          .status(200)
          .json({
            success: true,
            data: emailExistCheck?.name,
            message: "Logged in successful",
            statusCode: 200,
          });
        // console.log(emailExistCheck?.is_verified,"emailExistCheck?.is_verifiedemailExistCheck?.is_verified")
        if (emailExistCheck?.is_verified == 0) {
          await UserModel.update(
            { is_verified: true },
            { where: { id: emailExistCheck?.id } }
          );
        }
        return;
      } else {
        return res
          .status(400)
          .json({ success: false, message: "reCAPTCHA verification failed." });
      }
    } catch (err) {
      console.log(err, "Error in login api user");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async sendForgotPasswordEmail(req, res) {
    try {
      let email = req.body.email?.trim();
      let captchaValue = req.body.captchaValue?.trim();

      const capchaSecret = environmentVars?.secretCapcha;
      const response = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${capchaSecret}&response=${captchaValue}`
      );

      if (response.data.success) {
        let findEmailExist = await UserModel.findOne({
          where: { email },
          attributes: ["email", "id", "name"],
          raw: true,
        });

        if (!findEmailExist) {
          return res.status(404).json({
            message: "Please enter your registered email.",
            success: false,
            statusCode: 400,
          });
        } else {
          let getRandomNumber = Math.round(Math.random() * 10000);
          getRandomNumber = getRandomNumber + "";
          if (getRandomNumber?.length == 3) {
            getRandomNumber = "0" + getRandomNumber;
          } else if (getRandomNumber?.length == 2) {
            getRandomNumber = "00" + getRandomNumber;
          } else if (getRandomNumber?.length == 1) {
            getRandomNumber = "000" + getRandomNumber;
          }
          let obj = {
            user_id: findEmailExist?.id,
            otp_code: getRandomNumber,
            email: findEmailExist?.email,
            name: findEmailExist?.name,
            creation_time: Date.now(),
          };
          // console.log(obj,"EEEEEEEEEEEEEEEEEEEEEEEEEEEE")
          let getEmailCheck = await userOtpModel.findOne({
            where: { user_id: findEmailExist?.id },
            attributes: ["id"],
          });
          if (getEmailCheck && getEmailCheck?.id) {
            await userOtpModel.update(
              { otp_code: getRandomNumber, creation_time: Date.now() },
              { where: { user_id: findEmailExist?.id } }
            );
          } else {
            await userOtpModel.create(obj);
          }
          let get = await forgotPasswordEmail(req, res, obj);
          if (get) {
            res.status(200).json({
              success: true,
              statusCode: 200,
              message: "Otp sent to registered email",
            });
            return;
          } else {
            res.status(400).json({
              success: false,
              statusCode: 400,
              message: "Unable to sent mail",
            });
          }
        }
      } else {
        return res
          .status(400)
          .json({ success: false, message: "reCAPTCHA verification failed." });
      }
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async verify_otp_data(req, res) {
    try {
      let { email, otp_code } = req.body;
      email = req.body.email?.trim();
      let emailExist = await UserModel.findOne({ where: { email }, raw: true });
      if (!emailExist) {
        res
          .status(400)
          .json({ message: "User not found", success: false, statusCode: 400 });
        return;
      }
      let fetchDoc = await userOtpModel.findOne({
        where: { user_id: emailExist?.id },
        raw: true,
      });

      if (!fetchDoc) {
        return res.status(400).json({
          message: "Internal server error",
          success: false,
          statusCode: 400,
        });
      }
      let creation_time = fetchDoc?.creation_time;
      let current_time = Date.now();
      const differenceInMilliseconds = current_time - creation_time;
      const differenceInMinutes = Math.floor(
        differenceInMilliseconds / (1000 * 60)
      );
      if (differenceInMinutes > 5) {
        return res
          .status(400)
          .json({ message: "OTP expired", success: false, statusCode: 400 });
      }
      if (fetchDoc?.otp_code != otp_code) {
        return res
          .status(400)
          .json({ message: "Invalid OTP", success: false, statusCode: 400 });
      }
      return res.status(200).json({
        message: "Verify otp successfully",
        success: true,
        statusCode: 200,
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async resetUserPassword(req, res) {
    try {
      let password = req.body.password;
      let emailData = "";
      let otp_code = req.body.otp_code;
      if (req.body.email) {
        let email = req.body?.email?.trim();
        emailData = email;
        let emailExist = await UserModel.findOne({
          where: { email: emailData },
          attributes: ["email", "id", "password", "is_social_login"],
          raw: true,
        });
        if (!emailExist) {
          res.status(400).json({
            message: "User not found",
            success: false,
            statusCode: 400,
          });
          return;
        }

        if (emailExist?.is_social_login == 1 && emailExist?.password == null) {
          return res.status(400).json({
            message: "Failed to reset password",
            success: false,
            statusCode: 400,
          });
        }

        let fetchDoc = await userOtpModel.findOne({
          where: { user_id: emailExist?.id },
          raw: true,
        });

        if (!fetchDoc) {
          return res.status(400).json({
            message: "Internal server error",
            success: false,
            statusCode: 400,
          });
        }
        let creation_time = fetchDoc?.creation_time;
        let current_time = Date.now();
        const differenceInMilliseconds = current_time - creation_time;
        const differenceInMinutes = Math.floor(
          differenceInMilliseconds / (1000 * 60)
        );
        if (differenceInMinutes > 5) {
          return res
            .status(400)
            .json({ message: "OTP expired", success: false, statusCode: 400 });
        }
        if (fetchDoc?.otp_code != otp_code) {
          return res
            .status(400)
            .json({ message: "Invalid OTP", success: false, statusCode: 400 });
        }

        let checkpassword = await bcrypt.compare(
          password,
          emailExist?.password
        );
        if (checkpassword) {
          return res.status(400).json({
            message: "Password must be unique, previous password not allowed",
            statusCode: 400,
            success: false,
          });
        }
      } else {
        let _secrate = req?.cookies?._token;
        const proof = jwt.verify(_secrate, process.env.JWT_SECRET, {
          algorithm: "HS512",
        });
        emailData = proof?.email;
      }
      // console.log(emailData,"emailDataemailDataemailDataemailData")

      let hashPassword = await bcrypt.hash(password, salt);
      await UserModel.update(
        { password: hashPassword },
        { where: { email: emailData } }
      );
      return res.status(200).json({
        message: "Password change successfully",
        success: true,
        statusCode: 200,
      });
    } catch (err) {
      console.errro(err);
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async getAllUSerData(req, res) {
    try {
      let fetchArray = await UserModel.findAll();
      res.status(200).json({
        message: "fetch user data",
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

  async updateUserDetails(id, data, res) {
    try {
      UserModel.update(data, { where: { id: id } })
        .then((response) => {
          return res
            .status(201)
            .json({ success: true, message: "values updated" });
        })
        .catch((error) => {
          return res
            .status(500)
            .json({ success: false, message: error?.message });
        });
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message });
    }
  }

  async getUserAccountInfo(req, res) {
    try {
      const carts = await CartModel.count({
        where: { user_id: req.userData.id },
      });
      const wishlists = await WishlistModel.count({
        where: { user_id: req.userData.id },
      });
      const coupons = await CouponModel.count();
      return res.status(200).json({
        success: true,
        message: "Data fetched successfully",
        data: { carts, wishlists, coupons },
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message });
    }
  }

  async getUserLocation(req, res) {
    try {
      const getClientIp = (req) => {
        const forwardedHeader = req.headers["x-forwarded-for"];
        if (forwardedHeader) {
          const forwardedIps = forwardedHeader.split(",");
          return forwardedIps[0].trim();
        }
        return req.connection.remoteAddress;
      };

      const userIP = getClientIp(req);

      let ip = "103.57.251.255";
      let geo = geoip.lookup(userIP);

      console.log(geo, "userIP:", userIP);

      return res.status(200).json({
        success: true,
        message: "Data fetched successfully",
        data: geo,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message });
    }
  }
}

const UserServicesObj = new UserServices();
export default UserServicesObj;
