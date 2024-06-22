import { ImageFileCheck } from "../../helpers/validateImageFile.js";
import { OfferDatachema } from "../../helpers/validateOfferData.js";
import OfferDataServicesObj from "../../services/admin/OfferDataServices.js";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

class OfferDataController {
  async add_data(req, res) {
    try {
      if (!req.body.id) {
        let { error } = OfferDatachema.validate(req?.body, options);
        if (error) {
          return res
            .status(400)
            .json({ message: error.details[0]?.message, success: false });
        }
      }
      if (req.files.image && req.files.image) {
        let array = req.files.image;
        for (let el of array) {
          let name = el?.filename;
          let size=el?.size
          let get = await ImageFileCheck(name, res,size);
          if (get == "invalid file") {
            try {removefIle(name)} catch (er) {console.log(er,"eoror in remove image")  }
          
            return res.status(400).json({
              message: "Image must be PNG or JPEG file and size must be less than 500 kb",
              statusCode: 400,
              success: false,
            });
          }
          // console.log(get, "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
        }
      }
      OfferDataServicesObj?.addData(req, res);
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async getAllData(req, res) {
    try {
      OfferDataServicesObj?.getAllData(req, res);
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  //for user
  async getUSerData(req, res) {
    try {
      OfferDataServicesObj?.getDataForUser(req, res);
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  async deleteById(req, res) {
    try {
      // OfferDataServicesObj?.getDataForUser(req, res);
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
}

const OfferDataControllerObj = new OfferDataController();
export default OfferDataControllerObj;
