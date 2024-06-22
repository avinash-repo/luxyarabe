import {
  addCouponSchema,
  updateCouponSchema,
} from "../../helpers/validateCoupon.js";
import AddCouponServicesObj from "../../services/admin/CouponServices.js";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

class Coupon {
  async addCoupon(req, res) {
    try {
      let { error } = addCouponSchema.validate(req?.body, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }

      AddCouponServicesObj.addCoupon(req, res);
    } catch (error) {
      console.error(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }
  async updateCoupon(req, res) {
    try {
      let { error } = updateCouponSchema.validate(req?.body, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }

      AddCouponServicesObj.updateCoupon(req, res);
    } catch (error) {
      console.error(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }

  async getAllCoupons(req, res) {
    try {
      AddCouponServicesObj.getAllCoupons(req, res);
    } catch (error) {
      console.error(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }

  async getCouponById(req, res) {
    try {
      AddCouponServicesObj.getCouponById(req, res);
    } catch (error) {
      console.error(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }

  async deleteCouponById(req, res) {
    try {
      AddCouponServicesObj.deleteCouponById(req, res);
    } catch (error) {
      console.error(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }

  async updateStatusById(req, res) {
    try {
      if (!req.body.id) {
        return res.status(400).json({
          message: "id is mandatory",
          statusCode: 400,
          success: false,
        });
      } else if (!req.body.status) {
        return res.status(400).json({
          message: "status is mandatory",
          statusCode: 400,
          success: false,
        });
      } else if (req.body.status != "active" && req.body.status != "inactive") {
        return res.status(400).json({
          message: "status must be active or inactive",
          statusCode: 400,
          success: false,
        });
      }

      AddCouponServicesObj.updateStatus(req, res);
    } catch (error) {
      console.error(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }
}

const CouponObj = new Coupon();
export default CouponObj;
