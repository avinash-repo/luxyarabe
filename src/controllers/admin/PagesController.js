import {
  addCouponSchema,
  updateCouponSchema,
} from "../../helpers/validateCoupon.js";
import { ImageFileCheck, removefIle } from "../../helpers/validateImageFile.js";
import { addPagesSchema } from "../../helpers/validatePages.js";
import PagesServicesObj from "../../services/admin/PagesServices.js";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

class Pages {
  async addPage(req, res) {
    try {
      let { error } = addPagesSchema.validate(req?.body, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }
      if (req.files.pages_image && req.files.pages_image?.length) {
        let array = req.files.variant_image_Arr;
        for (let el of array) {
          let name = el?.filename;
          let size = el?.size;
          let get = await ImageFileCheck(name, res, size);
          if (get == "invalid file") {
            try {removefIle(name)} catch (er) {console.log(er,"eoror in remove image")  }
            return res.status(400).json({
              message:
                "Pages image must be png or jpeg file and size must be less than 500 kb",
              statusCode: 400,
              success: false,
            });
          }
        }
      }

      PagesServicesObj.createPages(req, res);
    } catch (error) {
      console.error(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }

  async deletePagesById(req, res) {
    try {
      if (!req.query.id) {
        return res.status(400).json({
          message: "Page id is mandatory",
          statusCode: 400,
          success: false,
        });
      }
      // console.log(req.query, "eee2222221111ee22121eeee");
      PagesServicesObj.deletePagesById(req, res);
    } catch (error) {
      console.error(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }

  async get_about_us_data(req, res) {
    try {
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ messaga: err?.message, statusCode: 500, success: false });
    }
  }
}

const PagesObj = new Pages();
export default PagesObj;
