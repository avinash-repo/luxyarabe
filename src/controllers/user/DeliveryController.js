import DeliveryServicesObj from "../../services/user/DeliveryServices.js";

class DeliveryController {
  async getData(req, res) {
    try {
      DeliveryServicesObj.getAllData(req, res);
    } catch (error) {
      console.error(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }
  async getNormalDelivery(req, res) {
    try {
      if(!req.query.country_code){
        return res.status(400).json({message:"country_code is mandatory",statusCode:400,success:false})
      }
      DeliveryServicesObj.getNormalDeliveryData(req, res);
    } catch (error) {
      console.error(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }

  async getDataById(req, res) {
    try {
      DeliveryServicesObj.getById(req, res);
    } catch (error) {
      console.error(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }
}

const DeliveryControllerObj = new DeliveryController();
export default DeliveryControllerObj;
