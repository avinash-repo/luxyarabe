import { Op } from "sequelize";
import CouponModel from "../../models/couponModel.js";

class AddCoupon {
  async addCoupon(req, res) {
    try {
      let name = req?.body?.name?.trim();
      let code = req?.body?.code?.trim();
      let type = req?.body?.type?.trim();
      let value = req?.body?.value?.trim();
      let start_date = req?.body?.start_date?.trim();
      let expired_date = req?.body?.expired_date?.trim();
      let min_purchase = req?.body?.min_purchase?.trim();
      let max_purchase = req?.body?.max_purchase?.trim();
      let max_uses_per_user = req?.body?.max_uses_per_user;
      let new_user = req?.body?.new_user;
      let limit = req?.body?.limit?.trim();
      let user_id = req.id || 0;
      let category_id = req?.body?.category_id?.trim();
      let status = req.body.status;
      // let product_id = req?.body?.product_id?.trim();
      let country = req?.body?.country?.trim();
      // let variant_id = req?.body?.variant_id?.trim();
      let get_product = req.body?.get_product;
      let buy_product = req.body?.buy_product;
      if (get_product && get_product < 0) {
        return res.status(400).json({
          message: "Get_product value is must be greator than 0",
          statusCode: 400,
          success: false,
        });
      } else if (buy_product && buy_product < 0) {
        return res.status(400).json({
          message: "Buy_product value is must be greator than 0",
          statusCode: 400,
          success: false,
        });
      }

      let couponExist = await CouponModel.findOne({ where: { code } });
      if (couponExist) {
        return res.status(409).json({
          message: "Coupon Already Exist",
          success: true,
          statusCode: 409,
        });
      } else {
        let obj = {
          name,
          code,
          type,
          value,
          start_date,
          expired_date,
          min_purchase,
          max_purchase,
          limit,
          user_id,
          category_id,
          // product_id,
          country,
          // variant_id,
          max_uses_per_user,
          new_user,
          get_product,
          buy_product,
          status,
        };
        // console.log(obj, "asdaas");

        await CouponModel.create(obj);
        return res.status(201).json({
          message: "Coupon created successfully",
          success: true,
          statusCode: 201,
        });
      }
    } catch (err) {
      console.log(err, "erro in couopon addd");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
  async updateCoupon(req, res) {
    try {
      let name = req?.body?.name?.trim();
      let code = req?.body?.code?.trim();
      let id = req.body.id;
      let type = req?.body?.type?.trim();
      let value = req?.body?.value?.trim();
      let user_id = req.id || 0;
      let category_id = req?.body?.category_id;
      let product_id = req?.body?.product_id?.trim();
      let variant_id = req?.body?.variant_id?.trim();
      let start_date = req?.body?.start_date?.trim();
      let expired_date = req?.body?.expired_date?.trim();
      let min_purchase = req?.body?.min_purchase?.trim();
      let max_purchase = req?.body?.max_purchase?.trim();
      let country = req?.body?.country?.trim();
      let limit = req?.body?.limit?.trim();
      let max_uses_per_user = req?.body?.max_uses_per_user;
      let new_user = req?.body?.new_user;
      let get_product = req.body?.get_product;
      let buy_product = req.body?.buy_product;
      let status = req.body.status;
      if (!id) {
        return res.status(400).json({
          message: "id is mandatory",
          statusCode: 400,
          success: false,
        });
      }
      let couponExist = await CouponModel.findOne({ where: { id }, raw: true });
      if (couponExist) {
        let codeExist = await CouponModel.findOne({
          where: {
            code: code,
            id: { [Op.ne]: id }, // Exclude the ID from the search
          },
          raw: true,
        });
        if (codeExist && codeExist?.id) {
          return res
            .status(400)
            .json({
              message: "Coupon-code must be unique",
              statusCode: 400,
              success: false,
            });
        }
        let obj = {
          name: name || couponExist.name,
          type: type || couponExist.type,
          code: code || couponExist.code,
          value: value || couponExist.value,
          start_date: start_date || couponExist.start_date,
          expired_date: expired_date || couponExist.expired_date,
          min_purchase: min_purchase || couponExist.min_purchase,
          max_purchase: max_purchase || couponExist.max_purchase,
          limit: limit || couponExist.limit,
          user_id: user_id || couponExist.user_id,
          category_id: category_id || couponExist.category_id,
          product_id: product_id || couponExist.product_id,
          country: country || couponExist.country,
          variant_id: variant_id || couponExist.variant_id,
          get_product: get_product || couponExist?.get_product,
          buy_product: buy_product || couponExist?.buy_product,
          status: status || couponExist?.status,
          new_user: new_user || couponExist?.new_user,
          max_uses_per_user:
            max_uses_per_user || couponExist?.max_uses_per_user,
        };
        await CouponModel.update(obj, {
          where: { id },
        });
        return res.status(200).json({
          message: "Coupon Updated Successfully",
          success: true,
          statusCode: 200,
        });
      } else {
        return res.status(404).json({
          message: "Coupon not found",
          success: true,
          statusCode: 404,
        });
      }
    } catch (err) {
      console.log(err, "erorororroo");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async getAllCoupons(req, res) {
    try {
      let getAllCoupons = [];
      const page = parseInt(req.query.page) || 1; // default page is 1
      const limit = parseInt(req.query.limit) || 200; // default limit is 10
      const offset = (page - 1) * limit;
      let getCouponsCount ;
      if (req.userData.role != "super_admin") {
        getAllCoupons = await CouponModel.findAll({
          where: { country: req.userData.country },
          raw: true,
          limit,
          offset,
        });
        getCouponsCount = await CouponModel.count({
          where: { country: req.userData.country },
        });
      } else {
        getAllCoupons = await CouponModel.findAll({ raw: true, limit, offset });
        getCouponsCount  = await CouponModel.count({  });
      }
      getAllCoupons = getAllCoupons?.sort(
        (x, y) => y?.created_at - x.created_at
      ); //2024-03-16 17:42:55
      if (getAllCoupons) {
        return res.status(200).json({
          message: "Fetch Coupons data",
          data: getAllCoupons,
          paginatedData:{getCouponsCount,limit
            ,offset,page},
          success: true,
          statusCode: 200,
        });
      } else {
        return res.status(404).json({
          message: "Data not found",
          success: false,
          paginatedData:{getCouponsCount,limit
            ,offset,page},
          statusCode: 404,
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
  async getCouponById(req, res) {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({
          message: " Coupon Id is required",
          statusCode: 400,
          success: false,
        });
      }
      const getCoupon = await CouponModel.findByPk(id);

      if (getCoupon) {
        return res.status(200).json({
          message: "Fetch Coupons data",
          data: getCoupon,
          success: true,
          statusCode: 200,
        });
      } else {
        return res.status(404).json({
          message: "Data not found",
          success: false,
          statusCode: 404,
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
  async deleteCouponById(req, res) {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({
          message: " Coupon Id is required",
          statusCode: 400,
          success: false,
        });
      }
      const getCoupon = await CouponModel.findByPk(id);

      if (getCoupon) {
        await CouponModel.destroy({
          where: {
            id,
          },
        });

        return res.status(200).json({
          success: true,
          message: "Coupon Deleted successfully",
          statusCode: 200,
        });
      } else {
        return res.status(404).json({
          message: "Data not found",
          success: false,
          statusCode: 404,
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async updateStatus(req, res) {
    try {
      let { status, id } = req.body;
      let findExist = await CouponModel.findOne({ where: { id }, raw: true });
      if (!findExist) {
        return res.status(400).json({
          message: "Coupon data not found",
          statusCode: 400,
          success: false,
        });
      } else {
        if (
          findExist &&
          findExist?.type == "buy_get" &&
          findExist?.category_id == null
        ) {
          // console.log(findExist, "asd");
          let tempStatus = status;
          if (status == "active") {
            tempStatus = "inactive";
          } else {
            tempStatus = "active";
          }
          await CouponModel.update(
            { status: tempStatus },
            { where: { type: "buy_get", category_id: { [Op.not]: null } } }
          );
        } else if (
          findExist &&
          findExist?.type == "buy_get" &&
          findExist?.category_id != null
        ) {
          let tempStatus = status;
          if (status == "active") {
            tempStatus = "inactive";
          } else {
            tempStatus = "active";
          }
          // console.log("nulllll", findExist);
          await CouponModel.update(
            { status: tempStatus },
            { where: { type: "buy_get", category_id: null } }
          );
        } else {
        }
        await CouponModel.update({ status }, { where: { id } });
        return res.status(200).json({
          message: "Coupon status update successfully",
          statusCode: 200,
          success: true,
        });
      }
    } catch (err) {
      console.log(err, "eroror in coupon status");
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async changestatusBuyGetCoupon(req, res) {
    try {
      let id = req.body.id;
      let fetchObj = await CouponModel.findOne({ where: { id }, raw: true });
      if (!fetchObj) {
        return res.status(400).json({
          message: "Coupon data not found",
          statusCode: 400,
          success: false,
        });
      }

      return res.status(200).json({
        message: "Coupon status change successfully",
        statusCode: 200,
        success: true,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
}

const AddCouponServicesObj = new AddCoupon();
export default AddCouponServicesObj;
