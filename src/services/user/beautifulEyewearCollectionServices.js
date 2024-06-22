import BeautifulEyewearCollection from "../../models/BeautifulEyewearCollection.js";

class BeautifulEyewearCollectionServices {
  async getBeautifulEyewear(req, res) {
    try {
      const data = await BeautifulEyewearCollection.findAll({});


      return res
        .status(200)
        .json({ success: true, message: "Data fetched", data: data });
    } catch (err) {
      console.error(err, "eorororor beatuiful");
      return res.status(500).json({ success: false, message: err?.message });
    }
  }
}
const beautifulEyewearCollectionServicesObj =
  new BeautifulEyewearCollectionServices();

export default beautifulEyewearCollectionServicesObj;
