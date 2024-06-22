import { ChangeStatusSchema, SeoSchema } from "../../helpers/validateSeo.js";
import SeoServicesObj from "../../services/admin/SeoServices.js";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

class SeoController {
  async add(req, res) {
    try {
      if (!req.body.id) {
        let { error } = SeoSchema.validate(req?.body, options);
        if (error) {
          return res.status(400).json({
            message: error.details[0]?.message,
            success: false,
            statusCode: 400,
          });
        }
      }

      SeoServicesObj?.addData(req, res);
    } catch (error) {
      console.error(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }
  async get(req, res) {
    try {
      SeoServicesObj?.getData(req, res);
    } catch (error) {
      console.error(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }

  async change_status(req, res) {
    try {
      let { error } = ChangeStatusSchema.validate(req?.body, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }
      SeoServicesObj?.changeStatus(req, res);
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async seo_get_by_id(req, res) {
    try {
      if (!req.query.id) {
        return res
          .status(400)
          .json({
            message: "Id is required.",
            statusCode: 400,
            success: false,
          });
      }
      SeoServicesObj?.get_by_id_data(req, res);
    } catch (err) {
      console.error(err)
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
}

const SeoControllerObj = new SeoController();
export default SeoControllerObj;
