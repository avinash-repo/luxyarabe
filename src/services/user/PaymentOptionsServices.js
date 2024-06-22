import PaymentOptionsModel from "../../models/PaymentOptionsModel.js";
class PaymentOptionsServices {
  async getPaymentMethods(req, res) {
    try {
      const country = req.params.country;
      const paymentOptions = await PaymentOptionsModel.findAll({
        where: { country: country },
        raw: true,
        attributes: ["payment_options"],
      });
      // console.log(paymentOptions);
      return res
        .status(200)
        .json({ success: true, message: "Data fetched", data: paymentOptions });
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message });
    }
  }
}
const paymentOptionsServices = new PaymentOptionsServices();
export default paymentOptionsServices;
