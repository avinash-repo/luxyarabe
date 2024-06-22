import {
  addEducationInfochema,
  changeStatusEducationInfochema,
} from "../../helpers/validateEducationInfo.js";
import { ImageFileCheck, removefIle } from "../../helpers/validateImageFile.js";

import EducationServiceObj from "../../services/user/EducationInfoService.js";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

class EducationInfoController {
  async add(req, res) {
    try {
      // console.log(req.body, "EEEEE");
      // console.log(req.file, "EEEEE@@@@@@");
      if (!req.body.id) {
        let { error } = addEducationInfochema.validate(req?.body, options);
        if (error) {
          return res
            .status(400)
            .json({ message: error.details[0]?.message, success: false });
        }
      }
      if (req.file && req.file?.filename) {
        let name = req.file?.filename;
        let size = req.files?.size;
        let data = "educationInfo";
        let get = await ImageFileCheck(name, data, size);
        if (get == "invalid file") {
          try {removefIle(name,'educationInfo')} catch (er) {console.log(er,"eoror in remove product imgae")  }
          return res.status(400).json({
            message:
              "Id card image must be png or jpeg or webp file and size must be less than 500 kb",
            statusCode: 400,
            success: false,
          });
        }
      } 
      // else {
      //   if (!req.body.id) {
      //     return res
      //       .status(400)
      //       .json({ message: "Id card image is mandatory", success: false });
      //   }
      // }
      EducationServiceObj.addData(req, res);
    } catch (err) {
      console.error(err, "Error ");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
  async get(req, res) {
    try {
      EducationServiceObj.getData(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  

  // async get_one(req, res) {
  //   try {
  //     // EducationServiceObj.get_one(req, res);
  //   } catch (err) {
  //     return res
  //       .status(500)
  //       .json({ message: err?.message, statusCode: 500, success: false });
  //   }
  // }
  // async get_by_id(req, res) {
  //   try {
  //     // EducationServiceObj.get_one(req, res);
  //   } catch (err) {
  //     return res
  //       .status(500)
  //       .json({ message: err?.message, statusCode: 500, success: false });
  //   }
  // }
  async change_status(req, res) {
    try {
      let { error } = changeStatusEducationInfochema.validate(
        req?.body,
        options
      );
      if (error) {
        return res
          .status(400)
          .json({ message: error.details[0]?.message, success: false });
      }
      EducationServiceObj.changeStatus(req, res);
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
}

const EducationInfoControllerObj = new EducationInfoController();
export default EducationInfoControllerObj;
