import FrameSizeConfig from "../../models/FrameSizesConfigModel.js";

class FrameDataServices {
  async updateUIFrameConfig(req, res) {
    try {
      const data = await FrameSizeConfig.findOne({
        where: { heading: req.body.heading },
      });
      if (data) {
        let obj = {
          heading: req.body.heading || data?.heading,
          description: req.body.description || data?.description,
          updated_at: new Date(),
        };
        FrameSizeConfig.update(obj, { where: { heading: req.body.heading } })
          .then((result) => {
            return res
              .status(201)
              .json({ success: true, message: "values updated" });
          })
          .catch((error) => {
            return res
              .status(500)
              .json({ success: false, message: error?.message });
          });
         
      } else {
        FrameSizeConfig.create({
          heading: req.body.heading,
          description: req.body.description,
        })
        .then((newRecord) => {
          return res
          .status(201)
          .json({ success: true, message: "values created" });
        })
        .catch((error1) => {
          return res
          .status(500)
          .json({ success: false, message: error1?.message });
        });
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message });
    }
  }
  async getFrameConfig(req, res) {
    try {
      
      const data = await FrameSizeConfig.findAll();
      return res
        .status(200)
        .json({
          success: true,
          message: "Data fetched successfully",
          data: data,
        });
    } catch (error) {
      return res.status(500).json({ success: false, message: error?.message });
    }
  }
}
const FrameDataServicesObj = new FrameDataServices();
export default FrameDataServicesObj;
