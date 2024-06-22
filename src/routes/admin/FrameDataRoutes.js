import express from "express";
import FrameControllerObj from "../../controllers/admin/FrameDataController.js";
import { uploaduiimage } from "../../helpers/multerForUi.js";
const FrameDataRoutes = express.Router();

FrameDataRoutes.post('/add_ui_frame_config',FrameControllerObj.updateFrameConfig)
FrameDataRoutes.get("/get_ui_frame_config",FrameControllerObj.getFrameConfig)
export default FrameDataRoutes;
