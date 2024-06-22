import { BestSellerSchema } from "../../helpers/validateBestSeller.js";
import { ImageFileCheck, removefIle } from "../../helpers/validateImageFile.js";
import BestSellerServicesObj from "../../services/admin/BestSellerServices.js";
import BestSellerObj from "../../services/user/BestSellerServices.js";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

class BestSellerController {
  async add_data(req, res) {
    try {
      if(!req.body.id){

        let { error } = BestSellerSchema.validate(req?.body, options);
        if (error) {
          return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }
      }

      if (req.files && req.files?.image?.length) {
        let data = req.files?.image;
        for (let el of data) {
          let name = el?.filename;
          let size=el?.size
          let get = await ImageFileCheck(name, "bestSeller",size);
          if (get == "invalid file") {
            try {removefIle(name,'bestSeller')} catch (er) {console.log(er,"eoror in remove image")  }
            return res.status(400).json({
              message: "Gender image must be PNG or JPEG or WEBP file and size must be less than 500 kb",
              statusCode: 400,
              success: false,
            });
          }
        }
      }

      BestSellerServicesObj?.addBestSellerData(req, res);
    } catch (error) {
      console.error(err);
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }
  async get_data(req, res) {
    try {
      BestSellerServicesObj?.getData(req, res);
    } catch (error) {
      console.error(error)
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }

  async delete_by_id(req, res) {
    try {
      if (!req.query.id) {
        return res
          .status(400)
          .json({
            message: "Id is mandatory",
            statusCode: 400,
            success: false,
          });
      }
      BestSellerServicesObj.delete_Data(req,res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  //==============================================================
  //for user
  async fetch_data(req, res) {
    try {
      BestSellerObj.getData;
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
}

const BestSellerControllerObj = new BestSellerController();
export default BestSellerControllerObj;
