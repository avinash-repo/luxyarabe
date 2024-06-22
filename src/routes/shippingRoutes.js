import axios from "axios";
import Dotenv from "dotenv";
import Joi from "joi";
import express, { response } from "express";
import ProductVariantModel from "../models/ProductVariantModel.js";
import ProductModel from "../models/ProductModel.js";
import LogisticData from "../models/LogisticDataModel.js";
import OrderModel from "../models/OrderModel.js";
import ShipmentData from "../models/ShipmentDataModel.js";
import { ValidationOrderIdSchema } from "../helpers/validateOrder.js";
Dotenv.config();
const Router = express.Router();
const accessToken = process.env.SHIPPING_ACCESS_TOKEN;
const secretKey = process.env.SHIPPING_SECRET_KEY;
const pickupAddress = process.env.SHIPPING_PICKUP_ADDRESS;
const apiUrl = process.env.SHIPPING_API_URL;
const goSwiftUrl = process.env.SHIPPING_API_GOSWIFT_URL;
const goSwiftClientId = process.env.SHIPPING_API_GOSWIFT_CLIENT_ID;
const goSwiftUser = process.env.SHIPPING_API_GOSWIFT_USERNAME;
const goSwiftPass = process.env.SHIPPING_API_GOSWIFT_PASS;

Router.post("/order/create", async (req, res) => {
  try {
    const {
      from,
      orderId,
      orderDate,
      totalAmount,
      customerName,
      address,
      pincode,
      city,
      state,
      country,
      phone,
      email,
      productName,
      productSKU,
      productQuantity,
      productPrice,
      productHSNCode,
      productDiscount,
      shippingLength,
      shippingWidth,
      shippingHeight,
      weight,
      shippingCharge,
      is_student,
      totalDiscount,
      subTotal,
      codAmount,
      paymentMode,
      storeId,
      productArray,
      quantity,
    } = req.body;
    console.log(
      ".......................................",
      req.body,
      "......................................."
    );
    let productDataArray = [];
    let totalPriceProduct = 0;
    let shipmentData = await ShipmentData.findOne({
      where: { product_num: 1 },
      raw: true,
    });
    let prodQuantity = productArray.length;
    try {
      for (let val of productArray) {
        let productObj = {};
        let productVariantDBData = await ProductVariantModel.findOne({
          where: { variant_id: val.variant_id },
          raw: true,
        });
        let productDBData = await ProductModel.findOne({
          where: { id: productVariantDBData.product_id },
        });

        let productPriceData = productVariantDBData.variant_price_details;
        // console.log(productVariantDBData, productPriceData, "..,,.//.,,");
        let filterPriceDetails = productPriceData.filter(
          (val) =>
            val.country == "india" ||
            val.country == "India" ||
            val.country == "INDIA"
        );
        // console.log(
        //   "(((((((((((((((((((((((((((",
        //   filterPriceDetails,
        //   ")))))))))))))))))))))))))"
        // );
        productObj.product_name = productDBData.title;
        productObj.product_sku = productDBData.sku;
        productObj.product_quantity = val.quantity;
        let productPrice =
          Number(filterPriceDetails[0]?.price) -
          parseFloat(
            Number(filterPriceDetails[0]?.discount / 100) *
              Number(filterPriceDetails[0]?.price)
          ).toFixed(2);
        productObj.product_price = productPrice;
        totalPriceProduct += Number(val.quantity) * Number(productPrice);
        productObj.product_tax_rate = "0";
        productObj.product_hsn_code = "";
        productObj.product_discount = "0";
        productDataArray.push(productObj);

        // product_name: "Green color tshirt",
        // product_sku: "GC001-1",
        // product_quantity: "1",
        // product_price: "100",
        // product_tax_rate: "5",
        // product_hsn_code: "91308",
        // product_discount: "0"
      }
    } catch (err) {
      console.log(err);
    }
    // console.log(totalPriceProduct, is_student, "totalpriceproduct");
    let data = {
      data: {
        shipments: [
          {
            waybill: "",
            order: orderId,
            sub_order: "",
            order_date: orderDate,
            total_amount:
              is_student == 0
                ? parseFloat(Number(subTotal) + Number(shippingCharge)).toFixed(
                    2
                  )
                : parseFloat(Number(totalPriceProduct) + 200).toFixed(2),
            name: customerName,
            company_name: "Vuezen",
            add: address,
            add2: "",
            add3: "",
            pin: pincode,
            city: city,
            state: state,
            country: country,
            phone: phone,
            alt_phone: "",
            email: email,
            is_billing_same_as_shipping: "yes",
            billing_name: customerName,
            billing_company_name: "Vuezen",
            billing_add: address,
            billing_add2: "",
            billing_add3: "",
            billing_pin: pincode,
            billing_city: city,
            billing_state: state,
            billing_country: country,
            billing_phone: phone,
            billing_alt_phone: "",
            billing_email: email,
            products: productDataArray,
            shipment_length: shipmentData?.shipment_length,
            shipment_width: shipmentData?.shipment_width,
            shipment_height: shipmentData?.shipment_height,
            weight: shipmentData?.shipment_weight * prodQuantity,
            shipping_charges: shippingCharge,
            giftwrap_charges: "0",
            transaction_charges: "0",
            total_discount:
              is_student == 0
                ? parseFloat(
                    Number(totalPriceProduct) - Number(subTotal)
                  ).toFixed(2)
                : parseFloat(totalPriceProduct).toFixed(2),
            first_attemp_discount: "0",
            cod_charges: "0",
            advance_amount: "0",
            cod_amount:
              paymentMode == "cod"
                ? is_student == 0
                  ? parseFloat(
                      Number(subTotal) + Number(shippingCharge)
                    ).toFixed(2)
                  : 200
                : "0",
            payment_mode: paymentMode,
            reseller_name: "",
            eway_bill_number: "",
            gst_number: "",
            return_address_id: pickupAddress,
          },
        ],
        pickup_address_id: pickupAddress,
        access_token: accessToken,
        secret_key: secretKey,
        logistics: "Delhivery",
        s_type: "",
        order_type: "",
        store_id: storeId,
      },
    };

    console.log(
      ".....................................",
      data?.data?.shipments,
      "...................................."
    );
    let config = {
      method: "post",
      url: `${apiUrl}/api_v3/order/add.json`,
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        // console.log(
        //   "=======================================",
        //   response?.data,
        //   "----------------------------------------------------------"
        // );
        if (response.data.status == "success") {
          // console.log(response?.data?.data["1"]?.waybill);
          if (response?.data?.data["1"]?.waybill) {
            let waybillNumber = response?.data?.data["1"]?.waybill;
            let data = {
              data: {
                awb_number_list: waybillNumber,
                access_token: accessToken,
                secret_key: secretKey,
              },
            };
            let config = {
              method: "post",

              url: `https://api.ithinklogistics.com/api_v3/order/track.json`,
              data: data,
            };
            axios
              .request(config)
              .then(async (response) => {
                if (response?.data?.status_code == 200) {
                  let orderStatus;
                  let deliveryDate =
                    response?.data?.data[`${waybillNumber}`]?.order_date_time
                      ?.expected_delivery_date;
                  if (
                    response?.data?.data[`${waybillNumber}`]?.current_status ==
                      "Manifested" ||
                    response?.data?.data[`${waybillNumber}`]?.current_status ==
                      "Not Picked"
                  ) {
                    orderStatus = "new";
                  } else if (
                    response?.data?.data[`${waybillNumber}`]?.current_status ==
                      "Picked Up" ||
                    response?.data?.data[`${waybillNumber}`]?.current_status ==
                      "In Transit"
                  ) {
                    orderStatus = "processing";
                  } else if (
                    response?.data?.data[`${waybillNumber}`]?.current_status ==
                      "Reached At Destination" ||
                    response?.data?.data[`${waybillNumber}`]?.current_status ==
                      "Out For Delivery" ||
                    response?.data?.data[`${waybillNumber}`]?.current_status ==
                      "Out of Delivery Area"
                  ) {
                    orderStatus = "outfordelivery";
                  } else if (
                    response?.data?.data[`${waybillNumber}`]?.current_status ==
                    "Delivered"
                  ) {
                    orderStatus = "delivered";
                  } else {
                    orderStatus = "";
                  }
                  let updateObj = {};
                  if (deliveryDate != "" || deliveryDate != "0000-00-00") {
                    updateObj.delivery_date = deliveryDate;
                  }
                  updateObj.status = orderStatus;
                  await OrderModel.update(updateObj, {
                    where: { order_id: orderId },
                  });
                }
              })
              .catch((error) => {
                console.log(error, "error in track inside order");
              });
          }
          return res.status(200).json({
            success: true,
            message: "Order created",
            data: response?.data,
          });
        } else if (response.data.status == "error") {
          console.log(response);
          return res.status(200).json({
            success: false,
            message: "Order not created",
            data: response?.data,
          });
        } else {
          console.log(response);
          return res
            .status(500)
            .json({ success: false, message: "Unable to create order" });
        }
      })
      .catch((error) => {
        console.log(error, "..............................................");
      });
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message });
  }
});
Router.get("/check_availability/:pincode", async (req, res) => {
  try {
    const { pincode } = req.params;
    let pinc = Number(pincode);
    console.log(
      typeof pincode,
      typeof pinc,
      ".................................................."
    );
    let data = {
      data: {
        pincode: pinc,
        access_token: accessToken,
        secret_key: secretKey,
      },
    };
    let config = {
      method: "post",
      url: `${apiUrl}/api_v3/pincode/check.json`,
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(response.data?.status);

        // console.log(response.data.data[`${pincode}`]);
        // console.log(response.data.data[`${pincode}`].Delhivery);
        if (response?.data?.status == "success") {
          if (response?.data?.data[`${pincode}`]?.Amazon?.prepaid == "Y") {
            return res
              .status(200)
              .json({ success: true, message: "Delivery available" });
          } else if (
            response?.data?.data[`${pincode}`]?.Amazon?.prepaid == "N"
          ) {
            return res.status(200).json({
              success: false,
              message: "Delivery not available to this location",
            });
          } else {
            return res.status(200).json({
              success: false,
              message: "Delivery not available to this location",
            });
          }
        } else {
          return res.status(200).json({
            success: false,
            message: response?.data?.message,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({ success: false, data: error?.message });
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err?.message });
  }
});
Router.get("/order/track/:awb", async (req, res) => {
  try {
    const { awb } = req.params;
    const logisticData = await LogisticData.findOne({
      where: { order_id: awb },
      raw: true,
    });
    if (!logisticData) {
      return res
        .status(200)
        .json({ success: false, message: "Data not found for given order id" });
    }

    let data = {
      data: {
        awb_number_list: logisticData?.waybill,
        access_token: accessToken,
        secret_key: secretKey,
      },
    };
    let config = {
      method: "post",

      url: `https://api.ithinklogistics.com/api_v3/order/track.json`,
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(
          response?.data,
          "//./././................./////////////////////"
        );
        if (response?.data?.status_code == 200) {
          // console.log(response?.data?.data["901234567109"]?.current_status);
          // console.log(
          //   response?.data?.data["901234567109"]?.order_date_time
          //     ?.expected_delivery_date
          // );

          let orderStatus;
          let deliveryDate =
            response?.data?.data[`${logisticData?.waybill}`]?.order_date_time
              ?.expected_delivery_date;
          if (
            response?.data?.data[`${logisticData?.waybill}`]?.current_status ==
              "Manifested" ||
            response?.data?.data[`${logisticData?.waybill}`]?.current_status ==
              "Not Picked"
          ) {
            orderStatus = "new";
          } else if (
            response?.data?.data[`${logisticData?.waybill}`]?.current_status ==
              "Picked Up" ||
            response?.data?.data[`${logisticData?.waybill}`]?.current_status ==
              "In Transit"
          ) {
            orderStatus = "processing";
          } else if (
            response?.data?.data[`${logisticData?.waybill}`]?.current_status ==
              "Reached At Destination" ||
            response?.data?.data[`${logisticData?.waybill}`]?.current_status ==
              "Out For Delivery" ||
            response?.data?.data[`${logisticData?.waybill}`]?.current_status ==
              "Out of Delivery Area"
          ) {
            orderStatus = "outfordelivery";
          } else if (
            response?.data?.data[`${logisticData?.waybill}`]?.current_status ==
            "Delivered"
          ) {
            orderStatus = "delivered";
          } else {
            orderStatus = "";
          }

          return res
            .status(200)
            .json({ success: true, data: { orderStatus, deliveryDate } });
        } else {
          return res.status(500).json({
            success: false,
            message: "Unable to track order, check your awb number",
          });
        }
      })
      .catch((error) => {
        return res.status(500).json({ success: false, data: error });
      });
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message });
  }
});

Router.get("/order/cancel/:awb", async (req, res) => {
  try {
    const { awb } = req.params;
    let data = {
      data: {
        access_token: accessToken,
        secret_key: secretKey,
        awb_numbers: awb,
      },
    };
    let config = {
      method: "post",
      url: `${apiUrl}/api_v3/order/cancel.json`,
      data: data,
    };
    axios
      .request(config)
      .then((response) => {
        if (response?.data?.status == "error") {
          console.log(response, "error cancel ,,,,,,,,,,,,,,,,,,,,");
          return res
            .status(200)
            .json({ success: false, message: response?.data?.html_message });
        } else if (response?.data?.status == "success") {
          return res
            .status(200)
            .json({ success: true, message: "Order cancelled" });
        } else {
          console.log(response, "error cancel ,,,,,,,,,,,,,,,,,,,,");
          return res.status(200).json({
            success: false,
            message: "unable to cancel order, check your awb number",
          });
        }
      })
      .catch((error) => {
        console.log(response, "error cancel ,,,,,,,,,,,,,,,,,,,,");

        return res
          .status(200)
          .json({ success: false, message: error?.message });
      });
  } catch (err) {
    console.log(response, "error cancel ,,,,,,,,,,,,,,,,,,,,");

    return res.status(200).json({ success: false, message: err?.message });
  }
});

Router.post("/delivery/rate", async (req, res) => {
  try {
    const {
      fromPincode,
      toPincode,
      shippingLength,
      shippingWidth,
      shippingHeight,
      shippingWeight,
      orderType,
      paymentMethod,
      productMRP,
      quantity,
    } = req.body;
    let shipmentData = await ShipmentData.findOne({
      where: { product_num: 1 },
      raw: true,
    });

    let data = {
      data: {
        from_pincode: fromPincode,
        to_pincode: toPincode,
        shipping_length_cms: shipmentData?.shipment_length,
        shipping_width_cms: shipmentData?.shipment_width,
        shipping_height_cms: shipmentData?.shipment_height,
        shipping_weight_kg: shipmentData?.shipment_weight * quantity,
        order_type: orderType,
        payment_method: paymentMethod,
        product_mrp: productMRP,
        access_token: accessToken,
        secret_key: secretKey,
      },
    };
    let config = {
      method: "post",

      url: `${apiUrl}/api_v3/rate/check.json`,
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(
        //   response.data,
        //   accessToken,
        //   secretKey,
        //   pickupAddress,
        //   apiUrl
        // );
        if (response.data.status == "success") {
          //   console.log(response?.data?.data);

          const filteredData = response.data.data.filter(
            (val) => val.logistic_name == "Amazon" && val.weight_slab == "0.50"
          );

          return res
            .status(200)
            .json({ success: true, data: filteredData[0]?.rate });
        } else {
          return res.status(500).json({
            success: false,
            message: "unable to find delivery charges",
          });
        }
      })
      .catch((error) => {
        console.log(error, "error");
        return res.status(500).json({ success: false, data: error });
      });
  } catch (err) {
    console.log(err, "err");
    return res.status(500).json({ success: false, message: err?.message });
  }
});

Router.get("/download/invoice/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    let { error } = ValidationOrderIdSchema.validate(req.params);
    if (error) {
      return res.status(400).json({
        message: error.details[0]?.message,
        success: false,
        statusCode: 400,
      });
    }
    let orderData = await LogisticData.findOne({
      where: { order_id: orderId },
      raw: true,
    });
    if (orderData) {
      let data = {
        data: {
          awb_numbers: orderData?.waybill,
          access_token: accessToken,
          secret_key: secretKey,
        },
      };
      let config = {
        method: "post",
        url: `${apiUrl}/api_v3/shipping/invoice.json`,
        data: data,
      };
      axios
        .request(config)
        .then((response) => {
          console.log(response?.data);
          if (response?.data?.status == "success") {
            return res
              .status(200)
              .json({ success: true, data: response?.data });
          } else {
            return res
              .status(500)
              .json({ success: false, message: "Something went wrong" });
          }
        })
        .catch((error) => {
          return res
            .status(500)
            .json({ success: false, message: "Something went wrong" });
        });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Order Data not found" });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message });
  }
});
Router.get("/download/manifest/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    let { error } = ValidationOrderIdSchema.validate(req.params);
    if (error) {
      return res.status(400).json({
        message: error.details[0]?.message,
        success: false,
        statusCode: 400,
      });
    }
    let orderData = await LogisticData.findOne({
      where: { order_id: orderId },
      raw: true,
    });
    if (orderData) {
      let data = {
        data: {
          awb_numbers: orderData?.waybill,
          access_token: accessToken,
          secret_key: secretKey,
        },
      };
      let config = {
        method: "post",
        url: `${apiUrl}/api_v3/shipping/manifest.json`,
        data: data,
      };
      axios
        .request(config)
        .then((response) => {
          console.log(response?.data);
          if (response?.data?.status == "success") {
            return res
              .status(200)
              .json({ success: true, data: response?.data });
          } else {
            return res
              .status(500)
              .json({ success: false, message: "Something went wrong" });
          }
        })
        .catch((error) => {
          return res
            .status(500)
            .json({ success: false, message: "Something went wrong" });
        });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Order Data not found" });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message });
  }
});
Router.get("/download/label/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    let { error } = ValidationOrderIdSchema.validate(req.params);
    if (error) {
      return res.status(400).json({
        message: error.details[0]?.message,
        success: false,
        statusCode: 400,
      });
    }
    let orderData = await LogisticData.findOne({
      where: { order_id: orderId },
      raw: true,
    });
    if (orderData) {
      //   {
      //     "data": {
      //         "awb_numbers": "24562011921894",
      //         "page_size": "A4",
      //         "access_token": "613a2f3482b8d9017215f60d0fd50834",
      //         "secret_key": "ca931b407ca0fd49ebdda2f2501c7420",
      //         "display_cod_prepaid": "1",
      //         "display_shipper_mobile": "",
      //         "display_shipper_address": ""
      //     }
      // }
      let data = {
        data: {
          awb_numbers: orderData?.waybill,
          page_size: "A4",
          access_token: accessToken,
          secret_key: secretKey,
          display_cod_prepaid: "1",
          display_shipper_mobile: "",
          display_shipper_address: "",
        },
      };
      let config = {
        method: "post",
        url: `${apiUrl}/api_v3/shipping/label.json`,
        data: data,
      };
      axios
        .request(config)
        .then((response) => {
          console.log(response?.data);
          if (response?.data?.status == "success") {
            return res
              .status(200)
              .json({ success: true, data: response?.data });
          } else {
            return res
              .status(500)
              .json({ success: false, message: "Something went wrong" });
          }
        })
        .catch((error) => {
          return res
            .status(500)
            .json({ success: false, message: "Something went wrong" });
        });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Order Data not found" });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message });
  }
});
Router.post("/token", async (req, res) => {
  try {
    let data = JSON.stringify({
      username: goSwiftUser,
      password: goSwiftPass,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${goSwiftUrl}/integrations/v2/auth/token/${goSwiftClientId}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data.access_token) {
          return res
            .status(200)
            .json({ success: true, message: response.data });
        } else {
          return res
            .status(500)
            .json({ success: false, message: response.data.message });
        }
      })
      .catch((error) => {
        console.log(error);
        return res
          .status(500)
          .json({ success: false, message: "Something went wrong" });
      });
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message });
  }
});
Router.post("/go/create/order", async (req, res) => {
  try {
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message });
  }
});
export default Router;
