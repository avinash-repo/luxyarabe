import {
  getLandingPageSchema,
  getuiSectionSchema,
  uiSectionSchema,
} from "../../helpers/validateUiSections.js";
import UISectionServicesObj from "../../services/user/UISectionServices.js";
const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};
class UISectionController {
  async getLandingPageData(req, res) {
    UISectionServicesObj.getLandingPageData(res);
  }
  async getSectionInfoByCategory(req, res) {
    // console.log(req.params,"WWWWWWWWWW")
    // return
    let { error } = getuiSectionSchema.validate(req?.params, options);
    if (error) {
      return res
        .status(400)
        .json({ message: error.details[0]?.message, success: false });
    }
    UISectionServicesObj.getSectionInfoByCategory(req, res);
  }
  // async addUISections(req, res) {
  //   const {
  //     // module_name,
  //     slug,
  //     module_heading,
  //     title,
  //     position,
  //     module_description,
  //     status,
  //     remarks,
  //   } = req.body;
  //   let bodyObj = {
  //     // module_name: module_name,
  //     slug: slug,
  //     module_heading: module_heading,
  //     title: title,
  //     position,
  //     module_description: module_description,
  //     status: status,
  //     image: req.file.filename,
  //     remarks: remarks,
  //   };
  //   let { error } = uiSectionSchema.validate(bodyObj, options);

  //   if (error) {
  //     return res
  //       .status(400)
  //       .json({ message: error.details[0]?.message, success: false });
  //   }
  //   UISectionServicesObj.addUISections(bodyObj, res);
  // }
  async getLandingPageSectionCards(req, res) {
    const { id } = req.params;
    let { error } = getLandingPageSchema.validate(req?.params, options);
    if (error) {
      return res
        .status(400)
        .json({ message: error.details[0]?.message, success: false });
    }

    UISectionServicesObj.getLandingPageSections(id, res);
  }
}
const UISectionControllerObj = new UISectionController();
export default UISectionControllerObj;
