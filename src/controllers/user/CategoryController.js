import {
  CategoryEditSchema,
  CategorySchema,
} from "../../helpers/validateCategory.js";
import { ImageFileCheck } from "../../helpers/validateImageFile.js";
import CategoryServicesObj from "../../services/user/CategoryServices.js";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

class CategoryController {
  // async addCategory(req, res) {
  //   try {
  //     let { error } = CategorySchema.validate(req?.body, options);
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
  //     CategoryServicesObj.addCateogry(req, res);
  //   } catch (err) {
  //     return res
  //       .status(500)
  //       .json({ message: err?.message, success: false, statusCode: 500 });
  //   }
  // }

  async get_category(req, res) {
    try {
      CategoryServicesObj.getAllCategoryData(req, res);
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
  async getCategoryById(req, res) {
    try {
      CategoryServicesObj.getCategoryById(req, res);
    } catch (err) {
      console.error(err)
      return res.status(500).json({ success: false, message: err?.message });
    }
  }
  // async get_category_for_admin(req, res) {
  //   try {
  //     CategoryServicesObj.getAllCategoryDataForAdmin(req, res);
  //   } catch (err) {
  //     return res
  //       .status(500)
  //       .json({ message: err?.message, success: false, statusCode: 500 });
  //   }
  // }

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
  // async delete_category_by_id(req, res) {
  //   try {
  //     CategoryServicesObj.deleteCategoryById(req, res);
  //   } catch (err) {
  //     return res
  //       .status(500)
  //       .json({ message: err?.message, statusCode: 500, success: false });
  //   }
  // }
}

const CategoryControllerObj = new CategoryController();
export default CategoryControllerObj;
