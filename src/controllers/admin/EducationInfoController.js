import {
  addEducationInfochema,
  changeApproveStatusEducationInfochema,
  changeStatusEducationInfochema,
} from "../../helpers/validateEducationInfo.js";

import AdminEducationServiceObj from "../../services/admin/EducationInfoService.js";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

class AdminEducationInfoController {
  async get(req, res) {
    try {
      AdminEducationServiceObj.getData(req, res);
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  async change_status(req, res) {
    try {
      let { error } = changeApproveStatusEducationInfochema.validate(
        req?.body,
        options
      );
      if (error) {
        return res
          .status(400)
          .json({ message: error.details[0]?.message, success: false });
      }
      AdminEducationServiceObj.changeStatus(req, res);
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
}

const AdminEducationInfoControllerObj = new AdminEducationInfoController();
export default AdminEducationInfoControllerObj;
