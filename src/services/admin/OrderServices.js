import OrderModel from "../../models/OrderModel.js";
import axios from "axios";
import CouponModel from "../../models/couponModel.js";
import UserAddressModel from "../../models/UserAddressModel.js";

import ProductVariantModel from "../../models/ProductVariantModel.js";
import ProductMaterialModel from "../../models/ProductMaterialModel.js";
import ProductDescriptionModel from "../../models/ProductDescriptionModel.js";
import { Op, fn, col, Sequelize } from "sequelize";
import CartModel from "../../models/CartModel.js";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import ProductModel from "../../models/ProductModel.js";
import filterProduct from "../../models/filterDataModel.js";
import { downloadInvoice } from "../../helpers/downloadInvoice.js";
import {
  changeDeliveryDate,
  changeOrderStatus,
  sendCouponViaEmail,
} from "../../helpers/common.js";
import UserModel from "../../models/UserModel.js";
import dbConnection from "../../config/dbConfig.js";
import UserEducationInfoModel from "../../models/UserEducationInfo.js";
import OrderDeliveryDayModel from "../../models/OrderDeliveryDayModel.js";
import moment from "moment";
import OnlinePaymentDiscountModel from "../../models/OnlinePaymentDiscountModel.js";
import ProductAvailability from "../../models/ProductAvailability.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class OrderServices {
  async update_delivery_date_data(req, res) {
    //check payment is successfully
    try {
      let {
        order_id,
        order_date,
        delivery_date,
        shipping_date,
        out_for_delivery_date,
      } = req.body;
      let obj = {
        //order_date,
        delivery_date,
        shipping_date,
        out_for_delivery_date,
      };
      let findOrder = await OrderModel.findOne({
        where: { order_id: order_id },
        raw: true,
      });
      if (!order_id) {
        return res.status(400).json({
          message: "Order not found",
          success: false,
          statusCode: 400,
        });
      }

      if (
        (findOrder && findOrder?.status == "new") ||
        (findOrder && findOrder?.status == "processing") ||
        (findOrder && findOrder?.status == "outfordelivery")
      ) {
        await OrderModel.update(obj, {
          where: { order_id: findOrder?.order_id },
        });
        let getUSerEmail = await UserModel.findOne({
          where: { id: findOrder?.user_id },
          attributes: ["email", "name"],
          raw: true,
        });
        obj.emailData = getUSerEmail;
        res.status(200).json({
          message: "Order delivery date changed successfully",
          success: true,
          statusCode: 200,
        });
        await changeDeliveryDate(obj);
        return;
      } else if (findOrder && findOrder?.status == "delivered") {
        return res.status(400).json({
          message: "This order delivered already",
          statusCode: 400,
          success: false,
        });
      } else if (findOrder && findOrder?.status == "cancelled") {
        return res.status(400).json({
          message: "This order has been cancelled",
          statusCode: 400,
          success: false,
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async update_Order_status_data(req, res) {
    try {
      let { order_id, status } = req.body;

      console.log("status", status);
      let findOrder = await OrderModel.findOne({
        where: { order_id: order_id },
        raw: true,
      });
      let obj = { order_id, status };
      if (!order_id) {
        return res.status(400).json({
          message: "Order not found",
          success: false,
          statusCode: 400,
        });
      }
      let couponObj = {};
      if (findOrder?.coupon_id) {
        couponObj = await CouponModel.findOne({
          where: { id: findOrder?.coupon_id },
          raw: true,
        });
      }
      let productIdArr = [];
      let variantIdArr = [];
      for (let el of findOrder?.variant_quantity) {
        productIdArr.push(el?.product_id);
        variantIdArr.push(el?.variant_id);
      }

      const productData = await ProductModel.findAll({
        where: {
          id: {
            [Op.in]: productIdArr,
          },
        },
        attributes: [
          "id",
          "title",
          "cat_id",
          "thumbnail_img",
          "material_id",
          "shape_id",
        ],
        raw: true,
      });
      let variantData = await ProductVariantModel.findAll({
        where: {
          variant_id: {
            [Op.in]: variantIdArr,
          },
        },
        attributes: [
          "code",
          "variant_price_details",
          "thumbnail_url",
          "color_id",
          "variant_id",
          "product_id",
        ],
        raw: true,
      });

      let fetchFilter = await filterProduct.findOne({ raw: true });
      let categoryArr = fetchFilter?.categories;
      let genderArr = fetchFilter?.gender;
      let shapeArr = fetchFilter?.shape;
      let colorArr = fetchFilter?.color;
      let materialArr = fetchFilter?.material;
      let sizeArr = fetchFilter?.size;
      let weight_group_arr = fetchFilter?.weight_group;
      let priceArr = fetchFilter?.price_range;
      for (let el of variantData) {
        el.variant_price_details = el.variant_price_details?.filter(
          (variant) => variant?.country_code == findOrder?.country_code
        );
        el.color_name = colorArr?.find(
          (ele) => ele?.id === el?.color_id
        )?.value;
        // el.material_name = materialArr?.find(
        //   (ele) => ele?.id == el?.material_id
        // )?.value;
        // el.size_name = sizeArr?.find((ele) => ele?.id == el?.size_id)?.value;
      }

      for (let le of productData) {
        le.cat_name = categoryArr?.find((el) => el?.id == le?.cat_id)?.value;
        le.material_name = materialArr?.find(
          (el) => el?.id == le?.material_id
        )?.value;
        le.shape_name = shapeArr?.find((el) => el?.id == le?.shape_id)?.value;
      }
      for (let el of findOrder?.variant_quantity) {
        el.findProductObj = productData?.find(
          (lem) => lem?.id == el?.product_id
        );
        el.variantObj = variantData?.find(
          (lem) => lem?.variant_id == el.variant_id
        );
      }
      let fetchTaxData = await ProductAvailability.findOne({
        where: { country_code: findOrder?.country_code },
        raw: true,
      });
      findOrder.fetchTaxData = fetchTaxData;
      findOrder.couponObj = couponObj;
      // findOrder.productData = productData;
      // findOrder.variantData = variantData;
      let fetchOnlinePaymentData = await OnlinePaymentDiscountModel.findOne({
        where: { country_code: findOrder.country_code },
        raw: true,
      });
      findOrder.onlinePaymentData = fetchOnlinePaymentData;
      const fetDeliveryData = await OrderDeliveryDayModel?.findOne({
        where: { country_code: findOrder.country_code },
        raw: true,
      });
      findOrder.homeDeliveryData = fetDeliveryData;

      //fetc adress
      let fetchAddress = await UserAddressModel.findOne({
        where: { id: findOrder?.address_id, user_id: findOrder?.user_id },
        raw: true,
      });

      if (
        (findOrder && findOrder?.status == "new") ||
        (findOrder && findOrder?.status == "processing") ||
        (findOrder && findOrder?.status == "outfordelivery")
      ) {
        if (
          findOrder &&
          findOrder?.is_student_info_id != 0 &&
          findOrder?.status == "new"
        ) {
          let findValue = await UserEducationInfoModel.findOne({
            where: { id: findOrder?.is_student_info_id },
            raw: true,
          });
          console.log(findValue, "findvalueuueueu");
          await UserEducationInfoModel.update(
            { used: Number(findValue?.used) + 1 },
            { where: { id: findOrder?.is_student_info_id } }
          );
        }
        const currentDate = new Date();
        let updateFields = { status: status };

        switch (status) {
          case "processing":
            updateFields.shipping_date = currentDate;
            break;
          case "outfordelivery":
            updateFields.out_for_delivery_date = currentDate;
            break;
          case "delivered":
            updateFields.delivery_date = currentDate;
            break;
        }

        await OrderModel.update(updateFields, {
          where: { order_id: findOrder?.order_id },
        });
        // await OrderModel.update(
        //   { status: status },
        //   {
        //     where: { order_id: findOrder?.order_id },
        //   }
        // );

        let getUSerEmail = await UserModel.findOne({
          where: { id: findOrder?.user_id },
          attributes: ["email", "name"],
          raw: true,
        });
        obj.emailData = getUSerEmail;
        res.status(200).json({
          message: "Order delivery status changed successfully",
          success: true,
          statusCode: 200,
        });
        console.log("findOrder", findOrder, "findOrder", fetchAddress);
        await changeOrderStatus(obj, findOrder, fetchAddress);
        //---------------------------------------------------------
        let productArr = [];
        if (findOrder?.variant_quantity) {
          for (let el of findOrder?.variant_quantity) {
            productArr.push(el?.product_id);
          }
        }
        let fetchProductCatId = await ProductModel.findAll({
          where: { id: productArr },
          raw: true,
        });

        let findSubCategoryArr = [];
        let findCategoryArr = [];

        // console.log(findOrder, "findOrderfindOrderfindOrder");
        let is_special_offer = false;
        if (fetchProductCatId) {
          for (let el of fetchProductCatId) {
            findCategoryArr.push(el.cat_id);
            let fetchCategory = categoryArr?.find(
              (elem) => elem?.id == el?.cat_id
            );
            if (fetchCategory) {
              findSubCategoryArr = [
                ...findSubCategoryArr,
                ...fetchCategory?.gender_arr,
              ];
            }
            // let checkIsSpecilOfferValid = categoryArr?.find(
            //   (elem) => elem?.id == el.cat_id
            // );
            // if (
            //   checkIsSpecilOfferValid &&
            //   checkIsSpecilOfferValid?.is_special_offer == 1
            // ) {
            //   sendEmailForDiscount = true;
            //   break;
            // }
          }
        }

        console.log(
          // productArr,
          "productarr",
          findCategoryArr,
          "findcategoryarr,",
          // findSubCategoryArr,
          "findsubcategory"
        );
        let discountObj = await CouponModel.findOne({
          where: {
            [Op.or]: [
              // { product_id: productArr },
              { category_id: findCategoryArr },
              // { sub_category_id: findSubCategoryArr },
            ],
            country: findOrder?.country_code,
            status: "active",
            start_date: { [Op.lt]: new Date() },
            // expired_date: { [Op.gt]: new Date() }, // expired_date is greater than or equal to today's date
            expired_date: { [Op.gt]: new Date() }, // expired_date is greater than or equal to today's date
            // used: { [Op.lt]: Sequelize.col("limit") }, // used count is less than the limit
          },
          raw: true,
        });
        console.log(discountObj, "disocuntarrrrrrrrrr");
        if (discountObj && discountObj.id) {
          if (!(discountObj?.used >= discountObj?.limit)) {
            let startDate = discountObj?.start_date;
            const startdateObject = new Date(startDate);
            const day = startdateObject.getDate().toString().padStart(2, "0");
            const month = (startdateObject.getMonth() + 1)
              .toString()
              .padStart(2, "0");
            const year = startdateObject.getFullYear();
            const formattedDate = `${day}-${month}-${year}`;
            discountObj.start_date = formattedDate;
            //-----------------------------------------
            let expiredDate = discountObj?.expired_date;
            const expireddateObject = new Date(expiredDate);
            const expiryday = expireddateObject
              .getDate()
              .toString()
              .padStart(2, "0");
            const expirymonth = (expireddateObject.getMonth() + 1)
              .toString()
              .padStart(2, "0");
            const expiryyear = expireddateObject.getFullYear();
            const expiryformattedDate = `${expiryday}-${expirymonth}-${expiryyear}`;
            discountObj.expired_date = expiryformattedDate;
            obj.discountObj = discountObj;
            // await sendCouponViaEmail(obj);
          }
        }
        // return;
      } else if (findOrder && findOrder?.status == "delivered") {
        return res.status(400).json({
          message: "This order delivered already",
          statusCode: 400,
          success: false,
        });
      } else if (findOrder && findOrder?.status == "cancelled") {
        return res.status(400).json({
          message: "This order has been cancelled",
          statusCode: 400,
          success: false,
        });
      } else {
        return res.status(400).json({
          message: "Order status cannot be changed at the moment",
          statusCode: 400,
          success: false,
        });
      }
    } catch (err) {
      console.log(err, "order status change order api error ");
      // return res
      //   .status(500)
      //   .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async update_Order_payment_status_data(req, res) {
    try {
      let { order_id, status } = req.body;

      let findOrder = await OrderModel.findOne({
        where: { order_id: order_id },
        raw: true,
      });
      let obj = { order_id, status };
      if (!findOrder) {
        return res.status(400).json({
          message: "Order not found",
          success: false,
          statusCode: 400,
        });
      }
      // console.log(req.body, "req.bodyyyyyyy", findOrder);
      if (
        (findOrder && findOrder?.status == "new") ||
        (findOrder && findOrder?.status == "processing") ||
        (findOrder && findOrder?.status == "outfordelivery")
      ) {
        await OrderModel.update(
          { payment_status: status },
          {
            where: { order_id: findOrder?.order_id },
          }
        );
        res.status(200).json({
          message: "Order Payment status changed successfully",
          success: true,
          statusCode: 200,
        });
        return;
        // await changeOrderStatus(obj);
        //------------------
      } else {
        res.status(400).json({
          message: "Order Payment status cannot be changed",
          success: false,
          statusCode: 400,
        });
        return;
      }
    } catch (err) {
      console.log(err, "statu sochange order api ");
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async getAll(req, res) {
    try {
      const pageSize = req.query.pageSize
        ? parseInt(req.query.pageSize, 10)
        : 10;
      const pageNumber = req.query.pageNumber
        ? parseInt(req.query.pageNumber, 10)
        : 1;

      let ListQuery = `
    SELECT 
      orders.id,
      orders.order_id,
      orders.user_id,
      orders.address_id,
      orders.variant_quantity,
      orders.coupon_id,
      orders.sub_total,
      orders.country_code,orders.delivery_charges,
      orders.payment_method,orders.payment_status,
      orders.status,
      orders.txn_id,orders.order_date,orders.delivery_date,
      orders.shipping_date,orders.out_for_delivery_date,
      orders.delivery_instructions, 
      JSON_OBJECT(   'id',users.id,
        'name',users.name,'country',users.country,'phone',users.phone,'email',users.email
      ) as userObj, 
      JSON_OBJECT('id',useraddresses.id,
      'city',useraddresses.city,
      'country',useraddresses.country,
      'state',useraddresses.state,
      'zipcode',useraddresses.zipcode,'full_name',useraddresses.full_name,
      'house_no',useraddresses.house_no,'address',
      useraddresses.address,'landmark',useraddresses.landmark,
      'mobile',useraddresses.mobile
      ) as userAddressObj
    FROM 
      orders AS orders
    JOIN 
      users AS users ON orders.user_id = users.id
    JOIN 
      user_addresses AS useraddresses ON useraddresses.id = orders.address_id
    --  LIMIT :pageSize OFFSET :offset
  `;

      let productList = await dbConnection.query(ListQuery, {
        type: dbConnection.QueryTypes.SELECT,
        // replacements: {
        //   pageSize: pageSize,
        //   offset: (pageNumber - 1) * pageSize,
        // },
      });

      return res.status(200).json({
        message: "fetch data",
        data: productList,
        statusCode: 200,
        success: true,
      });
    } catch (err) {
      console.log(err, "Eeeeeeeeeeeeeeeeeeeeeeeeee");
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async getFilteredOrders(req, res, filters) {
    try {
      if (req.userData.role != "super_admin") {
        filters.country_code = req.userData.country;
      }
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit) : 100;

      const offset = (page - 1) * limit;

      const data = await OrderModel.findAll({
        include: [
          {
            model: UserModel,
            attributes: ["id", "name", "email", "phone", "country"],
          },
          {
            model: UserEducationInfoModel,
            attributes: [
              "id",
              "user_id",
              "full_name",
              "university_name",
              "id_card_img",
              "university_id",
              "status",
              "approve",
              "created_at",
              "updated_at",
            ],
          },
          {
            model: UserAddressModel,
            attributes: [
              "id",
              "city",
              "state",
              "mobile",
              "address",
              "country",
              "zipcode",
              "house_no",
              "landmark",
              "full_name",
            ],
          },
        ],
        where: filters,
        order: [["created_at", "DESC"]],
        limit: limit,
        offset: offset,
      });

      return res
        .status(200)
        .json({ success: true, message: "Data fetched", data: data });
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message });
    }
  }

  // async getAll(req, res) {
  //   try {
  //     // console.log(req.id ,"req.id req.id req.id req.id req.id req.id req.id req.id ")
  //     const getAll = await OrderModel.findAll({
  //       where: { user_id: req.id },
  //       raw: true,
  //     });
  //     let obj = {};
  //     const result = [];

  //     getAll?.forEach((order) => {
  //       order.variant_quantity.forEach((variant) => {
  //         const newOrder = { ...order, variant_quantity: [variant] };
  //         result.push(newOrder);
  //       });
  //     });
  //     result?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  //     for (let el of result) {
  //       let getStatus = el?.status;
  //       if (obj[getStatus]) {
  //         obj[getStatus].push(el);
  //       } else {
  //         obj[getStatus] = [el];
  //       }
  //     }

  //     if (getAll) {
  //       return res.status(200).json({
  //         message: "Fetch data",
  //         // getAll,
  //         obj,
  //         allData: result,
  //         success: true,
  //         statusCode: 200,
  //       });
  //     } else {
  //       return res.status(404).json({
  //         message: "Data not found",
  //         success: false,
  //         statusCode: 404,
  //       });
  //     }
  //   } catch (err) {
  //     return res
  //       .status(500)
  //       .json({ message: err?.message, success: false, statusCode: 500 });
  //   }
  // }

  // async get_track_order_data(req, res) {
  //   try {
  //     const getAll = await OrderModel.findOne({
  //       where: { user_id: req.id, order_id: req.query.order_id },
  //       raw: true,
  //     });
  //     if (getAll) {
  //       return res.status(200).json({
  //         message: "Fetch data",
  //         data: getAll,
  //         success: true,
  //         statusCode: 200,
  //       });
  //     } else {
  //       return res.status(404).json({
  //         message: "Data not found",
  //         success: false,
  //         statusCode: 404,
  //       });
  //     }
  //   } catch (err) {
  //     return res
  //       .status(500)
  //       .json({ message: err?.message, success: false, statusCode: 500 });
  //   }
  // }

  // async request_return_by_user(req, res) {
  //   try {
  //     let { order_id } = req.query;
  //     let fetchOrderData = await OrderModel.findOne({
  //       where: { order_id, user_id: req.id },
  //       raw: true,
  //       attributes: ["status"],
  //     });
  //     if (!fetchOrderData) {
  //       return res.status(400).json({
  //         message: "Order not found",
  //         statusCode: 400,
  //         success: false,
  //       });
  //     } else if (fetchOrderData && fetchOrderData?.status == "delivered") {
  //       await OrderModel.update(
  //         { status: "return-request" },
  //         { where: { order_id } }
  //       );
  //       return res.status(200).json({
  //         message: "Order request submit successfully",
  //         statusCode: 200,
  //         success: true,
  //       });
  //     } else {
  //       return res.status(400).json({
  //         message: "Order request cannot be made",
  //         statusCode: 400,
  //         success: true,
  //       });
  //     }
  //   } catch (err) {
  //     return res
  //       .status(500)
  //       .json({ success: false, statusCode: 500, message: err?.message });
  //   }
  // }

  // async downloadInvoice(req, res) {
  //   try {
  //     let fetchORderData = await OrderModel.findOne({
  //       where: { order_id: req.query.order_id, user_id: req.id },
  //       raw: true,
  //     });
  //     if (!fetchORderData) {
  //       return res.status(400).json({
  //         message: "Order not found",
  //         statusCode: 400,
  //         success: false,
  //       });
  //     }
  //     let productIdArr = [];
  //     let variantIdArr = [];
  //     for (let el of fetchORderData?.variant_quantity) {
  //       productIdArr.push(el?.product_id);
  //       variantIdArr.push(el?.variant_id);
  //     }
  //     let filterProductDAta = await filterProduct.findOne();
  //     // console.log(filterProductDAta, "filterProductDAta");
  //     let genderArr = filterProductDAta?.gender;
  //     let shapeArr = filterProductDAta?.shape;
  //     let colorArr = filterProductDAta?.color;
  //     let materialArr = filterProductDAta?.material;
  //     let sizeArr = filterProductDAta?.size;
  //     let weight_group_arr = filterProductDAta?.weight_group;
  //     let priceArr = filterProductDAta?.price_range;
  //     let categoryArr = filterProductDAta?.categories;
  //     const productData = await ProductModel.findAll({
  //       where: {
  //         id: {
  //           [Op.in]: productIdArr,
  //         },
  //       },
  //       attributes: [
  //         "id",
  //         "title",
  //         "cat_id",
  //         "thumbnail_img",
  //         "material_id",
  //         "shape_id",
  //       ],
  //       raw: true,
  //     });
  //     let variantData = await ProductVariantModel.findAll({
  //       where: {
  //         variant_id: {
  //           [Op.in]: variantIdArr,
  //         },
  //       },
  //       attributes: [
  //         "sku",
  //         "variant_name",
  //         "variant_price_details",
  //         "thumbnail_url",
  //         "color_id",
  //         "material_id",
  //         "is_featured",
  //         "size_id",
  //         "variant_id",
  //         "product_id",
  //       ],
  //       raw: true,
  //     });
  //     for (let el of variantData) {
  //       el.variant_price_details = el.variant_price_details?.filter(
  //         (variant) => variant?.country_code == fetchORderData?.country_code
  //       );
  //       el.color_name = colorArr?.find(
  //         (ele) => ele?.id === el?.color_id
  //       )?.value;
  //       el.material_name = materialArr?.find(
  //         (ele) => ele?.id == el?.material_id
  //       )?.value;
  //       el.size_name = sizeArr?.find((ele) => ele?.id == el?.size_id)?.value;
  //     }

  //     for (let le of productData) {
  //       le.cat_name = categoryArr?.find((el) => el?.id == le?.cat_id)?.value;
  //       le.material_name = materialArr?.find(
  //         (el) => el?.id == le?.material_id
  //       )?.value;
  //       le.shape_name = shapeArr?.find((el) => el?.id == le?.shape_id)?.value;
  //     }
  //     for (let el of fetchORderData?.variant_quantity) {
  //       el.findProductObj = productData?.find(
  //         (lem) => lem?.id == el?.product_id
  //       );
  //       el.variantObj = variantData?.find(
  //         (lem) => lem?.variant_id == el.variant_id
  //       );
  //     }
  //     let fetuserObj = await UserAddressModel.findOne({
  //       where: {
  //         id: fetchORderData?.address_id,
  //         user_id: fetchORderData?.user_id,
  //       },
  //       raw: true,
  //     });
  //     fetchORderData.userAddressObj = fetuserObj;
  //     // console.log(fetchORderData, "ffffffffffffff");
  //     // return
  //     const data = await downloadInvoice(fetchORderData);
  //     res.setHeader("Content-Type", "text/html");
  //     return res.status(200).json({ success: true, data: data });
  //   } catch (err) {
  //     return res
  //       .status(500)
  //       .json({ message: err?.message, success: false, statusCode: 500 });
  //   }

  //   // function generateInvoice() {
  //   //   return {
  //   //     invoiceNumber: "INV123",
  //   //     date: "2022-01-01",
  //   //     items: [
  //   //       { description: "Item 1", quantity: 2, price: 10 },
  //   //       { description: "Item 2", quantity: 1, price: 20 },
  //   //     ],
  //   //     total: 40,
  //   //   };
  //   // }

  //   // const invoiceData = generateInvoice();
  //   // const filePath = `${__dirname}/temp_invoice.json`;
  //   // // const filePath = path.join(__dirname, "temp_invoice.json");
  //   // try {
  //   //   fs.writeFileSync(filePath, JSON.stringify(invoiceData));
  //   //   res.download(filePath, "invoice.json", (err) => {
  //   //     if (err) {
  //   //       console.error("Error downloading invoice:", err);
  //   //       res.status(500).send("Internal Server Error");
  //   //     }

  //   //     // Delete the temporary file after download
  //   //     fs.unlinkSync(filePath);
  //   //   });
  //   // } catch (err) {
  //   //   return res.status(500).json({ success: false, message: err?.message });
  //   // }
  //   // return res.status(200).json({ success: true, message: "Download" });
  // }

  // async cancel_order_by_user(req, res) {
  //   try {
  //     let { order_id } = req.body;
  //     let findOrderExist = await OrderModel.findOne({
  //       where: { user_id: req.id, order_id },
  //       raw: true,
  //       attributes: ["status", "order_id", "order_date", "variant_quantity"],
  //     });
  //     if (!findOrderExist) {
  //       return res.status(400).json({
  //         message: "Order not found",
  //         success: false,
  //         statusCode: 400,
  //       });
  //     } else if (findOrderExist && findOrderExist?.status == "new") {
  //       await OrderModel.update(
  //         { status: "cancelled" },
  //         { where: { order_id } }
  //       );
  //       res.status(200).json({
  //         message: "Order cancelled successfully",
  //         success: true,
  //         statusCode: 200,
  //       });
  //       findOrderExist.cancelledItems = findOrderExist?.variant_quantity?.map(
  //         (el) => el?.variant_name
  //       );
  //       await cancelOrder(req.userData, findOrderExist);
  //       return;
  //     } else if (findOrderExist && findOrderExist?.status == "cancelled") {
  //       return res.status(400).json({
  //         message: "Order already 'cancel'",
  //         success: false,
  //         statusCode: 400,
  //       });
  //     } else {
  //       return res.status(400).json({
  //         message: "Order cannot be cancel",
  //         success: false,
  //         statusCode: 400,
  //       });
  //     }
  //   } catch (err) {
  //     return res
  //       .status(500)
  //       .json({ message: err?.message, success: false, statusCode: 500 });
  //   }
  // }

  async fetchGraphDataSubtotal(filters, req, res) {
    try {
      // console.log(filters, "filterrrrrrrrrrrrrrrrrrr");
      const data = await OrderModel.findAll({
        attributes: [
          [dbConnection.fn("SUM", dbConnection.col("sub_total")), "revenue"],
          [
            dbConnection.fn("DATE", dbConnection.col("order_date")),
            "order_date",
          ],
        ],
        where: filters,
        group: [dbConnection.fn("DATE", dbConnection.col("order_date"))],
        order: [
          [dbConnection.fn("DATE", dbConnection.col("order_date")), "ASC"],
        ],
      });
      return res
        .status(200)
        .json({ success: true, message: "Data fetched", data: data });
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message });
    }
  }

  async fetchGraphDataOrders(filters, req, res) {
    try {
      let data = await OrderModel.findAll({
        attributes: [
          [fn("date_format", col("order_date"), "%d-%m-%Y"), "order_date"],
          [fn("count", col("*")), "orders"],
        ],
        where: filters,
        group: fn("date_format", col("order_date"), "%d-%m-%Y"),
        raw: true,
      });
      const newData = data.sort((a, b) => {
        const dateA = new Date(a.order_date.split("-").reverse().join("-"));
        const dateB = new Date(b.order_date.split("-").reverse().join("-"));
        return dateA - dateB;
      });
      const totalOrders = await OrderModel.count({
        where: { country_code: filters?.country_code },
      });
      const pendingPayment = await OrderModel.count({
        where: {
          country_code: filters?.country_code,
          payment_status: "pending",
          payment_method: {
            [Sequelize.Op.ne]: "Cash on Delivery",
          },
        },
      });
      const deliveredOrders = await OrderModel.count({
        where: {
          country_code: filters?.country_code,
          status: "delivered",
        },
      });
      return res.status(200).json({
        success: true,
        message: "Data fetched",
        data: newData,
        totalOrders,
        pendingPayment,
        deliveredOrders,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message });
    }
  }

  async update_delivery_day_data(req, res) {
    try {
      let {
        country_code,
        delivery_day,
        shipping_day,
        country,
        out_for_delivery_day,
        normal_delivery_charges,
      } = req.body;

      let msg = "Delivery data update successfully";
      let statusCode = 200;
      let findObj = await OrderDeliveryDayModel.findOne({
        where: { country_code },
        raw: true,
      });
      if (findObj && findObj?.id) {
        let obj = {
          delivery_day: delivery_day || findObj?.delivery_day,
          shipping_day: shipping_day || findObj?.shipping_day,
          out_for_delivery_day:
            out_for_delivery_day || findObj?.out_for_delivery_day,
          normal_delivery_charges: normal_delivery_charges,
          country: country || findObj?.country,
        };
        await OrderDeliveryDayModel.update(obj, { where: { id: findObj?.id } });
      } else {
        let obj = {
          delivery_day,
          shipping_day,
          out_for_delivery_day,
          normal_delivery_charges,
          country_code,
          country,
        };
        await OrderDeliveryDayModel.create(obj);
        msg = "Delivery data added successfully";
        statusCode = 201;
      }
      return res
        .status(statusCode)
        .json({ message: msg, statusCode, success: true });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async get_delivery_day_data(req, res) {
    try {
      let country_code = req.query.country_code;
      let findObj = {};
      if (req.query.country_code) {
        findObj = await OrderDeliveryDayModel.findAll({
          where: { country_code: req.query.country_code },
          raw: true,
        });
      } else {
        if (req.userData.role != "super_admin") {
          findObj = await OrderDeliveryDayModel.findAll({
            where: { country_code: req.userData.country },
            raw: true,
          });
        } else {
          findObj = await OrderDeliveryDayModel.findAll({ raw: true });
        }
      }
      return res.status(200).json({
        message: "fetch data",
        statusCode: 200,
        success: true,
        data: findObj,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async delete_delivery_day_data(req, res) {
    try {
      let id = req.query.id;
      let obj = await OrderDeliveryDayModel.findOne({
        where: { id },
        raw: true,
      });
      if (!obj) {
        return res.status(400).json({
          message: "Data deleted already",
          statusCode: 400,
          success: false,
        });
      }
      await OrderDeliveryDayModel.destroy({ where: { id } });

      return res.status(200).json({
        message: "delete data successfully",
        statusCode: 200,
        success: true,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async handleCheckAndUpdateOrderPaymentStatus() {
    try {
      // DATE_SUB(NOW(), INTERVAL 6 HOUR)
      // DATE_SUB(NOW(), INTERVAL 1 DAY)
      // DATE_SUB(NOW(), INTERVAL 60 MINUTE)

      // let query = `SELECT *
      // FROM orders
      // WHERE payment_method != 'Cash on Delivery'
      // AND payment_status = 'pending'
      // AND order_date <= DATE_SUB(NOW(), INTERVAL 30 MINUTE)
      // AND order_date <= NOW()
      // ORDER BY order_date DESC;
      // `;
      // let getAll = await dbConnection.query(query, {
      //   type: dbConnection.QueryTypes.SELECT,
      //   raw: true,
      // });
      let query = `UPDATE orders
      SET payment_status = 'failed', status = 'cancelled'
      WHERE payment_method != 'Cash on Delivery'
      AND payment_status = 'pending'
      AND order_date <= DATE_SUB(NOW(), INTERVAL 30 MINUTE)
      AND order_date <= NOW();            
      `;
      const [rowsAffected] = await dbConnection.query(query);
      console.log(rowsAffected, "rows updated");

      // getAll = getAll.flatMap((subArray) => subArray);
      // getAll = getAll.map((order) => ({
      //   ...order,
      //   order_date: moment(order.order_date).format("YYYY-MM-DD HH:mm:ss"),
      // }));
    } catch (err) {
      console.log(err, "erororo occured while order payment status failed !");
    }
  }
}

const OrderServicesObj = new OrderServices();
export default OrderServicesObj;
