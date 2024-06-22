import {
  CategoryDeletedSchema,
  CategoryEditSchema,
  CategorySchema,
  CategoryStatusChangeSchema,
  onlyCategorySchema,
  onlyGenderSchema,
} from "../../helpers/validateCategory.js";
import {
  FooterSchema,
  addImageDescriptionSchema,
} from "../../helpers/validateFooter.js";
import { ImageFileCheck } from "../../helpers/validateImageFile.js";
import CategoryServicesObj from "../../services/admin/CategoryServices.js";
import FooterServicesObj from "../../services/admin/FooterServices.js";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

class FooterController {
  async add_image_descriptionOf(req, res) {
    try {
      let { error } = addImageDescriptionSchema.validate(req?.body, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }
      if (req.files?.h1_image) {
        let name = req.files?.h1_image[0]?.filename;
        let size = req.files?.h1_image[0]?.size;
        let get = await ImageFileCheck(name, "footer", size);
        if (get == "invalid file") {
          try {removefIle(name,'footer')} catch (er) {console.log(er,"eoror in remove image")  }
          
          return res.status(400).json({
            message:
              "Image must be PNG or JPEG or WEBP file and size must be less than 500 kb",
            statusCode: 400,
            success: false,
          });
        }
      } else {
        if (!req.body.id) {
          return res.status(400).json({
            message: "Image is mandatory",
            statusCode: 400,
            success: false,
          });
        }
      }
      FooterServicesObj.addImageDescription(req, res);
    } catch (err) {
      console.error(err, "EEEEEEEEEEEEE");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async add(req, res) {
    try {
      let { error } = FooterSchema.validate(req?.body, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }
      if (req.files?.h1_image) {
        let name = req.files?.h1_image[0]?.filename;
        let size = req.files?.h1_image[0]?.size;
        let get = await ImageFileCheck(name, "footer", size);
        if (get == "invalid file") {
          try {removefIle(name,'footer')} catch (er) {console.log(er,"eoror in remove image")  }
          
          return res.status(400).json({
            message:
              "Image must be PNG or JPEG or WEBP file and size must be less than 500 kb",
            statusCode: 400,
            success: false,
          });
        }
      } else {
        if (!req.body.id) {
          return res.status(400).json({
            message: "Image is mandatory",
            statusCode: 400,
            success: false,
          });
        }
      }
      if (req.files?.social_media_image) {
        let data = req.files?.social_media_image;
        for (let el of data) {
          let name = el?.filename;
          let size = el?.size;
          let get = await ImageFileCheck(name, "footer", size);
          if (get == "invalid file") {
            try {removefIle(name,'footer')} catch (er) {console.log(er,"eoror in remove image")  }
          
            return res.status(400).json({
              message:
                "Image must be PNG or JPEG or WEBP file and size must be less than 500 kb",
              statusCode: 400,
              success: false,
            });
          }
        }
      } else {
        if (!req.body.id) {
          return res.status(400).json({
            message: "social_media_image is mandatory",
            statusCode: 400,
            success: false,
          });
        }
      }
      FooterServicesObj.add(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async get_data(req, res) {
    try {
      FooterServicesObj.getAllData(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async editCategoryStatus(req, res) {
    try {
      let { error } = CategoryStatusChangeSchema.validate(req?.body, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }
      if (req.files && req.files?.image?.length) {
        let data = req.files?.image;
        for (let el of data) {
          let name = el?.filename;
          let size = el?.size;
          let get = await ImageFileCheck(name, "filter_product", size);
          if (get == "invalid file") {
            try {removefIle(name,'filter_product')} catch (er) {console.log(er,"eoror in remove image")  }
          
            return res.status(400).json({
              message: "Gender image must be PNG or JPEG or WEBP file",
              statusCode: 400,
              success: false,
            });
          }
        }
      }
      CategoryServicesObj.changeCategoryStatus(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async delete_category_by_id(req, res) {
    try {
      let { error } = CategoryDeletedSchema.validate(req?.query, options);
      if (error) {
        return res
          .status(400)
          .json({ message: error.details[0]?.message, success: false });
      }
      CategoryServicesObj.deleteCategoryById(req, res);
    } catch (err) {
      console.error(err);
      return res

        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

}

const FooterControllerObj = new FooterController();
export default FooterControllerObj;
