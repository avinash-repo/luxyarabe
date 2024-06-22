import OfferDataModel from "../../models/OfferDataModel.js";

class UserOfferDataServices {
  // for user
  async getDataForUser(req, res) {
    try {
      const getAll = await OfferDataModel.findAll({
        where: { status: "active" },
        raw: true,
      });
      return res.status(200).json({
        message: "Fetch data",
        data: getAll,
        success: true,
        statusCode: 200,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
}

const UserOfferDataServicesObj = new UserOfferDataServices();
export default UserOfferDataServicesObj;
