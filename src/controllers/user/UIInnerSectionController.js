import { ReviewRatingchema } from "../../helpers/validateProductReview.js";
import { uiInnerSectionSchema } from "../../helpers/validateUiInnerSections.js";
import { uiSectionSchema } from "../../helpers/validateUiSections.js";
import UIInnerSectionServices from "../../services/user/UIInnerSectionServices.js";
const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};
class UIInnerSectionController {
  async get_data(req, res) {
    try{
      let { error } = uiInnerSectionSchema.validate(req?.query, options);
      if (error) {
        return res
          .status(400)
          .json({ message: error.details[0]?.message, success: false });
      }
      if (!req.query.category_id) {
        return res.status(400).json({
        message: "Category id not found",
        success: false,
        statusCode: 400,
      });
    } else if (!req.query.sub_category_id) {
      return res.status(400).json({
        message: "Sub category id not found",
        success: false,
        statusCode: 400,
      });
    }
    UIInnerSectionServices.getData(req, res);
  }catch(err){
    return res.status(500).json({message:err?.message,statusCode:500,success:false})
  }
  }
}
const UIInnerSectionControllerObj = new UIInnerSectionController();
export default UIInnerSectionControllerObj;
