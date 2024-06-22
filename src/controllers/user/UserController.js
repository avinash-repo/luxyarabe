import {
  forgotPasswordSchema,
  registerSchema,
  resetPasswordSchema,
  updateUserSchema,
  loginSchema,
  otpSchema,
  updateUserNameSchema,
} from "../../helpers/validateUser.js";
import bcrypt from "bcrypt";
import UserServicesObj from "../../services/user/UserServices.js";
import jwt from "jsonwebtoken";
import { environmentVars } from "../../config/environmentVar.js";
import UserModel from "../../models/UserModel.js";
// import axios from "axios";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

class UserController {
  async register(req, res) {
    try {
      // captcha for future purpose
      //     const capchaSecret = process.env.GOOGLE_SECRET_KEY;
      // const response =await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${capchaSecret}&response=${req.body?.captchaValue}`)
      // if(!response?.data?.success){
      //   return res.status(400).json({message:"Invalid captcha"})
      // }

      let { error } = registerSchema.validate(req?.body, options);
      // console.log(error, "eeeeeeee register");
      if (error) {
        if (error?.details[0]?.message?.includes("Phone")) {
          return res.status(400).json({
            message: "Invalid phone number",
            success: false,
            statusCode: 400,
          });
        } else {
          return res.status(400).json({
            message: error.details[0]?.message,
            success: false,
            statusCode: 400,
          });
        }
      }
      UserServicesObj.createUser(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async login(req, res) {
    try {
      let { error } = loginSchema.validate(req?.body, options);

      if (error) {
        return res
          .status(400)
          .json({ message: error.details[0]?.message, success: false });
      }
      UserServicesObj.loginUser(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async forgotPassword(req, res) {
    try {
      let { error } = forgotPasswordSchema.validate(req?.body, options);

      if (error) {
        return res
          .status(400)
          .json({ message: error.details[0]?.message, success: false });
      }
      UserServicesObj.sendForgotPasswordEmail(req, res);
    } catch (err) {
      console.error(err);
      // console.log(err, "error user contrl");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async verify_otp(req, res) {
    try {
      let { error } = otpSchema.validate(req?.body, options);
      if (error) {
        return res
          .status(400)
          .json({ message: error.details[0]?.message, success: false });
      }

      UserServicesObj.verify_otp_data(req, res);
    } catch (err) {
      console.error(err);
      // console.log(err, "Eeee reset password");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async resetPassword(req, res) {
    try {
      let { error } = resetPasswordSchema.validate(req?.body, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }
      UserServicesObj.resetUserPassword(req, res);
    } catch (err) {
      console.error(err);
      console.log(err, "Eeee reset password123");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async FetchUsers(req, res) {
    // console.log(req.cookies._token);
  }

  async getAllUser(req, res) {
    try {
      UserServicesObj.getAllUSerData(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
  async check_user_logged_in(req, res) {
    try {
      let _secrate = req?.cookies?._token;
      let proof = {};
      if (_secrate) {
        proof = jwt.verify(_secrate, process.env.JWT_SECRET, {
          algorithm: "HS512",
        });
      }
      let userData = {};
      if (proof && proof?.id) {
        userData = await UserModel.findOne({
          where: { id: proof.id },
          raw: true,
        });
      }
      // console.log(userData);
      if (proof && proof?.id) {
        return res.status(200).json({
          message: "User logged in",
          success: true,
          statusCode: 200,
          data: userData,
        });
      } else {
        return res.status(400).json({
          message: "User logged out",
          success: false,
          statusCode: 400,
        });
      }
    } catch (err) {
      console.error(err, "EEEEEEEEEE");
      return res.status(500).json({
        message: err?.message,
        success: false,
        statusCode: 500,
      });
    }
  }
  async user_logout(req, res) {
    try {
      return (
        res
          .clearCookie("_token")
          // .clearCookie()

          .status(200)
          .json({ success: true, message: "Logout successful" })
      );
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ mesaage: err?.message, success: false, statusCode: 500 });
    }
  }

  async logoutUser(req, res) {}

  async updateUserInfo(req, res) {
    try {
      const { error } = updateUserSchema.validate(req.body, options);
      console.log(error, "lll");
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }

      let data = {};
      data.name = req.body?.name || req.userData.name;
      data.phone = req.body?.phone || req.userData.phone;
      data.country = req.body?.country || req.userData.country; //
      if (req.body.password) {
        let emailExist = await UserModel.findOne({
          where: { id: req.userData.id },
          attributes: ["email", "id", "password", "is_social_login"],
          raw: true,
        });
        if (!emailExist) {
          return res.status(400).json({
            message: "User not found",
            success: false,
            statusCode: 400,
          });
        }
        let checkpassword = await bcrypt.compare(
          req.body.password,
          emailExist?.password
        );
        if (checkpassword) {
          return res.status(400).json({
            message:
              "Invalid: The new password can't be the same as the old one.",
            statusCode: 400,
            success: false,
          });
        } else {
          let hashPassword = await bcrypt.hash(
            `${req.body.password}`,
            `${environmentVars?.salt}`
          );
          data.password = hashPassword;
          UserServicesObj.updateUserDetails(req.userData.id, data, res);
          // console.log("checkpassword", checkpassword, emailExist);
        }
      } else {
        UserServicesObj.updateUserDetails(req.userData.id, data, res);
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: err?.message });
    }
  }
  async updateUserName(req, res) {
    try {
      const { error } = updateUserNameSchema.validate(req.body, options);
      console.log(error, "lll");
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }
      if (!req.body.name) {
        return res.status(400).json({
          message: "Name is required",
          success: false,
          statusCode: 400,
        });
      }

      let data = {};
      data.name = req.body?.name || req.userData.name;

      UserModel.update(data, { where: { id: req.userData.id } })
        .then((response) => {
          return res
            .status(201)
            .json({ success: true, message: "values updated" });
        })
        .catch((error) => {
          console.error(err);
          return res
            .status(500)
            .json({ success: false, message: error?.message });
        });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: err?.message });
    }
  }
  async getUserAccountInfo(req, res) {
    UserServicesObj.getUserAccountInfo(req, res);
  }
  async getUserLocation(req, res) {
    UserServicesObj.getUserLocation(req, res);
  }
}

const UserControllerObj = new UserController();
export default UserControllerObj;
