
import { uiSectionSchema } from "../../helpers/validateUiInnerSections.js";
import FrameDataServicesObj from "../../services/admin/FrameDataServices.js";
const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

class FramDataController {

  async updateFrameConfig(req, res) {
    try{

      const { heading, description } = req.body;
      if (heading == null || heading == undefined || heading == "") {
        return res
        .status(400)
        .json({ success: false, message: "Heading is required" });
      }
      
      FrameDataServicesObj.updateUIFrameConfig(req, res);
    }catch(err){
      return res.status(500).json({message:err?.message,statusCode:500,success:false})
    }
  }
  async getFrameConfig(req,res){
    FrameDataServicesObj.getFrameConfig(req,res)
  }
}
const FrameDataControllerObj = new FramDataController();
export default FrameDataControllerObj;
