import express from "express";
import LogisticOrderTrack from "../../models/LogisticOrderTrack.js";
import LogisticPartnerModel from "../../models/LogisticPartnersModel.js";
import dbConnection from "../../config/dbConfig.js";
const logisticRouter = express.Router();
logisticRouter.post("/update/track/", async (req, res) => {
  try {
    const {
      awb_number,
      latest_scan_time,
      live_status,
      status,
      remark,
      location,
      edd_date,
    } = req.body;
    const trackData = new LogisticOrderTrack({
      awb_number,
      latest_scan_time,
      live_status,
      status,
      remark,
      location,
      edd_date,
    });
    trackData
      .save()
      .then((response) => {
        return res
          .status(201)
          .json({ success: true, message: "Order track data updated" });
      })
      .catch((error) => {
        return res
          .status(500)
          .json({ success: false, message: error?.message });
      });
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message });
  }
});
logisticRouter.get("/get/logisticPartners", async (req, res) => {
  try {
    const logisticPartners = await LogisticPartnerModel.findAll({});
    if (logisticPartners) {
      return res.status(200).json({ success: true, data: logisticPartners });
    } else {
      return res
        .status(200)
        .json({ success: false, message: "Data not found" });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message });
  }
});
logisticRouter.post("/update/logisticPartners/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await dbConnection.transaction();
    try {
      await LogisticPartnerModel.update(
        { status: false },
        { where: {}, transaction }
      );
      await LogisticPartnerModel.update(
        { status: true },
        { where: { id }, transaction }
      );
      await transaction.commit();
      return res.status(200).json({ success: true, message: "Status changed" });
    } catch (err) {
      console.log(err);
      await transaction.rollback();
      return res.status(500).json({ success: false, message: err?.message });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message });
  }
});
export default logisticRouter;
