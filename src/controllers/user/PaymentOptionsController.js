import paymentOptionsServices from "../../services/user/PaymentOptionsServices.js";

class PaymentOptionsController {
  async getPaymentMethods(req, res) {
    paymentOptionsServices.getPaymentMethods(req, res);
  }
}
const paymentOptionsControllerObj = new PaymentOptionsController();
export default paymentOptionsControllerObj;
