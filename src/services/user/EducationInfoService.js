import axios from "axios";
import UserEducationInfoModel from "../../models/UserEducationInfo.js";
import { removefIle } from "../../helpers/validateImageFile.js";

class EducationInfoService {
  async addData(req, res) {
    try {
      let { full_name, university_name, university_id } = req.body;
      req.body.user_id = req.id;
      let findOj = await UserEducationInfoModel.findOne({
        where: { user_id: req.id },
        raw: true,
      });

      if (findOj && findOj.id) {
        let obj = {
          full_name: full_name || findOj?.full_name,
          university_name: university_name || findOj?.university_name,
          id_card_img: req.file?.filename || findOj?.id_card_img,
          university_id: university_id || findOj?.university_id,
        };
        await UserEducationInfoModel.update(obj, {
          where: { user_id: req?.id },
        });
        return res.status(200).json({
          message: "Education data update successfully",
          statusCode: 200,
          sucess: true,
        });
      } else {
        let obj = {
          full_name: full_name,
          university_id: university_id,
          university_name: university_name,
          user_id: req.id,
        };

        if (!req.file && req.file?.filename) {
          return res
            .status(400)
            .json({ message: "Id card image is mandatory", success: false });
        }
        
        const getUserData = await UserEducationInfoModel?.findOne({
          where:{university_id:university_id},
          raw: true,
        })
       
        console.log(getUserData,"obj")
        if(getUserData){
          return res.status(400).json({
            message: "User education data already exists",
            statusCode: 400,
            sucess: true,
          });
        }else{
          (obj.id_card_img = req.file?.filename),
            await UserEducationInfoModel.create(obj);
          return res.status(201).json({
            message: "User education data add successfully",
            statusCode: 201,
            sucess: true,
          });
        }
       
      }
    } catch (Err) {
      return res
        .status(500)
        .json({ message: Err?.message, statusCode: 500, success: false });
    }
  }
  async getData(req, res) {
    try {
      let get = await UserEducationInfoModel.findOne({
        where: { user_id: req.id, status: "active" },
        raw: true,
      });
      return res.status(200).json({
        message: "Fetch data",
        data: get,
        statusCode: 200,
        success: true,
      });
    } catch (Err) {
      return res
        .status(500)
        .json({ message: Err?.message, statusCode: 500, success: false });
    }
  }
  async changeStatus(req, res) {
    try {
      let findObj = await UserEducationInfoModel.findOne({
        where: { id: req.body.id, user_id: req.id, status: "active" },
        raw: true,
      });
      if (!findObj) {
        return res.status(400).json({
          message: "Document not found or deleted successfully",
          statusCode: 400,
          success: false,
        });
      } else {
        await UserEducationInfoModel.update(
          { status: req.body.status },
          { where: { id: req.body.id } }
        );
        return res.status(200).json({
          message: "Document Deleted successfully",
          statusCode: 200,
          success: true,
        });
      }

      // if()
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
}

let EducationServiceObj = new EducationInfoService();

export default EducationServiceObj;
