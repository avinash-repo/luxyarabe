import beautifulEyewearCollectionServicesObj from "../../services/user/beautifulEyewearCollectionServices.js";

class BeautifulEyewearCollection {
  async getBeautifulEyewearCollection(req, res) {
    beautifulEyewearCollectionServicesObj.getBeautifulEyewear(req, res);
  }
}
const beautifulEyewearCollectionObj = new BeautifulEyewearCollection();
export default beautifulEyewearCollectionObj;
