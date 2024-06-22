import OrderModel from "../../models/OrderModel.js";
import axios from "axios";
import CouponModel from "../../models/couponModel.js";
import UserAddressModel from "../../models/UserAddressModel.js";

import ProductVariantModel from "../../models/ProductVariantModel.js";
import ProductMaterialModel from "../../models/ProductMaterialModel.js";
import ProductDescriptionModel from "../../models/ProductDescriptionModel.js";
import LogisticData from "../../models/LogisticDataModel.js";
import { Op, where } from "sequelize";
import CartModel from "../../models/CartModel.js";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import ProductModel from "../../models/ProductModel.js";
import filterProduct from "../../models/filterDataModel.js";
import { downloadInvoice } from "../../helpers/downloadInvoice.js";
import {
  cancelOrder,
  orderPlaceViaEmail,
  updateOrderPaymentViaEmail,
} from "../../helpers/common.js";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { environmentVars } from "../../config/environmentVar.js";

// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import stripe from "stripe";
import ProductAvailability from "../../models/ProductAvailability.js";
import UserEducationInfoModel from "../../models/UserEducationInfo.js";
import deliveryModel from "../../models/DeliveryModel.js";
import OnlinePaymentDiscountModel from "../../models/OnlinePaymentDiscountModel.js";
import dbConnection from "../../config/dbConfig.js";
import OrderDeliveryDayModel from "../../models/OrderDeliveryDayModel.js";
import UserModel from "../../models/UserModel.js";
const stripeInstance = stripe(environmentVars?.stripe_secret_key);

class OrderServices {
  async create_order(req, res) {
    try {
      let {
        address_id,
        variant_quantity,
        coupon_id,
        sub_total,
        delivery_charges,
        payment_method,
        payment_status,
        status,
        country_code,
        is_student_info_id,
      } = req.body;
      console.log(req.body, "req.bodyyyyyyyyyyyyyyyyyyyyyyyyy", req.id);
      let findAddressExist = await UserAddressModel.findOne({
        where: { id: address_id, user_id: req.id },
        raw: true,
      });
      if (!findAddressExist) {
        return res.status(400).json({
          message: "User address not found",
          statusCode: 400,
          sucess: false,
        });
      }
      //req.body  validation here
      for (let el of variant_quantity) {
        if (isNaN(el?.product_id)) {
          return res.status(400).json({
            message: "Product id is invalid",
            statusCode: 400,
            success: false,
          });
        }
        if (isNaN(el?.variant_id)) {
          return res.status(400).json({
            message: "Product variant id is invalid",
            statusCode: 400,
            success: false,
          });
        }
      }
      let todayDate = new Date();
      let checkCoupon = {};
      // validation here
      if (coupon_id) {
        checkCoupon = await CouponModel.findOne({
          where: { id: coupon_id, country: country_code, status: "active" },
          raw: true,
        });
        if (!checkCoupon) {
          return res.status(400).json({
            message: "Coupon not found",
            statusCode: 400,
            success: false,
          });
        }
        const ordersByUserCouponsData = await OrderModel.count({
          where: { user_id: req.id, coupon_id: coupon_id },
        });
        if (checkCoupon.max_uses_per_user <= ordersByUserCouponsData) {
          return res.status(400).json({
            message: "Coupon usage limit exceeded",
            statusCode: 400,
            success: false,
          });
        }

        // if (checkCoupon && checkCoupon?.status != "active") {
        //   return res.status(400).json({
        //     message: `This coupon ${checkCoupon?.name} is not active`,
        //     statusCode: 400,
        //     success: false,
        //   });
        // }

        let couponExpiryExpiryDate = new Date(checkCoupon?.expired_date);
        couponExpiryExpiryDate.setHours(23);
        couponExpiryExpiryDate.setMinutes(59);
        couponExpiryExpiryDate.setSeconds(59);
        if (couponExpiryExpiryDate < todayDate) {
          return res.status(400).json({
            message: "Coupon is expired",
            statusCode: 400,
            success: false,
          });
        } else if (checkCoupon && checkCoupon?.used >= checkCoupon?.limit) {
          return res.status(400).json({
            message: "Coupon limit exceed",
            statusCode: 400,
            success: false,
          });
        }
      }

      let variant_id = [];
      //req.body data push id to variantid arr
      for (let le of variant_quantity) {
        variant_id.push(le?.variant_id);
      }
      // fetch product's variant from db
      let findProduct = await ProductVariantModel.findAll({
        where: {
          variant_id: {
            [Op.in]: variant_id,
          },
        },
        attributes: [
          "variant_price_details",
          "variant_id",
          "product_id",
          "status",
          "code",
        ],
        raw: true,
      });
      let productArr = [];

      //req.body data validaton for belongs to valid product
      for (let el of variant_quantity) {
        let find = findProduct?.find(
          (elem) => elem?.variant_id == el?.variant_id
        );
        if (find?.product_id != el?.product_id) {
          return res.status(400).json({
            message: `This variant_id '${el?.variant_id}' is not belongs to this product_id '${el?.product_id}'`,
            statusCode: 400,
            success: false,
          });
        } else if (find?.status != "active") {
          return res.status(400).json({
            message: `This Product variant ${el?.variant_id} is not active`,
          });
        }
      }

      //product variant db data , push product id to arr
      for (let el of findProduct) {
        productArr.push(el?.product_id);
      }
      //fetch products from db here
      let productDetails = await ProductModel.findAll({
        where: { id: productArr },
        raw: true,
        attributes: ["title", "sku", "id", "status", "is_student", "cat_id"],
      });
      let newArray = [...findProduct];
      findProduct = findProduct.map((product) => {
        let findPRoductId = productDetails.find(
          (ele) => ele?.id == product?.product_id
        );
        return {
          variant_id: product?.variant_id,
          product_id: product?.product_id,
          variant_name: findPRoductId?.title, ////
          sku: product?.code, //
          cat_id: findPRoductId?.cat_id,
          variant_price_details: product?.variant_price_details
            ? product?.variant_price_details
                ?.filter((details) => details.country_code == country_code)
                ?.map((filteredDetails) => ({
                  // tax: filteredDetails?.tax,
                  price: filteredDetails?.price,
                  stock: filteredDetails?.stock,
                  country: filteredDetails?.country,
                  discount: filteredDetails?.discount,
                  purchase_price: filteredDetails?.purchase_price,
                  // tax_name: filteredDetails?.tax_name,
                  country_code: filteredDetails?.country_code,
                  currency_symbol: filteredDetails?.currency_symbol,
                }))
            : [],
        };
      });
      // return;
      let findProductVariant;
      //req.body. data , check stock here
      for (let le of variant_quantity) {
        findProductVariant = findProduct.find(
          (el) => el?.variant_id == le?.variant_id
        );
        if (
          findProductVariant?.variant_price_details[0]?.stock < le?.quantity
        ) {
          return res.status(400).json({
            message: `Insufficient product stock of "${findProductVariant?.variant_name}" product`,
            success: false,
            statusCode: 400,
          });
        }
      }
      let totalAmountDb = 0;
      //product variants db data, calculate totalamountdb
      for (let le of findProduct) {
        let findData = le.variant_price_details.find(
          (el) => el.country_code == country_code
        );
        let amount = Number(
          findData?.price - (findData?.price * findData?.discount) / 100
        )?.toFixed(2);
        let quantityData = variant_quantity?.find(
          (element) => element?.variant_id == le.variant_id
        );
        amount = amount * quantityData?.quantity;
        totalAmountDb = Number(totalAmountDb) + Number(amount);
      }

      //-----------add here 'buy_get' coupon flow below--------------
      let numberOfBuyProduct; //1
      let numberOfGetProduct; //2
      if (is_student_info_id == 0) {
        if (
          checkCoupon &&
          checkCoupon?.type == "buy_get" &&
          is_student_info_id == 0 &&
          checkCoupon?.category_id == null
        ) {
          numberOfBuyProduct = checkCoupon?.buy_product; //1
          numberOfGetProduct = checkCoupon?.get_product; //2
          // Flatten the array by duplicating objects based on the quantity
          const duplicatedVariants = variant_quantity.flatMap(
            ({ quantity, ...rest }) =>
              Array.from({ length: quantity }, () => ({ quantity: 1, ...rest }))
          );
          if (
            duplicatedVariants?.length >=
            Number(numberOfBuyProduct) + Number(numberOfGetProduct)
          ) {
            // return res
            //   .status(400)
            //   .json({
            //     message: "Product must be equal or more than the offer",
            //     statusCode: 400,
            //     success: false,
            //   });
            // let highestArr = [];
            let smallestArr = [];
            // db product variant data
            let findProductTemp = findProduct.map((product) => {
              //main product db data
              let findPRoductId = productDetails.find(
                (ele) => ele?.id == product?.product_id
              );
              let variant_price_details = product?.variant_price_details
                ? product?.variant_price_details?.find(
                    (details) => details.country_code == country_code
                  )
                : null;
              let amount = variant_price_details
                ? Number(
                    variant_price_details.price -
                      (variant_price_details.price *
                        variant_price_details.discount) /
                        100
                  ).toFixed(2)
                : null;
              return {
                variant_id: product?.variant_id,
                product_id: product?.product_id,
                variant_name: findPRoductId?.title,
                sku: product?.code,
                variant_price_details: variant_price_details,
                amount: amount,
              };
            });
            let tempArr = [];
            variant_quantity.forEach((item) => {
              let dbItem = findProductTemp.find(
                (elem) => elem.variant_id == item.variant_id
              );
              if (dbItem) {
                for (let i = 0; i < item.quantity; i++) {
                  tempArr.push({ ...dbItem, quantity: 1 });
                }
              }
            });
            let sortedArr = tempArr?.sort((x, y) => x?.amount - y?.amount);
            smallestArr = sortedArr?.slice(0, Number(numberOfGetProduct));
            let lowestProductamount = 0;
            for (let le of smallestArr) {
              lowestProductamount =
                Number(lowestProductamount) + Number(le.amount);
            }
            totalAmountDb = Number(totalAmountDb) - Number(lowestProductamount);
          }
        } else if (
          checkCoupon &&
          checkCoupon?.type == "buy_get" &&
          is_student_info_id == 0 &&
          checkCoupon?.category_id != null
        ) {
          numberOfBuyProduct = checkCoupon?.buy_product; //1
          numberOfGetProduct = checkCoupon?.get_product; //2

          const duplicatedVariants = variant_quantity.flatMap(
            ({ quantity, ...rest }) =>
              Array.from({ length: quantity }, () => ({ quantity: 1, ...rest }))
          );
          if (
            duplicatedVariants?.length >=
            Number(numberOfBuyProduct) + Number(numberOfGetProduct)
          ) {
            let smallestArr = [];
            // db product variant data
            let findProductTemp = findProduct.map((product) => {
              //main product db data
              let findPRoductId = productDetails.find(
                (ele) => ele?.id == product?.product_id
              );
              let variant_price_details = product?.variant_price_details
                ? product?.variant_price_details?.find(
                    (details) => details.country_code == country_code
                  )
                : null;
              let amount = variant_price_details
                ? Number(
                    variant_price_details.price -
                      (variant_price_details.price *
                        variant_price_details.discount) /
                        100
                  ).toFixed(2)
                : null;
              return {
                variant_id: product?.variant_id,
                product_id: product?.product_id,
                variant_name: findPRoductId?.title,
                cat_id: findPRoductId?.cat_id,
                sku: product?.code,
                variant_price_details: variant_price_details,
                amount: amount,
                cat_id: findPRoductId?.cat_id,
              };
            });
            //  variant_quantity
            let tempArr = [];
            variant_quantity.forEach((item) => {
              let dbItem = findProductTemp.find(
                (elem) => elem.variant_id == item.variant_id
              );
              if (dbItem) {
                for (let i = 0; i < item.quantity; i++) {
                  tempArr.push({ ...dbItem, quantity: 1 });
                }
              }
            });
            let sameCatIdData = [];
            let nonCategory = [];
            tempArr?.forEach((ele) => {
              if (ele?.cat_id == checkCoupon?.category_id) {
                sameCatIdData.push(ele);
              } else {
                nonCategory.push(ele);
              }
            });
            if (
              Number(numberOfBuyProduct) + Number(numberOfGetProduct) <=
              sameCatIdData?.length
            ) {
              let sortedArr = sameCatIdData?.sort(
                (x, y) => x?.amount - y?.amount
              );
              if (sortedArr) {
                smallestArr = sortedArr?.slice(0, Number(numberOfGetProduct));
              }
              let lowestProductamount = 0;
              if (smallestArr) {
                for (let le of smallestArr) {
                  lowestProductamount =
                    Number(lowestProductamount) + Number(le.amount);
                }
              }
              totalAmountDb =
                Number(totalAmountDb) - Number(lowestProductamount);
            }
          }
        }
      }
      if (coupon_id && is_student_info_id == 0) {
        let tempSubTotal = Number(sub_total);

        if (checkCoupon?.type == "fixed") {
          tempSubTotal = tempSubTotal + Number(checkCoupon?.value);
          totalAmountDb = Number(totalAmountDb) - Number(checkCoupon?.value);
        } else if (checkCoupon?.type == "percent") {
          tempSubTotal =
            (tempSubTotal * 100) / (100 - Number(checkCoupon?.value));
          totalAmountDb =
            Number(totalAmountDb) -
            (Number(totalAmountDb) * Number(checkCoupon?.value)) / 100;
        }
        if (checkCoupon && checkCoupon?.type != "buy_get") {
          if (
            Number(tempSubTotal)?.toFixed(2) < Number(checkCoupon?.min_purchase)
          ) {
            return res.status(400).json({
              message: `Coupon can't be apply, minimum purchase amount will be ${checkCoupon?.min_purchase}`,
              statusCode: 400,
              success: false,
            });
          } else if (
            Number(tempSubTotal)?.toFixed(2) > Number(checkCoupon?.max_purchase)
          ) {
            return res.status(400).json({
              message: `Coupon can't be apply, maximum purchase amount will be ${checkCoupon?.max_purchase}`,
              statusCode: 400,
              success: false,
            });
          }
        }
      }
      if (is_student_info_id == 0) {
        if (!payment_method.toLowerCase().includes("cash")) {
          totalAmountDb = totalAmountDb + Number(delivery_charges);
          let fetchDiscount = await OnlinePaymentDiscountModel.findOne({
            where: { country_code },
            raw: true,
          });
          let amountdeduct = (100 - parseInt(fetchDiscount?.discount)) / 100;
          totalAmountDb = totalAmountDb * amountdeduct;
          totalAmountDb = totalAmountDb - Number(delivery_charges);
        }
        // console.log(parseInt(totalAmountDb),"parseInt(",parseInt(sub_total),"parseInt(",Math.round(sub_total),"asdad",totalAmountDb);
        if (parseInt(totalAmountDb) != parseInt(sub_total)&&parseInt(totalAmountDb) != Math.round(sub_total)    ) {
          return res.status(400).json({
            message: "Order amount gone wrong",
            statusCode: 400,
            success: false,
          });
        }
      } else {
        //here we check validation
        let ftechOrder = await OrderModel.count({
          where: {
            user_id: req.id,
            status: "delivered",
            is_student_info_id: {
              [Op.not]: 0,
            },
          },
        });
        // if (ftechOrder && ftechOrder?.length >= 3) {
        if (ftechOrder && Number(ftechOrder) >= 3) {
          return res.status(400).json({
            message: "You can't avail student offer, limit exceed",
            statusCode: 400,
            success: false,
          });
        }
        for (let le of variant_quantity) {
          let findVariantData = findProduct.find(
            (el) => el?.variant_id == le.variant_id
          );
          if (findVariantData) {
            let findProductData = productDetails.find(
              (el) => el.id == findVariantData?.product_id
            );
            if (findProductData && findProductData?.is_student == 1) {
              let findCountry = findVariantData?.variant_price_details?.find(
                (elem) => elem?.country_code == country_code
              );
              let findAmountfind =
                (Number(findCountry?.price) *
                  Number(100 - findCountry?.discount)) /
                100;
              findAmountfind = findAmountfind?.toFixed(2);
              let amountDeduct = findAmountfind * le.quantity;
              totalAmountDb = Number(totalAmountDb) - Number(amountDeduct);
              totalAmountDb = totalAmountDb?.toFixed(2);
            }
          }
        }
        if (!payment_method.toLowerCase().includes("cash")) {
          totalAmountDb = Number(totalAmountDb) + Number(delivery_charges);
          let fetchDiscount = await OnlinePaymentDiscountModel.findOne({
            raw: true,
          });
          let amountdeduct = (100 - parseInt(fetchDiscount?.discount)) / 100;
          totalAmountDb = totalAmountDb * amountdeduct;
          totalAmountDb = totalAmountDb - Number(delivery_charges);
        }
        if (totalAmountDb < 0) {
          totalAmountDb = Math.abs(totalAmountDb);
        }
        if (
          Math.floor(parseInt(totalAmountDb)) != Math.floor(parseInt(sub_total)   &&parseInt(totalAmountDb) != Math.round(sub_total) )
        ) {
          console.log(Math.floor(parseInt(totalAmountDb)),".floor(parseInt",Math.floor(parseInt(sub_total),"Math.floor("))

          // discuss when  cart have two or more products of student category
          return res.status(400).json({
            message: "Order amount gone wrong stud",
            statusCode: 400,
            success: false,
          });
        }
      }
      let fetchDeliveryDaysObj = await OrderDeliveryDayModel.findOne({
        raw: true,
      });
      const oneWeekLater = new Date();
      oneWeekLater.setDate(
        todayDate.getDate() + fetchDeliveryDaysObj?.delivery_day || 7
      );
      let twoDayLater = new Date();
      twoDayLater.setDate(
        todayDate?.getDate() + fetchDeliveryDaysObj?.shipping_day || 2
      );
      let fourDayLater = new Date();
      fourDayLater.setDate(
        todayDate?.getDate() + fetchDeliveryDaysObj?.out_for_delivery_day || 4
      );
      let obj = {
        order_id: Date.now() + Math.round(Math.random() * 10000000000),
        user_id: req.id,
        address_id,
        variant_quantity,
        coupon_id,
        sub_total,
        delivery_charges,
        payment_method,
        payment_status,
        status,
        order_date: Date.now(),
        // order_date: getCurrentDateTime(),
        delivery_date: oneWeekLater,
        country_code,
        shipping_date: twoDayLater,
        out_for_delivery_date: fourDayLater,
        is_student_info_id,
      };

      let orderObj = await OrderModel.create(obj);
      await CartModel.destroy({
        where: {
          user_id: req.id,
        },
      });
      const fetch = await OrderModel.findOne({
        where: { order_id: obj?.order_id },
        raw: true,
      });
      const userData = await UserModel.findOne({
        where: { id: fetch.user_id },
        raw: true,
      });
      const addressData = await UserAddressModel.findOne({
        where: { id: fetch.address_id },
        raw: true,
      });
      //-----------------------------------------------------------
      let couponObj = checkCoupon;
      // if (orderObj?.coupon_id) {
      //   couponObj = await CouponModel.findOne({
      //     where: { id: orderObj?.coupon_id },
      //     raw: true,
      //   });
      // }
      let fetchTaxData = await ProductAvailability.findOne({
        where: { country_code: country_code },
        raw: true,
      });
      let fetchOnlinePaymentData = await OnlinePaymentDiscountModel.findOne({
        where: { country_code: country_code },
        raw: true,
      });

      let filterProductDAta = await filterProduct.findOne();
      let genderArr = filterProductDAta?.gender;
      let shapeArr = filterProductDAta?.shape;
      let colorArr = filterProductDAta?.color;
      let materialArr = filterProductDAta?.material;
      let sizeArr = filterProductDAta?.size;
      let weight_group_arr = filterProductDAta?.weight_group;
      let priceArr = filterProductDAta?.price_range;
      let categoryArr = filterProductDAta?.categories;
      const productData = await ProductModel.findAll({
        where: {
          id: {
            [Op.in]: productArr,
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
            [Op.in]: variant_id,
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
      for (let el of variantData) {
        el.variant_price_details = el.variant_price_details?.filter(
          (variant) => variant?.country_code == obj?.country_code
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

      for (let el of obj?.variant_quantity) {
        el.findProductObj = productData?.find(
          (lem) => lem?.id == el?.product_id
        );
        el.variantObj = variantData?.find(
          (lem) => lem?.variant_id == el.variant_id
        );
      }
      if (obj?.is_student_info_id) {
        let fetchDeliveryData = await deliveryModel.findOne({ raw: true });
        let objDelivery = {};
        objDelivery.discount = fetchDeliveryData?.discount;
        // console.log(fetchDeliveryData,)
        fetchDeliveryData = fetchDeliveryData?.student_charges?.find(
          (el) => el?.country_code == obj.country_code
        );
        objDelivery = { ...objDelivery, ...fetchDeliveryData };

        obj.objDelivery = objDelivery;
      }
      obj.onlinePaymentData = fetchOnlinePaymentData;
      obj.couponObj = couponObj;
      obj.addressData = addressData;
      obj.fetchTaxData = fetchTaxData;

      let productArray = fetch?.variant_quantity;
      if (payment_method.toLowerCase().includes("cash")) {
        try {
          let data = {
            orderId: obj?.order_id,
            orderDate: getCurrentDateTime(),
            totalAmount: fetch.sub_total,
            customerName: userData.name,
            address: addressData.address,
            pincode: addressData.zipcode,
            city: addressData.city,
            state: addressData.state,
            country: addressData.country,
            phone: addressData.mobile.split("-")[1],
            email: userData.email,
            productArray: productArray,
            subTotal: sub_total,
            is_student: is_student_info_id,
            shippingLength: "10",
            shippingWidth: "10",
            shippingHeight: "10",
            weight: "0.3",
            shippingCharge: delivery_charges,
            totalDiscount: "0",
            codAmount: fetch.sub_total,
            paymentMode: "cod",
            storeId: "16361",
          };
          let config = {
            method: "post",
            url: `http://localhost:${environmentVars?.port}/api/shipping/order/create`,
            data: data,
          };
          const logisticData = await axios.request(config);

          let logisticDataDB = new LogisticData({
            status: logisticData?.data?.data?.status,
            order_id: obj?.order_id,
            html_message: logisticData?.data?.data?.html_message,
            remark: logisticData?.data.data.data["1"].remark,
            waybill: logisticData?.data.data.data["1"].waybill,
            refnum: logisticData?.data.data.data["1"].refnum,
            logistic_name: logisticData?.data.data.data["1"].logistic_name,
          });
          await logisticDataDB.save();
        } catch (err) {
          console.log(err, "order create api logistic");
        }
      }
      res.status(201).json({
        message: "Order placed successfully",
        statusCode: 201,
        success: true,
        order_id: obj?.order_id,
      });

      if (payment_method.toLowerCase().includes("cash")) {
        await orderPlaceViaEmail(obj, req.userData);
      }

      if (coupon_id) {
        let usedNumber = checkCoupon?.used;
        usedNumber = usedNumber + 1;
        await CouponModel.update(
          { used: usedNumber },
          { where: { id: coupon_id } }
        );
      }
      newArray.forEach((el) => {
        let le = variant_quantity.find(
          (item) => item?.variant_id == el?.variant_id
        );
        if (le) {
          el.variant_price_details = el.variant_price_details.map((eleme) => {
            if (eleme.country_code == req.body.country_code) {
              eleme.stock -= le.quantity;
              eleme.stock = Math.max(0, eleme.stock);
            }
            return eleme;
          });
        }
      });
      for (let el of newArray) {
        let variant_price_details = el?.variant_price_details;
        await ProductVariantModel.update(
          { variant_price_details },
          { where: { variant_id: el?.variant_id } }
        );
      }
      return;
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async update_order(req, res) {
    //check payment is successfully
    try {
      let {
        order_id,
        card_details,
        card_data,
        txn_id,
        delivery_instruction,
        payment_status,
      } = req.body;
      let obj = {
        card_details,
        card_data,
        txn_id,
        delivery_instruction,
        payment_status,
      };
      let findOrder = await OrderModel.findOne({
        where: { order_id: order_id },
        raw: true,
        // attributes: ["order_id", "user_id", "payment_status", "id"],
      });
      if (!findOrder) {
        return res.status(400).json({
          message: "Order not found",
          success: false,
          statusCode: 400,
        });
      }
      if (findOrder && findOrder?.payment_status == "complete") {
        return res.status(400).json({
          message: "Payment already made for this order",
          statusCode: 400,
          success: false,
        });
      } else {
        await OrderModel.update(obj, { where: { order_id } });
        if (payment_status == "complete") {
          await CartModel.destroy({
            where: {
              user_id: req.id,
            },
          });
        }
      }
      res.status(200).json({
        message: "Payment status update successfully",
        statusCode: 200,
        sucess: true,
        // findProduct,
      });
      findOrder.payment_status = payment_status;
      await updateOrderPaymentViaEmail(findOrder, req.userData);
      return;
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async update_order_by_network_gateway(req, res) {
    //check payment is successfully
    try {
      const { data } = await axios({
        method: "post",
        url: environmentVars.identityApiUrl,
        headers: {
          "Content-Type": "application/vnd.ni-identity.v1+json",
          Authorization: `Basic ${environmentVars.networkGatewayApiKey}`,
        },
        data: {
          grant_type: "client_credentials",
        },
      });
      const { access_token } = data;
      console.log("sss", access_token);

      const url = `${environmentVars?.updateStatusUrl}/${req.query?.refid}`;

      let config = {
        method: "get",
        url: url,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      };

      axios
        .request(config)
        .then(async (response) => {
          console.log(response?.data?._embedded?.payment?.[0], "vvv");
          if (response?.data?._embedded?.payment?.[0]?.authResponse?.success) {
            const fetch = await OrderModel.findOne({
              where: { ref_id: req.query?.refid },
              raw: true,
            });

            if (fetch) {
              const updateOrderPyment = await OrderModel.update(
                { payment_status: "complete" },
                { where: { ref_id: req.query?.refid } }
              );
              console.log(fetch?.card_data, "fetch", updateOrderPyment);

              await CartModel.destroy({
                where: {
                  user_id: req.id,
                },
              });

              return res.status(200).json({
                message: "Payment status update successfully",
                statusCode: 200,
                sucess: true,
              });
            } else {
              return res.status(404).json({
                message: "Order not found",
                success: false,
                statusCode: 404,
              });
            }
          } else {
            const updateOrderPyment = await OrderModel.update(
              { payment_status: "pending" },
              { where: { ref_id: req.query?.refid } }
            );
            console.log(fetch?.card_data, "fetchelse", updateOrderPyment);

            await CartModel.destroy({
              where: {
                user_id: req.id,
              },
            });
            return res.status(200).json({
              message: "Payment Failed",
              statusCode: 200,
              sucess: true,
            });
          }
        })
        .catch((err) => {
          return res
            .status(500)
            .json({ message: err?.message, statusCode: 500, success: false });
        });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async getAll(req, res) {
    try {
      let getAll = await OrderModel.findAll({
        where: { user_id: req.id },
        raw: true,
        order: [["created_at", "DESC"]],
      });
      let obj = {};
      const result = [...getAll];
      getAll = getAll.filter((el) => {
        if (el?.payment_method == "Cash on Delivery") {
          return el;
        } else if (
          el?.payment_method != "Cash on Delivery" &&
          el?.payment_status == "complete"
        ) {
          return el;
        }
      });
      // getAll?.forEach((order) => {
      //   order.variant_quantity.forEach((variant) => {
      //     const newOrder = { ...order, variant_quantity: [variant] };
      //     result.push(newOrder);
      //   });
      // });
      result?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      for (let el of result) {
        let getStatus = el?.status;
        if (obj[getStatus]) {
          obj[getStatus].push(el);
        } else {
          obj[getStatus] = [el];
        }
      }

      if (getAll) {
        return res.status(200).json({
          message: "Fetch data",
          // getAll,
          obj,
          allData: result,
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
      console.log(err, "erorororor order ");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async get_track_order_data(req, res) {
    console.log("req.query.order_id", req.query.order_id);

    try {
      try {
        const orderData = await axios.get(
          `http://localhost:${environmentVars?.port}/api/shipping/order/track/${req.query.order_id}`
        );

        // getAll.delivery_date = orderData?.data?.data?.deliveryDate;
        if (
          (orderData?.data?.data?.deliveryDate != null &&
            orderData?.data?.data?.deliveryDate != undefined) ||
          orderData?.data?.data?.deliveryDate != "" ||
          orderData?.data?.data?.deliveryDate != "0000-00-00"
        ) {
          const updatedDeliveryDate = await OrderModel.update(
            {
              delivery_date: orderData?.data?.data?.deliveryDate,
            },
            { where: { user_id: req.id, order_id: req.query.order_id } }
          );
        }
        if (
          orderData?.data?.data?.orderStatus != null &&
          orderData?.data?.data?.orderStatus != undefined &&
          orderData?.data?.data?.orderStatus != ""
        ) {
          const updateOrderStatus = await OrderModel.update(
            {
              status: orderData?.data?.data?.orderStatus,
            },
            { where: { user_id: req.id, order_id: req.query.order_id } }
          );
        }
      } catch (err) {
        console.log(err);
      }
      let getAll = await OrderModel.findOne({
        where: { user_id: req.id, order_id: req.query.order_id },
        raw: true,
      });
      console.log(getAll);
      if (!getAll) {
        return res.status(404).json({
          message: "Order id not found",
          success: false,
          statusCode: 404,
        });
      }
      if (getAll) {
        return res.status(200).json({
          message: "Fetch order data",
          data: getAll,

          success: true,
          statusCode: 200,
        });
      } else {
        return res.status(404).json({
          message: "Order id not found",
          success: false,
          statusCode: 404,
        });
      }
    } catch (err) {
      console.error(err?.response?.data);
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async request_return_by_user(req, res) {
    try {
      let { order_id } = req.query;
      let fetchOrderData = await OrderModel.findOne({
        where: { order_id, user_id: req.id },
        raw: true,
        attributes: ["status"],
      });
      if (!fetchOrderData) {
        return res.status(400).json({
          message: "Order not found",
          statusCode: 400,
          success: false,
        });
      } else if (fetchOrderData && fetchOrderData?.status == "delivered") {
        await OrderModel.update(
          { status: "return-request" },
          { where: { order_id } }
        );
        return res.status(200).json({
          message: "Order request submit successfully",
          statusCode: 200,
          success: true,
        });
      } else {
        return res.status(400).json({
          message: "Order request cannot be made",
          statusCode: 400,
          success: true,
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, statusCode: 500, message: err?.message });
    }
  }

  async downloadInvoice(req, res) {
    try {
      let fetchORderData = await OrderModel.findOne({
        where: { order_id: req.query.order_id, user_id: req.id },
        raw: true,
      });
      if (!fetchORderData) {
        return res.status(400).json({
          message: "Order not found",
          statusCode: 400,
          success: false,
        });
      }
      let productIdArr = [];
      let variantIdArr = [];
      let couponObj = {};
      if (fetchORderData?.coupon_id) {
        couponObj = await CouponModel.findOne({
          where: { id: fetchORderData?.coupon_id },
          raw: true,
        });
      }
      for (let el of fetchORderData?.variant_quantity) {
        productIdArr.push(el?.product_id);
        variantIdArr.push(el?.variant_id);
      }
      let filterProductDAta = await filterProduct.findOne();
      let genderArr = filterProductDAta?.gender;
      let shapeArr = filterProductDAta?.shape;
      let colorArr = filterProductDAta?.color;
      let materialArr = filterProductDAta?.material;
      let sizeArr = filterProductDAta?.size;
      let weight_group_arr = filterProductDAta?.weight_group;
      let priceArr = filterProductDAta?.price_range;
      let categoryArr = filterProductDAta?.categories;
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
      for (let el of variantData) {
        el.variant_price_details = el.variant_price_details?.filter(
          (variant) => variant?.country_code == fetchORderData?.country_code
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
      for (let el of fetchORderData?.variant_quantity) {
        el.findProductObj = productData?.find(
          (lem) => lem?.id == el?.product_id
        );
        el.variantObj = variantData?.find(
          (lem) => lem?.variant_id == el.variant_id
        );
      }
      let fetuserObj = await UserAddressModel.findOne({
        where: {
          id: fetchORderData?.address_id,
          user_id: fetchORderData?.user_id,
        },
        raw: true,
      });
      fetchORderData.userAddressObj = fetuserObj;
      fetchORderData.couponObj = couponObj;
      delete fetchORderData.coupon_id;

      let fetchTaxData = await ProductAvailability.findOne({
        where: { country_code: fetchORderData?.country_code },
        raw: true,
      });

      fetchORderData.taxData = fetchTaxData;

      if (fetchORderData?.is_student_info_id) {
        let fetchDeliveryData = await deliveryModel.findOne({ raw: true });
        let objDelivery = {};
        objDelivery.discount = fetchDeliveryData?.discount;
        // console.log(fetchDeliveryData,)
        fetchDeliveryData = fetchDeliveryData?.student_charges?.find(
          (el) => el?.country_code == fetchORderData.country_code
        );
        objDelivery = { ...objDelivery, ...fetchDeliveryData };

        fetchORderData.objDelivery = objDelivery;
      }

      let fetchOnlinePaymentData = await OnlinePaymentDiscountModel.findOne({
        where: { country_code: fetchORderData.country_code },
        raw: true,
      });
      fetchORderData.onlinePaymentData = fetchOnlinePaymentData;
      const fetDeliveryData = await OrderDeliveryDayModel?.findOne({
        where: { country_code: fetchORderData.country_code },
        raw: true,
      });
      fetchORderData.homeDeliveryData = fetDeliveryData;
      // return;
      const data = await downloadInvoice(fetchORderData);
      res.setHeader("Content-Type", "text/html");
      return res.status(200).json({ success: true, data: data });
    } catch (err) {
      console.log(err, "errr");

      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }

    // function generateInvoice() {
    //   return {
    //     invoiceNumber: "INV123",
    //     date: "2022-01-01",
    //     items: [
    //       { description: "Item 1", quantity: 2, price: 10 },
    //       { description: "Item 2", quantity: 1, price: 20 },
    //     ],
    //     total: 40,
    //   };
    // }

    // const invoiceData = generateInvoice();
    // const filePath = `${__dirname}/temp_invoice.json`;
    // // const filePath = path.join(__dirname, "temp_invoice.json");
    // try {
    //   fs.writeFileSync(filePath, JSON.stringify(invoiceData));
    //   res.download(filePath, "invoice.json", (err) => {
    //     if (err) {
    //       console.error("Error downloading invoice:", err);
    //       res.status(500).send("Internal Server Error");
    //     }

    //     // Delete the temporary file after download
    //     fs.unlinkSync(filePath);
    //   });
    // } catch (err) {
    //   return res.status(500).json({ success: false, message: err?.message });
    // }
    // return res.status(200).json({ success: true, message: "Download" });
  }

  async cancel_order_by_user(req, res) {
    try {
      let { order_id } = req.body;
      let findOrderExist = await OrderModel.findOne({
        where: { user_id: req.id, order_id },
        raw: true,
        attributes: [
          "status",
          "order_id",
          "order_date",
          "variant_quantity",
          "country_code",
          "address_id",
          "user_id",
          "delivery_date",
        ],
      });
      if (!findOrderExist) {
        return res.status(400).json({
          message: "Order not found",
          success: false,
          statusCode: 400,
        });
      } else if (findOrderExist && findOrderExist?.status == "new") {
        const orderShipmentData = await LogisticData.findOne({
          where: { order_id: order_id },
          raw: true,
        });

        if (orderShipmentData) {
          await axios.get(
            `http://localhost:${environmentVars?.port}/api/shipping/order/cancel/${orderShipmentData?.waybill}`
          );
        }
        await OrderModel.update(
          { status: "cancelled" },
          { where: { order_id } }
        );
        res.status(200).json({
          message: "Order cancelled",
          success: true,
          statusCode: 200,
        });
        let variant_id = [];
        let variant_quantity = findOrderExist?.variant_quantity;
        for (let le of variant_quantity) {
          variant_id.push(le?.variant_id);
        }
        let findProduct = await ProductVariantModel.findAll({
          where: {
            variant_id: {
              [Op.in]: variant_id,
            },
          },
          attributes: [
            "variant_price_details",
            "variant_id",
            "product_id",
            "code",
          ],
          raw: true,
        });
        let newArray = [...findProduct];
        newArray.forEach((el) => {
          let le = variant_quantity.find(
            (item) => item?.variant_id == el?.variant_id
          );
          if (le) {
            el.variant_price_details = el.variant_price_details.map((eleme) => {
              if (eleme.country_code == findOrderExist?.country_code) {
                eleme.stock += le?.quantity;
                eleme.stock = Math.max(0, eleme?.stock);
              }
              return eleme;
            });
          }
        });
        for (let el of newArray) {
          let variant_price_details = el?.variant_price_details;
          await ProductVariantModel.update(
            { variant_price_details },
            { where: { variant_id: el?.variant_id } }
          );
        }

        findOrderExist.cancelledItems = findOrderExist?.variant_quantity?.map(
          // (el) => el?.variant_name
          (el) => el
        );
        let fetchAddress = await UserAddressModel.findOne({
          where: {
            id: findOrderExist?.address_id,
            user_id: findOrderExist?.user_id,
          },
          raw: true,
        });
        const fetchCOuntryPrices = findProduct.map((el) =>
          el?.variant_price_details?.find(
            (elem) => elem?.country_code == findOrderExist?.country_code
          )
        );
        for (let le of findOrderExist?.cancelledItems) {
          let checkVariant = findProduct?.find(
            (el) =>
              el?.variant_id == le?.variant_id &&
              el?.product_id == le?.product_id
          );
          if (checkVariant) {
            le.obj = checkVariant;
          }
        }
        // console.log(findOrderExist,"&*221findOrderExist","fetchCOuntryPrices","99999",findProduct)

        //   for(let le of findProduct){
        //   for(let lee of le?.variant_price_details){

        //     console.log(lee,"leeeeeeeeeee")
        //   }
        //  }
        // let cancelledItems=[];
        // for(let el of findOrderExist?.cancelledItems){
        //   // console.log(el,"elelelelelelel")
        //   cancelledItems.push (el);
        // }

        await cancelOrder(req.userData, findOrderExist, fetchAddress);
      } else if (findOrderExist && findOrderExist?.status == "cancelled") {
        return res.status(400).json({
          message: "Order already 'cancel'",
          success: false,
          statusCode: 400,
        });
      } else {
        return res.status(400).json({
          message: "Order cannot be cancel",
          success: false,
          statusCode: 400,
        });
      }
    } catch (err) {
      // console.log(err, "EEEEEEEEEEEEEEEEEEEEEEE");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async create_payment_intent_data(req, res) {
    try {
      const { amount, currency } = req.body;
      const paymentIntent = await stripeInstance.paymentIntents.create({
        amount,
        currency,
      });
      console.log(paymentIntent, "payment intent ");
      return res.status(200).json({
        message: "Payment status",
        statusCode: 200,
        success: true,
        data: paymentIntent,
      });
    } catch (err) {
      console.log("payment intent", err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  async create_payment_network_data(req, res) {
    try {
      const { action, currencyCode, amount, orderId } = req.body;
      console.log(11110000, req.body);
      // const paymentIntent = await stripeInstance.paymentIntents.create({
      //   amount: value,
      //   currency: currencyCode,
      // });

      if (!orderId) {
        return res.status(400).json({
          success: false,
          message: "Order Id is required",
          statusCode: 400,
        });
      }
      if (action == null || action == undefined || typeof action !== "string") {
        return res.status(400).json({
          success: false,
          message: "action is required",
          statusCode: 400,
        });
      }

      if (currencyCode == null || currencyCode == undefined) {
        return res.status(400).json({
          success: false,
          message: "currency code is required",
          statusCode: 400,
        });
      }

      if (amount == null || amount == undefined) {
        return res.status(400).json({
          success: false,
          message: "Amount is required",
          statusCode: 400,
        });
      }

      if (typeof amount !== "number") {
        return res.status(400).json({
          success: false,
          message: "Amount must be a number",
          statusCode: 400,
        });
      }

      const { data } = await axios({
        method: "post",
        url: environmentVars.identityApiUrl,
        headers: {
          "Content-Type": "application/vnd.ni-identity.v1+json",
          Authorization: `Basic ${environmentVars.networkGatewayApiKey}`,
        },
        data: {
          grant_type: "client_credentials",
          // realm: REALM,
        },
      });
      const { access_token } = data;
      // console.log(
      //   access_token,
      //   "payment intent ",
      //   environmentVars.networkGatewayApiUrl
      // );

      const { data: orderData } = await axios.post(
        environmentVars.networkGatewayApiUrl,
        {
          action: "PURCHASE",
          amount: { currencyCode: `${currencyCode}`, value: `${amount}` },
          merchantAttributes: {
            redirectUrl: `${environmentVars?.live_url}redirect`,
            skipConfirmationPage: false,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`, // Note the access_token received in the previous step is passed here
            "Content-Type": "application/vnd.ni-payment.v2+json",
            Accept: "application/vnd.ni-payment.v2+json",
          },
        }
      );

      // console.log(orderData,"orderData", orderData?._embedded?.payment[0]);

      const orderDataWithToken = {
        ...orderData,
        token: access_token,
      };
      await OrderModel.update(
        {
          card_data: JSON.stringify(orderDataWithToken),
          card_details: "card data",
          payment_mode: req?.body?.payment_mode,
          ref_id: orderData?._embedded?.payment[0]?.orderReference,
        },
        { where: { order_id: orderId } }
      );

      return res.status(200).json({
        message: "Order Created",
        statusCode: 200,
        success: true,
        data: orderData,
      });
    } catch (err) {
      console.log("payment intent", err.response.data.errors);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  async cashfreeCreateOrder(req, res) {
    try {
      console.log(
        environmentVars?.cashfreeAppId,
        environmentVars?.cashfreeSecret,
        environmentVars?.cashfreeApiUrl,
        req.body
      );

      let unique_id = uuidv4();
      let data = JSON.stringify({
        order_amount: req?.body?.amount,
        order_currency: req?.body?.currency,
        order_id: unique_id,
        customer_details: {
          customer_id: req?.body?.orderId,
          customer_phone: req?.body?.phone,
        },
        order_meta: {
          return_url: `${environmentVars?.appUrl}/redirect?order_id={order_id}`,
        },
      });
      console.log(req.body, "llllllll", uuidv4(), data);

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: environmentVars?.cashfreeApiUrl,
        headers: {
          "x-client-id": environmentVars?.cashfreeAppId,
          "x-client-secret": environmentVars?.cashfreeSecret,
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-api-version": "2023-08-01",
        },
        data: data,
      };

      axios
        .request(config)
        .then(async (response) => {
          console.log(response.data, req?.body, "req?.body?.orderId");

          const updateOrderPyment = await OrderModel.update(
            {
              card_data: JSON.stringify(response.data),
              card_details: "card data",
              payment_mode: req?.body?.payment_mode,
              payment_id: unique_id,
            },

            { where: { order_id: req?.body?.orderId?.split("-")[1] } }
          );
          console.log(response?.data, "fetch11ww1", updateOrderPyment);

          return res.status(200).json({
            success: true,
            message: "Order created",
            data: response?.data,
          });
        })
        .catch((error) => {
          console.error(error, "kkkkkkkk");
          return res
            .status(500)
            .json({ success: true, message: error?.message });
        });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: err?.message });
    }
  }
  async cashfreeCheckOrder(req, res) {
    try {
      const { orderId } = req.params;
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `https://sandbox.cashfree.com/pg/orders/${orderId}/payments`,
        // url: `https://api.cashfree.com/pg/orders/${orderId}/payments`,
        headers: {
          "x-client-id": environmentVars?.cashfreeAppId,
          "x-client-secret": environmentVars?.cashfreeSecret,
          Accept: "application/json",
          "x-api-version": "2023-08-01",
        },
      };

      axios
        .request(config)
        .then(async (response) => {
          if (response?.data && response?.data.length > 0) {
            console.log(response?.data[0]?.payment_status, orderId, "orderId");

            if (response?.data[0]?.payment_status == "SUCCESS") {
              const fetch = await OrderModel.findOne({
                where: { payment_id: orderId },
                raw: true,
              });
              const userData = await UserModel.findOne({
                where: { id: fetch.user_id },
                raw: true,
              });
              const addressData = await UserAddressModel.findOne({
                where: { id: fetch.address_id },
                raw: true,
              });
              let productArray = fetch?.variant_quantity;
              try {
                let data = {
                  orderId: fetch.order_id,
                  orderDate: getCurrentDateTime(),
                  totalAmount: fetch.sub_total,
                  customerName: userData.name,
                  address: addressData.address,
                  pincode: addressData.zipcode,
                  city: addressData.city,
                  state: addressData.state,
                  country: addressData.country,
                  phone: addressData.mobile.split("-")[1],
                  email: userData.email,
                  productArray: productArray,
                  subTotal: fetch?.sub_total,
                  is_student: fetch?.is_student_info_id,
                  shippingLength: "10",
                  shippingWidth: "10",
                  shippingHeight: "10",
                  weight: "0.3",
                  shippingCharge: fetch?.delivery_charges,
                  totalDiscount: "0",
                  codAmount: fetch.sub_total,
                  paymentMode: "prepaid",
                  storeId: "16361",
                };
                let config = {
                  method: "post",
                  url: `http://localhost:${environmentVars?.port}/api/shipping/order/create`,
                  data: data,
                };
                const logisticData = await axios.request(config);
                let logisticDataDB = new LogisticData({
                  status: logisticData?.data?.data?.status,
                  order_id: fetch.order_id,
                  html_message: logisticData?.data?.data?.html_message,
                  remark: logisticData?.data.data.data["1"].remark,
                  waybill: logisticData?.data.data.data["1"].waybill,
                  refnum: logisticData?.data.data.data["1"].refnum,
                  logistic_name:
                    logisticData?.data.data.data["1"].logistic_name,
                });
                await logisticDataDB.save();
              } catch (err) {
                console.log(err, "order create api logistic");
              }

              console.log("444444444444", fetch);
              if (fetch) {
                const updateOrderPyment = await OrderModel.update(
                  { payment_status: "complete" },
                  { where: { payment_id: orderId } }
                );
                console.log(fetch?.card_data, "fetch111", updateOrderPyment);

                await CartModel.destroy({
                  where: {
                    user_id: req.id,
                  },
                });
                let findOrder = await OrderModel.findOne({
                  where: { payment_id: orderId },
                  raw: true,
                  // attributes: ["order_id", "user_id", "payment_status", "id"],
                });

                let couponObj = {};
                if (findOrder?.coupon_id) {
                  couponObj = await CouponModel.findOne({
                    where: { id: findOrder?.coupon_id },
                    raw: true,
                  });
                }
                let fetchTaxData = await ProductAvailability.findOne({
                  where: { country_code: findOrder?.country_code },
                  raw: true,
                });
                let fetchOnlinePaymentData = await OnlinePaymentDiscountModel.findOne({
                  where: { country_code: findOrder?.country_code },
                  raw: true,
                });

                
                let filterProductDAta = await filterProduct.findOne();
                let genderArr = filterProductDAta?.gender;
                let shapeArr = filterProductDAta?.shape;
                let colorArr = filterProductDAta?.color;
                let materialArr = filterProductDAta?.material;
                let sizeArr = filterProductDAta?.size;
                let weight_group_arr = filterProductDAta?.weight_group;
                let priceArr = filterProductDAta?.price_range;
                let categoryArr = filterProductDAta?.categories;
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
                  le.cat_name = categoryArr?.find(
                    (el) => el?.id == le?.cat_id
                  )?.value;
                  le.material_name = materialArr?.find(
                    (el) => el?.id == le?.material_id
                  )?.value;
                  le.shape_name = shapeArr?.find(
                    (el) => el?.id == le?.shape_id
                  )?.value;
                }

                for (let el of findOrder?.variant_quantity) {
                  el.findProductObj = productData?.find(
                    (lem) => lem?.id == el?.product_id
                  );
                  el.variantObj = variantData?.find(
                    (lem) => lem?.variant_id == el.variant_id
                  );
                }

                let fetuserObj = await UserAddressModel.findOne({
                  where: {
                    id: findOrder?.address_id,
                    user_id: findOrder?.user_id,
                  },
                  raw: true,
                });
                findOrder.userAddressObj = fetuserObj;
                findOrder.couponObj = couponObj;
          
    
          
                findOrder.taxData = fetchTaxData;

                if (findOrder?.is_student_info_id) {
                  let fetchDeliveryData = await deliveryModel.findOne({ raw: true });
                  let objDelivery = {};
                  objDelivery.discount = fetchDeliveryData?.discount;
                  // console.log(fetchDeliveryData,)
                  fetchDeliveryData = fetchDeliveryData?.student_charges?.find(
                    (el) => el?.country_code == findOrder.country_code
                  );
                  objDelivery = { ...objDelivery, ...fetchDeliveryData };
          
                  obj.objDelivery = objDelivery;
                }
                const fetDeliveryData = await OrderDeliveryDayModel?.findOne({
                  where: { country_code: findOrder.country_code },
                  raw: true,
                });
                findOrder.homeDeliveryData = fetDeliveryData;
                findOrder.onlinePaymentData = fetchOnlinePaymentData;
                findOrder.couponObj = couponObj;
                findOrder.addressData = addressData;
                findOrder.fetchTaxData = fetchTaxData;

                await orderPlaceViaEmail(findOrder, req.userData);

                return res.status(200).json({
                  message: "Payment status update successfully",
                  statusCode: 200,
                  success: true,
                  flag: 1,
                });
              } else {
                return res.status(404).json({
                  message: "Order not found",
                  success: false,
                  statusCode: 404,
                });
              }
            } else {
              const updateOrderPyment = await OrderModel.update(
                { payment_status: "pending" },
                { where: { payment_id: orderId } }
              );
              console.log(orderId, "fetchelse", updateOrderPyment);

              await CartModel.destroy({
                where: {
                  user_id: req.id,
                },
              });
              return res.status(200).json({
                message: "Payment Failed",
                statusCode: 200,
                sucess: true,
                flag: 0,
              });
            }
          }
        })
        .catch((error) => {
          console.log(error);
          return res.status(401).json({
            success: false,
            message: error?.response?.data?.message,
          });
        });
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message });
    }
  }
}
const getCurrentDateTime = () => {
  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, "0");
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const year = currentDate.getFullYear();

  const formattedDate = `${day}-${month}-${year}`;
  console.log(formattedDate);
  return formattedDate;
};
const OrderServicesObj = new OrderServices();
export default OrderServicesObj;
