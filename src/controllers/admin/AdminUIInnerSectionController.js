import {
  ImageFileCheck,
  ImageFileCheckForUI,
  removefIle,
} from "../../helpers/validateImageFile.js";
import { uiSectionSchema } from "../../helpers/validateUiInnerSections.js";
import UISectionServicesObj from "../../services/admin/UIInnerSectionServices.js";
const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

class AdminUIInnerSectionController {
  async addUIInnerSections(req, res) {
    try {
      const {
        heading,
        description,
        category_id,
        sub_category_id,
        status,
        remarks,
        color,
      } = req.body;

      let bodyObj = {
        slug: heading
          ?.trim()
          ?.toLowerCase()
          ?.replace(/\s+/g, "-"),
        heading,
        description,
        category_id,
        sub_category_id,
        color,
        status: status,
        image: req?.file?.filename,
        remarks: remarks,
      };
      let { error } = uiSectionSchema.validate(bodyObj, options);
      if (req.file && req?.file?.filename) {
        bodyObj.imageData = req?.file;
        let name = req.file.filename;
        let size = req.file.size;
        let get = await ImageFileCheckForUI(name, res, size);
        if (get == "invalid file") {
          try {removefIle(name,'ui')} catch (er) {console.log(er,"eoror in remove image")  }
           
          return res.status(400).json({
            message:
              "Image must be png or jpeg file and size must be less than 500 kb",
            statusCode: 400,
            success: false,
          });
        }
      }
      if (error) {
        console.log(error, "erororrorro");
        return res
          .status(400)
          .json({ message: error.details[0]?.message, success: false });
      }
      UISectionServicesObj.addUIInnerSections(bodyObj, res);
    } catch (err) {
      console.log(err, "2222Err");
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  async getAllData(req, res) {
    try {
      UISectionServicesObj.getData(req, res);
    } catch (err) {
      console.error(err)
      return res
        .status(200)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  async updateFrameConfig(req, res) {
    const { heading, description } = req.body;
    if (heading == null || heading == undefined || heading == "") {
      return res
        .status(400)
        .json({ success: false, message: "Heading is required" });
    }

    UISectionServicesObj.updateUIFrameConfig(req, res);
  }
  async getFrameConfig(req, res) {
    UISectionServicesObj.getFrameConfig(req, res);
  }
}
const AdminUIInnerSectionControllerObj = new AdminUIInnerSectionController();
export default AdminUIInnerSectionControllerObj;
