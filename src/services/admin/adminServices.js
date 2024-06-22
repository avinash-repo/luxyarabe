import AdminUserModel from "../../models/AdminUserModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import {
  sendPasswordViaEmail,
  forgotPasswordEmail,
  encryptStringWithKey,
  sendOtpForlogin,
} from "../../helpers/common.js";
import { Op } from "sequelize";
import userOtpModel from "../../models/userOtpModel.js";
import { environmentVars } from "../../config/environmentVar.js";
import {
  generateAccessToken,
  generateAccessTokenForAdmin,
} from "../../helpers/validateUser.js";
import jwt from "jsonwebtoken";
import adminUserOtpModel from "../../models/AdminUserOtpModel.js";
import RolesModel from "../../models/RolesModel.js";
import PermissionModuleModel from "../../models/PermissionModuleModel.js";
import ProductAvailability from "../../models/ProductAvailability.js";

import ApiEndpoint from "../../models/apiEndpointModel.js";

let salt = environmentVars.salt;
class AdminUserServices {
  //super_admin created
  async createUser(req, res) {
    try {
      let email = req.body.email.trim();
      let phone = req.body.phone;
      let role = req.body.role?.trim();
      let salt = environmentVars.salt;

      let randomPassword = encryptStringWithKey(req.body.email.toLowerCase());
      let hashPassword = await bcrypt.hash(`${randomPassword}`, `${salt}`);

      let obj = {
        name: req.body.name?.trim(),
        email: email,
        phone: phone,
        role,
        password: hashPassword,
        is_verified: false,
      };
      let data = {
        name: req.body.name?.trim(),
        email: email,
        phone: phone,
        role,
        userPassword: `${randomPassword}`,
      };
      let findEmailExist = await AdminUserModel.findOne({
        where: { email: email },
        raw: true,
      });
      // console.log(findEmailExist, "findEmailExistfindEmailExist");
      if (findEmailExist && findEmailExist.is_verified == true) {
        return res.status(400).json({
          success: false,
          message: "Email already exist!",
          statusCode: 400,
        });
      } else if (
        findEmailExist &&
        findEmailExist.email &&
        findEmailExist.is_verified == false
      ) {
        await sendPasswordViaEmail(res, data);
        return;
      } else {
        const userData = await AdminUserModel.create(obj, { raw: true });
        if (userData) {
          await sendPasswordViaEmail(res, data);
        }
      }
    } catch (err) {
      console.log(err, "errror  iiiiiii");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
  //previos data
  // async loginUser(req, res) {
  //   try {
  //     let { email, password } = req.body;
  //     let emailExistCheck = await AdminUserModel.findOne({
  //       where: { email },
  //       raw: true,
  //     });
  //     if (!emailExistCheck) {
  //       return res
  //         .status(400)
  //         .json({ message: "Email not found", success: false });
  //     }
  //     let checkpassword = await bcrypt.compare(
  //       password,
  //       emailExistCheck?.password
  //     );

  //     if (!checkpassword) {
  //       return res.status(400).json({
  //         message: "Password invalid",
  //         success: false,
  //         statusCode: 400,
  //       });
  //     }
  //     if (emailExistCheck && emailExistCheck?.status != "active") {
  //       return res.status(400).json({
  //         message: "This account de-activated",
  //         statusCode: 400,
  //         success: false,
  //       });
  //     }
  //     delete emailExistCheck?.password;
  //     // console.log(emailExistCheck, "emailExistCheckemailExistCheck");
  //     let token = generateAccessTokenForAdmin(emailExistCheck);
  //     let cookieTokenName = "_tokenAdmin";
  //     // if (emailExistCheck && emailExistCheck?.role == "admin") {
  //     //   cookieTokenName = "_tokenSubAdmin";
  //     // }
  //     let expiryDate = new Date();
  //     expiryDate.setDate(expiryDate.getDate() + 1); // Expires in 1 days
  //     // expiryDate.setTime(expiryDate.getTime() + (60 * 1000)); // Current time + 1 minute

  //     res
  //       .cookie(cookieTokenName, token, {
  //         httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
  //         secure: true, // Requires HTTPS connection
  //         sameSite: "strict", // Restricts the cookie to be sent only in same-site requests
  //         expires: expiryDate,
  //       })
  //       .status(200)
  //       .json({
  //         success: true,
  //         message: "Login successful",
  //         statusCode: 200,
  //         data: { role: emailExistCheck?.role },
  //       });
  //     // console.log(emailExistCheck?.is_verified,"emailExistCheck?.is_verifiedemailExistCheck?.is_verified")
  //     if (emailExistCheck?.is_verified == 0) {
  //       await AdminUserModel.update(
  //         { is_verified: true },
  //         { where: { id: emailExistCheck?.id } }
  //       );
  //     }
  //     return;
  //   } catch (err) {
  //     console.log(err, "Error in login api");
  //     return res
  //       .status(500)
  //       .json({ message: err?.message, success: false, statusCode: 500 });
  //   }
  // }

  async loginUser(req, res) {
    try {
      let { email, password } = req.body;
      let emailExistCheck = await AdminUserModel.findOne({
        where: { email },
        raw: true,
      });
      if (!emailExistCheck) {
        return res
          .status(400)
          .json({ message: "Email not found", success: false });
      } else if (emailExistCheck && emailExistCheck?.status != "active") {
        return res.status(400).json({
          message: "This acount is deactivated",
          statusCode: 400,
          success: false,
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
      let getRandomNumber = Math.round(Math.random() * 10000);
      getRandomNumber = getRandomNumber + "";
      if (getRandomNumber.length == 2) {
        getRandomNumber = "00" + getRandomNumber;
      } else if (getRandomNumber.length == 3) {
        getRandomNumber = "0" + getRandomNumber;
      } else if (getRandomNumber?.length == 1) {
        getRandomNumber = "000" + getRandomNumber;
      }

      let obj = {
        user_id: emailExistCheck?.id,
        otp_code: getRandomNumber,
        email: emailExistCheck?.email,
        name: emailExistCheck?.name,
        creation_time: Date.now(),
      };
      // console.log(obj,"EEEEEEEEE")
      let getEmailCheck = await adminUserOtpModel.findOne({
        where: { user_id: emailExistCheck?.id },
        raw: true,
      });
      if (getEmailCheck && getEmailCheck?.id) {
        await adminUserOtpModel.update(
          { otp_code: getRandomNumber, creation_time: Date.now(), used: 0 },
          { where: { user_id: emailExistCheck?.id } }
        );
      } else {
        await adminUserOtpModel.create(obj);
      }
      // obj.otp_code = JSON.stringify(obj.otp_code);

      await sendOtpForlogin(req, res, obj);
      // return;
    } catch (err) {
      console.log(err, "Error in login api admin");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  //work with new login api
  async loginWithOtp(req, res) {
    try {
      let { email, otp_code } = req.body;
      email = req.body.email?.trim();
      let emailExist = await AdminUserModel.findOne({
        where: { email },
        raw: true,
      });
      if (!emailExist) {
        res.status(400).json({
          message: "Admin not found",
          success: false,
          statusCode: 400,
        });
        return;
      }
      let fetchDoc = await adminUserOtpModel.findOne({
        where: { user_id: emailExist?.id },
        raw: true,
      });

      if (!fetchDoc) {
        return res.status(400).json({
          message: "Otp document not found",
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

      delete emailExist?.password;
      // console.log(emailExistCheck, "emailExistCheckemailExistCheck");
      let token = generateAccessTokenForAdmin(emailExist);
      let cookieTokenName = "_tokenAdmin";
      res
        .cookie(cookieTokenName, token, {
          httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
          secure: true, // Requires HTTPS connection
          sameSite: "strict", // Restricts the cookie to be sent only in same-site requests
        })
        .status(200)
        .json({
          success: true,
          message: "Login successful",
          statusCode: 200,
          data: { role: emailExist?.role },
        });
      // console.log(emailExistCheck?.is_verified,"emailExistCheck?.is_verifiedemailExistCheck?.is_verified")
      if (emailExist?.is_verified == 0) {
        await AdminUserModel.update(
          { is_verified: true },
          { where: { id: emailExist?.id } }
        );
      }
      await adminUserOtpModel.update(
        { used: 1 },
        { where: { user_id: emailExist?.id } }
      );
      return;
      // return res.status(200).json({
      //   message: "Verify otp successfully",
      //   success: true,
      //   statusCode: 200,
      // });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async verify_otp_data(req, res) {
    try {
      let { email, otp_code } = req.body;
      email = req.body.email?.trim();
      let emailExist = await AdminUserModel.findOne({
        where: { email },
        raw: true,
      });
      if (!emailExist) {
        res
          .status(400)
          .json({ message: "Admin User not found", success: false });
        return;
      }
      let fetchDoc = await adminUserOtpModel.findOne({
        where: { user_id: emailExist?.id },
        raw: true,
      });

      if (!fetchDoc) {
        return res.status(400).json({
          message: "Admin otp data not found",
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
      await adminUserOtpModel.update(
        { used: 1 },
        { where: { user_id: emailExist?.id } }
      );
      return res.status(200).json({
        message: "Verify otp successfully",
        success: true,
        statusCode: 200,
      });
    } catch (err) {
      console.log(err, "Error ");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async check_user_logged_in_data(req, res) {
    try {
      let _secrate = req?.cookies?._tokenAdmin;
      // console.log(_secrate,"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
      let proof = {};
      let frontendArr = [];
      let backendArr = [];
      if (_secrate) {
        proof = jwt.verify(_secrate, process.env.JWT_SECRET_FOR_ADMIN, {
          algorithm: "HS512",
        });
      }
      // console.log(proof, "prooofffffff");
      let roleData = {};
      if (proof && proof?.id && proof?.role != "super_admin") {
        let roleId = proof?.role_id;
        let fetchData = await RolesModel.findOne({
          where: { id: roleId },
          raw: true,
        });
        proof.roleObj = fetchData;
        let permissionArr = fetchData?.permissions;

        let fetchPermission = await PermissionModuleModel.findAll({
          where: { id: permissionArr },
          raw: true,
        });
        let apiEndpointData = [];

        // console.log(fetchPermission, "asssssssssssssss");
        for (let el of fetchPermission) {
          for (let elem of el?.backend_routes) {
            apiEndpointData.push(elem);
          }
          for (let elem of el?.frontend_routes) {
            apiEndpointData.push(elem);
          }
        }
        let fetchApiEndpointData = await ApiEndpoint.findAll({
          where: { id: apiEndpointData },
          raw: true,
        });
        for (let el of fetchApiEndpointData) {
          if (el.type == "frontend") {
            frontendArr.push(el);
          } else if (el.type == "backend") {
            backendArr.push(el);
          }
        }
        // console.log(
        //   fetchApiEndpointData,
        //   "fetchApiEndpointDatafetchApiEndpointData"
        // );
        // proof.apiEndpoint = fetchApiEndpointData;
        for (let el of fetchPermission) {
          let backendEndpoint = [];
          let frontendEndPoint = [];
          for (let elem of el?.backend_routes) {
            let findData = fetchApiEndpointData.find(
              (data) => data?.id == elem
            );
            backendEndpoint.push(findData);
            // console.log(findData, "finddddddddddddddd");
          }
          el.backendEndpoint = backendEndpoint;
          for (let elem of el?.frontend_routes) {
            let findData = fetchApiEndpointData.find(
              (data) => data?.id == elem
            );
            frontendEndPoint.push(findData);
          }
          el.frontendEndPoint = frontendEndPoint;
        }
        proof.roleObj.permissionObj = fetchPermission;
        proof.frontendArr = frontendArr;
        proof.backendArr = backendArr;
      }
      if (proof && proof?.id) {
        return res.status(200).json({
          message: "Admin User logged in",
          success: true,
          statusCode: 200,
          data: proof,
        });
      } else {
        return res.status(400).json({
          message: " Admin User logged out",
          success: false,
          statusCode: 400,
        });
      }
    } catch (err) {
      console.log(err, "!@!@Erororororo");
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async sendForgotPasswordEmail(req, res) {
    try {
      let email = req.body.email?.trim();
      let findEmailExist = await AdminUserModel.findOne({
        where: { email },
        attributes: ["email", "id", "name"],
        raw: true,
      });

      if (!findEmailExist) {
        return res.status(404).json({
          message: "Email not found",
          success: false,
          statusCode: 404,
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
        };
        // console.log(obj,"EEEEEEEEEEEEEEEEEEEEEEEEEEEE",getRandomNumber)
        let getEmailCheck = await adminUserOtpModel.findOne({
          where: { user_id: findEmailExist?.id },
          attributes: ["id"],
        });
        if (getEmailCheck && getEmailCheck?.id) {
          await adminUserOtpModel.update(
            { otp_code: getRandomNumber, creation_time: Date.now(), used: 0 },
            { where: { user_id: findEmailExist?.id } }
          );
        } else {
          await adminUserOtpModel.create(obj);
        }
        let get = await forgotPasswordEmail(req, res, obj);
        if (get) {
          return res
            .status(200)
            .json({
              message: "Otp share with registered email",
              statusCode: 200,
              success: true,
            });
        } else {
          return res
            .status(200)
            .json({
              message: "Otp did not send, kindly do after some-time",
              statusCode: 400,
              success: false,
            });
        }
      }
    } catch (err) {
      // console.log(err);
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async resetUserPassword(req, res) {
    try {
      let password = req.body.password;
      let emailData = "";
      // console.log(req.body, "eeeeeeeeeee");
      let emailExist = {};
      if (req.body.email) {
        let email = req.body?.email?.trim();
        emailData = email;
        emailExist = await AdminUserModel.findOne({
          where: { email: emailData },
          raw: true,
        });
        if (!emailExist) {
          return res.status(400).json({
            message: "User not found",
            success: false,
            statusCode: 400,
          });
        }
      } else {
        let _secrate = req?.cookies?._tokenAdmin;
        const proof = jwt.verify(_secrate, process.env.JWT_SECRET_FOR_ADMIN, {
          algorithm: "HS512",
        });
        emailData = proof?.email;
      }
      // console.log(
      //   emailData,
      //   "emaaemailDataemailData",
      //   password,
      //   "ASD",
      //   salt,
      //   "salt",
      //   emailExist
      // );

      let checkpassword = await bcrypt.compare(password, emailExist?.password);
      if (checkpassword) {
        return res.status(400).json({
          message: "Password must be unique, previous password not allowed",
          statusCode: 400,
          success: false,
        });
      }
      let hashPassword = await bcrypt.hash(password, salt);
      await AdminUserModel.update(
        { password: hashPassword },
        { where: { email: emailData } }
      );
      return res.status(200).json({
        message: "Password change successfully",
        success: true,
        statusCode: 200,
      });
    } catch (err) {
      console.log(err, "Error in reset passw");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async getAllUSerData(req, res) {
    try {
      let fetchArray = await AdminUserModel.findAll();
      res
        .status(200)
        .json({ message: "fetch user data", data: fetchArray, success: true });
      return;
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  //ADMIN CREATION
  async createAdminUser(req, res) {
    try {
      let email = req.body.email.trim();
      // let phone = req.body.phone;
      let role = req.body.role?.trim();
      let salt = environmentVars.salt;
      let role_id = req.body.role_id;
      let country = req.body.country;
      // let randomPassword = encryptStringWithKey(req.body.email.toLowerCase());
      let randomPassword = encryptStringWithKey(
        req.body.email.toLowerCase()?.slice(0, 6)
      );
      // randomPassword=randomPassword
      let hashPassword = await bcrypt.hash(`${randomPassword}`, `${salt}`);
      let checkRoleExsit = await RolesModel.findOne({
        where: { id: role_id },
        raw: true,
      });
      if (!checkRoleExsit) {
        return res
          .status(400)
          .json({ message: "Role not found", statusCode: 400, success: false });
      } else if (checkRoleExsit && checkRoleExsit?.status == "inactive") {
        return res.status(400).json({
          message: "Role is not active",
          statusCode: 400,
          success: false,
        });
      }
      let obj = {
        name: req.body.name?.trim(),
        email: email,
        // phone: phone,
        role,
        country,
        role_id,
        password: hashPassword,
        is_verified: false,
      };
      let data = {
        name: req.body.name?.trim(),
        email: email,
        // phone: phone,
        role_id,
        role,
        userPassword: `${randomPassword}`,
      };
      let findEmailExist = await AdminUserModel.findOne({
        where: { email: email },
        raw: true,
      });
      // console.log(findEmailExist, "findEmailExistfindEmailExist");
      if (findEmailExist && findEmailExist.id) {
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
        const userData = await AdminUserModel.create(obj, { raw: true });
        if (userData) {
          await sendPasswordViaEmail(res, data);
        }
        return res.status(200).json({
          message: "User register successfully",
          statusCode: 200,
          success: true,
        });
      }
    } catch (err) {
      console.log(err, "errror  iiiiiii");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async loginAdminUser(req, res) {
    try {
      let { email, password } = req.body;
      let emailExistCheck = await AdminUserModel.findOne({
        where: { email },
        raw: true,
      });
      if (!emailExistCheck) {
        return res
          .status(400)
          .json({ message: "Email not found", success: false });
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
      if (emailExistCheck && emailExistCheck?.status == "inactive") {
        return res.status(400).json({
          message: "This account deactivated",
          statusCode: 400,
          success: false,
        });
      }
      let fetchRoleData = await RolesModel.findOne({
        where: { id: emailExistCheck?.role_id },
        raw: true,
      });
      if (fetchRoleData) {
        if (fetchRoleData && fetchRoleData?.permissions?.length) {
          let fetchPermission = await PermissionModuleModel.findAll({
            where: { id: fetchRoleData?.permissions, status: "active" },
            raw: true,
            attributes: ["id", "name", "status"],
          });
          emailExistCheck.permissionData = fetchPermission;
        }
      }
      delete emailExistCheck?.password;
      // console.log(emailExistCheck, "emailExistCheckemailExistCheck");
      let token = generateAccessTokenForAdmin(emailExistCheck);
      // console.log(token,"tokennnnnnnnnnnnnnnnnnn")
      res
        .cookie("_tokenSubAdmin", token, {
          httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
          secure: true, // Requires HTTPS connection
          sameSite: "strict", // Restricts the cookie to be sent only in same-site requests
        })
        .status(200)
        .json({
          success: true,
          message: "Login successful",
          statusCode: 200,
        });
      // console.log(emailExistCheck?.is_verified,"emailExistCheck?.is_verifiedemailExistCheck?.is_verified")
      if (emailExistCheck?.is_verified == 0) {
        await AdminUserModel.update(
          { is_verified: true },
          { where: { id: emailExistCheck?.id } }
        );
      }
      return;
    } catch (err) {
      console.log(err, "Error in log in login apiadmin");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async getAdminUser(req, res) {
    try {
      // let get = await AdminUserModel.findAll({
      //   where: { role: "admin", deleted_at: null },
      //   raw: true,
      // });
      // console.log(req.userData, "req.userdattttttttt");
      // req.userData.role='admin'
      // req.userData.country='US'
      let get = [];
      if (req.userData?.role == "super_admin") {
        get = await AdminUserModel.findAll({
          where: {
            role: { [Op.ne]: "super_admin" },
            deleted_at: null,
          },
          raw: true,
        });
      } else {
        get = await AdminUserModel.findAll({
          where: {
            role: { [Op.ne]: "super_admin" },
            deleted_at: null,
            country: req.userData.country,
          },
          raw: true,
        });
      }
      // let roleData = [];
      // let countryDat = [];
      // for (let le of get) {
      //   roleData.push(le.role_id);
      //   countryDat.push(le.country);
      // }
      // let countryArr = await ProductAvailability.findAll({
      //   where: { country_code: countryDat, status: "active" },
      //   raw: true,
      //   attributes: ["country_code", "country"],
      // });
      // let roleArr = await RolesModel.findAll({
      //   where: { id: roleData, status: "active" },attributes:[""],
      //   raw: true,
      // });
      // for (let le of get) {
      //   let find = countryArr.find((el) => el?.country == le?.country);
      //   if (find) {
      //     le.countryObj = find;
      //   }
      //   let find2 = roleArr.find((el) => el?.id == le?.role_id);
      //   if (find2) {
      //     le.roleObj = find2;
      //   }
      // }

      // for (let le of roleArr) {
      // }
      return res.status(200).json({
        message: "Fetched data",
        data: get,
        statusCode: 200,
        success: true,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async adminStatusChange(req, res) {
    try {
      let findAdmin = await AdminUserModel.findOne({
        where: { id: req.body.id },
        raw: true,
      });
      if (findAdmin) {
        await AdminUserModel.update(
          { status: req.body.status },
          { where: { id: req.body.id } }
        );
        res.status(200).json({
          message: "Status change successfully",
          statusCode: 200,
          success: true,
        });
      } else {
        return res
          .status(400)
          .json({ message: "User not found", statusCode: 400, success: false });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async editAdmin(req, res) {
    try {
      let { name, role_id, id, country } = req.body;
      let userExist = await AdminUserModel.findOne({
        where: { id },
        raw: true,
      });
      if (!userExist) {
        return res
          .status(400)
          .json({ message: "User not found", statusCode: 400, success: false });
      }
      if (role_id) {
        let roleFEtch = await RolesModel.findOne({
          where: { id: role_id },
          raw: true,
        });
        if (!roleFEtch) {
          return res.status(400).json({
            message: "Role not found",
            statusCode: 400,
            success: false,
          });
        } else if (roleFEtch && roleFEtch?.status != "active") {
          return res.status(400).json({
            message: "Role is not active",
            statusCode: 400,
            success: false,
          });
        }
      }

      let obj = {
        name: name || userExist?.name,
        role_id: role_id || userExist?.role_id,
        // country: country || userExist?.country,
      };
      // console.log(obj, "objectttt");
      await AdminUserModel.update(obj, { where: { id } });
      return res.status(200).json({
        message: "Details update successfully",
        statusCode: 200,
        success: true,
      });
    } catch (err) {
      console.log(err, "Erorroo");
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async deleteAdmin(req, res) {
    try {
      let id = req.query.id;

      let findUser = await AdminUserModel.findOne({
        where: { id, deleted_at: null },
        raw: true,
      });
      if (!findUser) {
        return res.status(400).json({
          message: "User not found or deleted already",
          statusCode: 400,
          success: false,
        });
      }
      await AdminUserModel.update(
        { deleted_at: new Date() },
        { where: { id } }
      );
      return res.status(200).json({
        message: "User deleted succesfully",
        statusCode: 200,
        success: true,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
}

const AdminUserServicesObj = new AdminUserServices();
export default AdminUserServicesObj;
