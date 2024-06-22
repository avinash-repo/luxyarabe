import UserModel from "../../models/UserModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
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

let salt = environmentVars.salt;
class UserSocialServices {
  async createUser(req, res, countrydata, userdata) {
    try {
      let email = userdata?.email;
      let country = countrydata?.country;
      let name = userdata?.name;
      let obj = {
        name,
        email,
        country: country,
        is_social_login: 1,
        is_verified: true,
      };

      let findEmailExist = await UserModel.findOne({
        where: { email: email },
        raw: true,
      });
      if (findEmailExist) {
        let token = generateAccessToken(findEmailExist);
        res
          .cookie("_token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
          })
          .status(200)
          .json({
            success: true,
            message: "Logged in successfully!",
            statusCode: 200,
          });
      } else {
        const userData = await UserModel.create(obj);
        if (userData) {
          let token = generateAccessToken(userData?.dataValues);
          res
            .cookie("_token", token, {
              httpOnly: true,
              secure: true,
              sameSite: "strict",
            })
            .status(200)
            .json({
              success: true,
              message: "Logged in successfully!",
              statusCode: 200,
            });
        }
      }
    } catch (err) {
      console.log("eeeeeee", err);
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
}

const UserSocialServicesObj = new UserSocialServices();
export default UserSocialServicesObj;
