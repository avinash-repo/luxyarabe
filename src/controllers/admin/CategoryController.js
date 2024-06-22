import {
  CategoryDeletedSchema,
  CategoryEditSchema,
  CategorySchema,
  CategoryStatusChangeSchema,
  onlyCategorySchema,
  onlyGenderSchema,
} from "../../helpers/validateCategory.js";
import { ImageFileCheck, removefIle } from "../../helpers/validateImageFile.js";
import CategoryServicesObj from "../../services/admin/CategoryServices.js";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

class CategoryController {
  async addCategory(req, res) {
    try {
      // console.log(req.body, "req.bodyyyyyyyyyyyyyyyyy");
      let { error } = CategorySchema.validate(req?.body, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }
      // console.log(req.files, "req.filesllssl");
      // return
      if (req.files?.shape_image) {
        let data = req.files?.shape_image;
        for (let el of data) {
          let name = el?.filename;
          let size = el?.size;
          let get = await ImageFileCheck(name, "category", size);
          if (get == "invalid file") {
            try {removefIle(name,'category')} catch (er) {console.log(er,"eoror in remove image")  }
            return res.status(400).json({
              message:
                "Image must be PNG or JPEG or WEBP file and size must be less than 500 kb",
              statusCode: 400,
              success: false,
            });
          }
        }
      }
      CategoryServicesObj.addCateogry(req, res);
    } catch (err) {
      console.error(err);
      // console.log(err,"EEEEEEEEEEEEE")
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async addOnlyCateogry(req, res) {
    try {
      if (
        (req.body && req.body.id == "undefined") ||
        req.body.id == "" ||
        !req.body.id
      ) {
        let { error } = onlyCategorySchema.validate(req?.body, options);
        if (error) {
          return res.status(400).json({
            message: error.details[0]?.message,
            success: false,
            statusCode: 400,
          });
        }
      }
      // console.log(req.files, "ddddddddddddddddddd", req.body);
      if (
        (req.body && req.body.id == "undefined") ||
        req.body.id == "" ||
        !req.body.id
      ) {
        if (!req.files || Object.keys(req.files).length === 0) {
          return res.status(400).json({
            message: "Image is mandatory",
            statusCode: 400,
            success: false,
          });
        } else {
          let data = req.files?.image;
          for (let el of data) {
            let name = el?.filename;
            let size = el?.size;
            let get = await ImageFileCheck(name, "category", size);
            if (get == "invalid file") {
              try {removefIle(name,'category')} catch (er) {console.log(er,"eoror in remove image")  }
              return res.status(400).json({
                message:
                  "Image must be PNG or JPEG or WEBP file and size must be less than 500 kb",
                statusCode: 400,
                success: false,
              });
            }
          }
        }
      }
      CategoryServicesObj.addOnlyCateogryData(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async addOnlyGender(req, res) {
    try {
      if (
        (req.body && req.body.id == "undefined") ||
        req.body.id == "" ||
        !req.body.id
      ) {
        let { error } = onlyGenderSchema.validate(req?.body, options);
        if (error) {
          return res.status(400).json({
            message: error.details[0]?.message,
            success: false,
            statusCode: 400,
          });
        }
      }
      // console.log(req.files, "dgenderdddddd", req.body);
      if (
        (req.body && req.body.id == "undefined") ||
        req.body.id == "" ||
        !req.body.id
      ) {
        if (!req.files || Object.keys(req.files).length === 0) {
          return res.status(400).json({
            message: "Image is mandatory",
            statusCode: 400,
            success: false,
          });
        } else {
          let data = req.files?.image;
          for (let el of data) {
            let name = el?.filename;
            let size = el?.size;
            let get = await ImageFileCheck(name, "gender", size);
            if (get == "invalid file") {
              try {removefIle(name,'gender')} catch (er) {console.log(er,"eoror in remove image")  }
              return res.status(400).json({
                message: "Gender image must be PNG or JPEG or WEBP file",
                statusCode: 400,
                success: false,
              });
            }
          }
        }
      }

      CategoryServicesObj.addOnlyGenderData(req, res);
    } catch (err) {
      console.error(err);
      // console.log(err,"EEEEEEEEEEEEE")
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async get_category(req, res) {
    try {
      CategoryServicesObj.getAllCategoryData(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async editCategoryStatus(req, res) {
    try {
      // console.log(req.body, "Reqqqqqqqqqqqqqqqq22222222");
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
      // console.log("req.files", "REqqsdfsfsdsdsdsdsdsd");

      CategoryServicesObj.changeCategoryStatus(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async get_category_for_admin(req, res) {
    try {
      CategoryServicesObj.getAllCategoryDataForAdmin(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  // async edit_category(req, res) {
  //   try {
  //     let { error } = CategoryEditSchema.validate(req?.body, options);
  //     if (error) {
  //       return res
  //         .status(400)
  //         .json({ message: error.details[0]?.message, success: false });
  //     }
  //     if (req.files && req.files?.category_image?.length) {
  //       let name = req.files?.category_image[0]?.filename;
  //       let get = await ImageFileCheck(name, res);
  //       if (get == "invalid file") {
  //         return res.status(400).json({
  //           message: "Category image must be png or jpeg file",
  //           statusCode: 400,
  //           success: false,
  //         });
  //       }
  //     }
  //     CategoryServicesObj.editCategory(req, res);
  //   } catch (err) {
  //     return res
  //       .status(500)
  //       .json({ message: err?.message, statusCode: 500, success: false });
  //   }
  // }

  //working

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

const CategoryControllerObj = new CategoryController();
export default CategoryControllerObj;
