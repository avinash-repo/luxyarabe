import BestSellerModel from "../../models/BestSellerModel.js";
import { Op } from "sequelize";
import { environmentVars } from "../../config/environmentVar.js";
import filterProduct from "../../models/filterDataModel.js";
import ProductModel from "../../models/ProductModel.js";
import ProductVariantModel from "../../models/ProductVariantModel.js";
import dbConnection from "../../config/dbConfig.js";
import OrderModel from "../../models/OrderModel.js";
import UserModel from "../../models/UserModel.js";
import { google } from "googleapis";
import axios from "axios";
import querystring from "querystring";

class DashboardDataServices {
  async getDashboardData(req, res) {
    try {
      let from_date = req.query.from_date;
      let to_date = req.query.to_date;
      // console.log(req.query,"req.queryyyyyyyyyyyyyyyyyyyyyyyy")

      const query = `
      SELECT
        DATE_FORMAT(CURDATE(), '%Y-%m-%d') as report_date,
        (
          SELECT COUNT(*) FROM users
          WHERE status = 'active'
        ) as active_user_count,
        (
          SELECT COUNT(*) FROM users
          WHERE status = 'inactive'
        ) as inactive_user_count,
        (
          SELECT COUNT(*) FROM orders
          ${
            from_date && to_date
              ? `WHERE status = 'new' AND created_at BETWEEN '${from_date}' AND '${to_date}'`
              : `WHERE status = 'new'`
          }
        ) as new_order_count,
        (
          SELECT COUNT(*) FROM orders
          ${
            from_date && to_date
              ? `WHERE status = 'processing' AND created_at BETWEEN '${from_date}' AND '${to_date}'`
              : `WHERE status = 'processing'`
          }
        ) as processing_order_count,
        (
          SELECT COUNT(*) FROM orders
          ${
            from_date && to_date
              ? `WHERE status = 'cancelled' AND created_at BETWEEN '${from_date}' AND '${to_date}'`
              : `WHERE status = 'cancelled'`
          }
        ) as cancelled_order_count;
    `;

      let result = await dbConnection.query(query, {
        type: dbConnection.QueryTypes.SELECT,
        raw: true,
      });

      // for (let el of result) {
      //   if (req.query && req.query.country_code !== "") {
      //     let filterData = el?.variant_price_details.filter(
      //       (detail) => detail?.country_code === req?.query?.country_code
      //     );
      //     el.variant_price_details = filterData;
      //   }
      // }
      // result=result?.filter((el)=>el?.status=='active')
      return res.status(200).json({
        message: "fetch data",
        data: result,
        statusCode: 200,
        success: true,
      });
    } catch (err) {
      console.log(err, "errrrrororrr get dashboard data");
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async get_order_variant_count_data(req, res) {
    try {
      let country_code = req.query.country_code;
      const query = `
      SELECT
        (
          SELECT COUNT(*) FROM orders
          WHERE status = 'new' ${
            country_code ? `AND country_code = '${country_code}'` : ""
          }
        ) as new_order_count,
        (
          SELECT COUNT(*) FROM orders
          WHERE status = 'cancelled' ${
            country_code ? `AND country_code = '${country_code}'` : ""
          }
        ) as cancelled_order_count
    `;
      let result = await dbConnection.query(query, {
        type: dbConnection.QueryTypes.SELECT,
        raw: true,
      });
      let data = result[0];

      const query2 = `
            SELECT pv.variant_price_details
              FROM product_variants pv
      `;

      let result2 = await dbConnection.query(query2, {
        type: dbConnection.QueryTypes.SELECT,
        raw: true,
      });
      let productCount = 0;
      for (let le of result2) {
        let filterData = le?.variant_price_details;
        if (country_code) {
          filterData = le?.variant_price_details?.filter(
            (dat) => dat?.country_code == country_code
          );
        }
        let stockZero = false;
        // console.log(filterData, "filterdatatttat");
        if (filterData?.length) {
          for (let i = 0; i < filterData?.length; i++) {
            // if(filterData[i]?.status!=)
            if (
              filterData[i]?.status == "active" &&
              filterData[i]?.stock != "undefined" &&
              filterData[i]?.stock == 0
            ) {
              stockZero = true;
            }
          }
          if (stockZero) {
            // console.log(stockZero, "stockzertoo", "asdf");
            productCount = productCount + 1;
          }
        }
      }
      data.productOutOfStockCount = productCount;
      return res.status(200).json({
        message: "Fetch data",
        data: data,
        success: true,
        statusCode: 200,
      });
    } catch (err) {
      console.log(err, "erorororor");
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async getUserData(req, res, filtersData) {
    try {
      let country_code = req.query.country_code;
      let fromDate = filtersData?.fromDate;
      let toDate = filtersData?.toDate;

      // console.log(fromDate, "fromdate", toDate, "todatetetet");
      let query = `
          SELECT COUNT(*) as user_count FROM users
          ${country_code ? `WHERE country = '${country_code}'` : ""}
          ${
            fromDate && toDate
              ? `AND created_at >= '${fromDate}' AND created_at <= '${toDate}'`
              : ""
          }  AND status = 'active'
      `;
      let result = await dbConnection.query(query, {
        type: dbConnection.QueryTypes.SELECT,
        raw: true,
      });
      let data = result[0];
      let userData = [];
      // if (country_code) {
      //   userData = await UserModel.findAll({
      //     where: {
      //       country: country_code,
      //       status: "active", //need as of now
      //       created_at: {
      //         [Op.between]: [fromDate, toDate],
      //       },
      //     },
      //     raw: true,
      //     attributes: ["created_at", "id", "name", "country"],
      //     // order: [["created_at", "DESC"]],
      //   });
      // } else

      if ((fromDate, toDate)) {
        userData = await UserModel.findAll({
          where: {
            country: country_code,
            status: "active", //need as of now
            created_at: {
              [Op.between]: [fromDate, toDate],
            },
          },
          raw: true,
          attributes: ["created_at", "id", "name", "country"],
          // order: [["created_at", "DESC"]],
        });
      } else {
        userData = await UserModel.findAll({
          where: {
            status: "active", //need as of now
          },
          raw: true,
          attributes: ["created_at", "id", "name", "country"],
          // order: [["created_at", "DESC"]],
        });
      }
      let tempArr = [];
      for (let el of userData) {
        let object = {};
        let date = new Date(el?.created_at);
        const formattedDate = date.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        });

        // if (object[formattedDate]) {
        //   object[formattedDate] = object[formattedDate] + 1;
        // } else {
        //   object[formattedDate] = 1;
        // }
        let existingDateIndex = tempArr.findIndex(
          (obj) => obj.date === formattedDate
        );
        if (existingDateIndex !== -1) {
          // If date exists, increment its value
          tempArr[existingDateIndex].value++;
        } else {
          // If date doesn't exist, add it to the array with value 1
          tempArr.push({ date: formattedDate, value: 1 });
        }
        // tempArr.push(object);
      }
      return res.status(200).json({
        message: "Fetch data",
        userData: tempArr,
        // object,
        data: data,
        // userData,
        success: true,
      });
    } catch (err) {
      console.log(err, "erorororor");
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async getBestSellerProductWithDetails(req, res, filterData) {
    try {
      let fromDate = filterData?.fromDate;
      let toDate = filterData?.toDate;
      let country_code = req.query.country_code;
      let fethOrderData = [];
      let status = "delivered";
      let query = `
      SELECT SUM(qty) AS total_quantity
      FROM orders, JSON_TABLE(variant_quantity, "$[*]" COLUMNS (
        qty INT PATH "$.quantity"
      )) AS jt
      WHERE status = 'delivered'AND country_code = :country_code
    `;
      let result = await dbConnection.query(query, {
        replacements: { country_code: country_code },
        type: dbConnection.QueryTypes.SELECT,
        // raw: true,
      });

      // console.log(result, "reslttttttttttt");
      if (fromDate && toDate) {
        fethOrderData = await OrderModel.findAll({
          where: {
            country_code: country_code,
            status,
            created_at: {
              [Op.between]: [fromDate, toDate],
            },
          },
          raw: true,
          attributes: [
            "variant_quantity",
            "sub_total",
            "delivery_charges",
            "payment_status",
            "status",
            "country_code",
            "created_at",
          ],
        });
      } else {
        fethOrderData = await OrderModel.findAll({
          where: {
            country_code: country_code,
            status,
          },
          raw: true,
          attributes: [
            "variant_quantity",
            "sub_total",
            "delivery_charges",
            "payment_status",
            "status",
            "country_code",
            "created_at",
          ],
        });
      }
      let productObj = {};
      let variantObj = {};
      let tempProduct = [];

      for (let el of fethOrderData) {
        for (let elem of el.variant_quantity) {
          if (productObj[elem?.product_id]) {
            productObj[elem?.product_id] = productObj[elem?.product_id] + 1;
          } else {
            productObj[elem?.product_id] = 1;
          }
          if (variantObj[elem?.variant_id]) {
            variantObj[elem?.variant_id] = variantObj[elem?.variant_id] + 1;
          } else {
            variantObj[elem?.variant_id] = 1;
          }

          const existingProductIndex = tempProduct.findIndex(
            (item) => item.product_id === elem.product_id
          );

          if (existingProductIndex !== -1) {
            // If the product already exists in tempProduct, update its quantity and orderCount
            tempProduct[existingProductIndex].quantity += elem.quantity;
            tempProduct[existingProductIndex].orderCount++;
          } else {
            // If the product doesn't exist in tempProduct, add it
            tempProduct.push({
              product_id: elem.product_id,
              quantity: elem.quantity,
              orderCount: 1,
            });
          }
        }
      }
      tempProduct = tempProduct?.sort((a, b) => b.quantity - a.quantity);

      let productIdArr = Object.keys(productObj); ///dsicouss
      let variantIdArr = Object.keys(variantObj);
      if (req.query.limit) {
        tempProduct = tempProduct.slice(0, parseInt(req.query.limit));
        productIdArr = productIdArr.slice(0, parseInt(req.query.limit));
        variantIdArr = variantIdArr.slice(0, parseInt(req.query.limit));
      }
      productIdArr = [];
      for (let el of tempProduct) {
        productIdArr.push(el?.product_id);
      }
      let productArr = await ProductModel.findAll({
        where: { id: productIdArr },
        raw: true,
      });
      let variantArr = await ProductVariantModel.findAll({
        where: { variant_id: variantIdArr },
        raw: true,
      });
      for (let el of variantArr) {
        let fetchCountrySpecific = el?.variant_price_details.filter(
          (data) => data?.country_code == country_code
        );
        el.variant_price_details = fetchCountrySpecific;
      }
      let tempArr = [];
      for (let le in productObj) {
        let findProductData = productArr.find((el) => el?.id == le);
        let obj = {};
        if (findProductData) {
          obj = {
            [le]: productObj[le],
            productObj: findProductData,
          };
        }
        let variantData = variantArr.find((el) => el?.product_id == le);
        if (variantData && obj.productObj) {
          obj.productObj.variantObj = variantData;
        }
        if (obj.productObj) {
          tempArr.push(obj);
        }
      }

      // Convert array back to object

      return res.status(200).json({
        message: "Fetched data",
        statusCode: 200,
        success: true,
        totalProductQuantityDelivered: result[0]?.total_quantity,
        productOrderWithQuantity: tempProduct,
        // productObj,
        totalProduct: productIdArr?.length,
        tempArr,
        // orderData: fethOrderData,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async getProductProfit(req, res, filterData) {
    try {
      // console.log(filterData, "filterdataaaaaa");
      let fromDate = filterData?.fromDate;
      let toDate = filterData?.toDate;
      let country_code = req.query.country_code;
      let fethOrderData = [];
      let status = filterData?.status;
      fethOrderData = await OrderModel.findAll({
        where: filterData,
        raw: true,
        attributes: [
          "variant_quantity",
          "sub_total",
          "delivery_charges",
          "payment_status",
          "status",
          "country_code",
          "created_at",
        ],
      });
      // console.log(fethOrderData, "fethOrderDatafethOrderData");
      // if (fromDate && toDate) {
      //   fethOrderData = await OrderModel.findAll({
      //     where: {
      //       country_code: country_code,
      //       status,
      //       created_at: {
      //         [Op.between]: [fromDate, toDate],
      //       },
      //     },
      //     raw: true,
      //     attributes: [
      //       "variant_quantity",
      //       "sub_total",
      //       "delivery_charges",
      //       "payment_status",
      //       "status",
      //       "country_code",
      //       "created_at",
      //     ],
      //   });
      // } else {
      //   fethOrderData = await OrderModel.findAll({
      //     where: {
      //       country_code: country_code,
      //       status,
      //     },
      //     raw: true,
      //     attributes: [
      //       "variant_quantity",
      //       "sub_total",
      //       "delivery_charges",
      //       "payment_status",
      //       "status",
      //       "country_code",
      //       "created_at",
      //     ],
      //   });
      // }
      let tempVariantArr = [];
      let sellingPrice = 0;
      for (let el of fethOrderData) {
        sellingPrice = parseFloat(sellingPrice) + parseFloat(el.sub_total);
        for (let elem of el.variant_quantity) {
          tempVariantArr.push(elem?.variant_id);
        }
      }
      sellingPrice = sellingPrice.toFixed(2);
      let variantArr = await ProductVariantModel.findAll({
        where: { variant_id: tempVariantArr },
        attributes: ["variant_price_details", "variant_id"],
        raw: true,
      });
      let costPrice = 0;
      for (let el of fethOrderData) {
        for (let le of el.variant_quantity) {
          let findVariantObj = variantArr?.find(
            (elem) => elem?.variant_id == le.variant_id
          );
          // console.log(findVariantObj, "findvariantobject2222222");
          if (findVariantObj) {
            let fetchCountrySpecific = findVariantObj?.variant_price_details.find(
              (data) => data?.country_code == country_code
            );
            // console.log(fetchCountrySpecific,"!@#!@fetchCountrySpecific")
            if (fetchCountrySpecific) {
              costPrice =
                Number(costPrice) +
                Number(fetchCountrySpecific?.purchase_price) * le.quantity;
            }
          }
        }
      }
      // for (let el of variantArr) {
      //   let fetchCountrySpecific = el?.variant_price_details.find(
      //     (data) => data?.country_code == country_code
      //   );
      //   // console.log(fetchCountrySpecific,"fetchcoun")
      //   if (fetchCountrySpecific && fetchCountrySpecific?.purchase_price) {
      //     costPrice =
      //       Number(costPrice) + Number(fetchCountrySpecific?.purchase_price); //* quantity
      //   }
      // }
      costPrice = costPrice.toFixed(2);
      // //=---------------------------------------------------------------------

      // let data = [];
      // data = await OrderModel.findAll({
      //   attributes: [
      //     [dbConnection.fn("SUM", dbConnection.col("sub_total")), "revenue"],
      //   ],
      //   where: filterData,
      // });

      // let data2 = await OrderModel.findAll({
      //   where: filterData,
      //   raw: true,
      // });
      // console.log(costPrice, "costprice", sellingPrice, "sellingpriceeeee");
      let profit = Number(sellingPrice) - Number(costPrice);
      profit = profit.toFixed(2);
      return res.status(200).json({
        message: "Fetched data",
        statusCode: 200,
        data: { sellingPrice, costPrice, profit },
        success: true,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async fetchliveUser(req, res) {
    try {
      // const clientEmail = "temp-401@asadfgh.iam.gserviceaccount.com";
      let { clientEmail, viewId, startDate } = req.query;
      // clientEmail = "temperary@helloworld-416209.iam.gserviceaccount.com";
      // console.log(req.query, "ererewe");
      let privateKey =
        "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCvfkaArZE84Zgr\nW2qUlIQrx9Jd/sTJVfgJeYeaiAL6RAtPOmF70uP64OwVTo2hN6ye0V8V3CLcUcK/\ngKRHdHG4BcGQWcjGdgfl7eftd2GWXZYMqsr5UpqD73dNYWVOovIecKzUuG8ey1Bk\nty6DP16pasC9RsqKkjYVwAu9GMeL0ptpOG9jg7UhtZJUDCq2gGDEEa9qEgRsXMI7\nqcZmbz6rdRLnSvmkx/lDxQ9Qp3vgM9rag0U8QLGupiOzXNXpdlxAZ9z93sSMQSR7\n96tgnRjveg9EnJgs9VXFfz8KKT/w6b7+X4e+pi7rU+1x0MgzkoDBU9EtK2ugaoMK\ndJ3rybgvAgMBAAECggEABOsNtW7SfS74AW8PGO7jQrQs6cQeu7hpunTqH03kgiME\nth8KuwT5V/8/CTHUYkpEejGf7+WQIeCLYVaM7ru4BtI9JHsqV0rY2dFwXdqp+iQm\nn7WW+U8eqXKSmLE8EkIayvjuvwoULdFrhVxk309tVbjPgf5z5Vec+xW7aSdCoGEm\nD1bqOWMuyqb7zm/jfrS/Nynu1L6pZZus6NbJCfs9DABO0j4qE/zV2yY2whmqpS/U\npf6ZMNTQFSWiXAJged/Ok1EcmEaMs5QEERNMkbI57SvMtB4VmcD8Jl0in1RhQ0tJ\nFOPZyCPvROmkmyUoCix5z0EQ2cCbc9zQUJ2wrSB04QKBgQDcp5LJMoVUo+ZBqgDU\nepVIDvLJ2XVoRrw05l/MS+JSfRzvG6Awghn9RLt79S1Cz0kFQV9nW1mkXI9k7OlX\n/aJKXP7HRLFj2szMOXFkB9ZV515SvvAPlUzfLEp/viS1+aAqRMejKx59enzxqMbB\nR1zWGBljbepKkeX2px38xVhdFwKBgQDLmsNCWd56z7SVIrMSChQWBnQDk7+29rzp\n/2DyGTX9ekIwQ2YqH/NTcB0aJK/rup6RgsIKX+0mghN4BLL7nA/ZU/uKzCjfyuh0\nK5F6mAnPqP6TjhzqXm3vlKja7ELmYDZ6xnjy+v3hFaYsdaDcLdVm3ZtstC3phE5B\n2ef3FQBcqQKBgQCmqB6Svgi8K+qub9OeqFN2EGxKDmfB8aMXJWT3rdzrxrmC00/D\nM5CjnTUp471it6MESCLhsrpbDNn1NYbswZHBLsn0Aaslq02BdmVxUwYM7eps/u/c\nJTzhVteR8jBSDY9uPXK3h8rIpSoXcA1mUBsLTTpnwc3yso2JJSHeF8Os0wKBgATi\nPXTF+xQvD0HUhz8Ths/Qb8/2J08YNAfY3FZyTF08JYJK25R/F7MUqV4LKz0YSN1s\nqYLeMi4OSLFES5bFc4ve+9WkeAaGM3U15lNuei3E+/ZGHmNwyGpKwpIdwK0N+cCQ\nKi6J3rUbc9T1LVqarte80RGWcNN9HPNvaqT+l/ehAoGAILl5yBK0gjOqGlFybI/g\nJ9Mjim+SnRna8JXcexv9TSLfV9mHy0uSApsHthA0U1CShhP1CQ1//B59brk9gM6Y\n+kT6JlCLcPYzj36bcxeVdkz+j4r+ADqg640d/ZE3v6v25Ucjd/mHiylVkRlVkZvq\nwY+UjyiYjrWv5Xjso4o8A8E=\n-----END PRIVATE KEY-----\n";
      const scopes = "https://www.googleapis.com/auth/analytics.readonly";
      // Get the current date and time
      const currentDate = new Date();
      const localDate = currentDate.toLocaleString();
      // console.log(localDate, "ciurrent daetee", startDate, "startdateee");
      // Format the current date and time to match Google Analytics API format
      // const formattedDate = localDate.toISOString().split(".")[0]; // Remove milliseconds and convert to string

      // console.log(formattedDate, "formatted date ");
      const jwt = new google.auth.JWT(
        clientEmail,
        null,
        privateKey.replace(/\\n/g, "\n"),
        scopes
      );
      viewId = "300455504";
      // viewId = "193726606";
      await jwt.authorize();
      const response = await google.analytics("v3").data.ga.get({
        auth: jwt,
        ids: "ga:" + viewId,
        // "start-date": "30daysAgo",
        // "start-date": "2005-01-01",
        "start-date": "today",
        // "start-date": startDate, //+ " 18:00:00",
        "end-date": "today",
        // "end-date": "2024-03-04",
        metrics: "ga:pageviews",
      });
      return res.status(200).json({
        message: "Fetch data",
        data: response.data,
        statusCode: 200,
        success: true,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message, statusCode: 500, success: false });
    }
  }

  async fetchLiveInsightsClarity(req, res) {
    const params = {
      numOfDays: "1",
      dimension1: "OS",
      // dimension1: "WINDOW",
      // dimension1: "IOS",
    };
    const headers = {
      Authorization:
        "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjAzNWI5N2UxMjIyMDRkNTM5ZmQ2ZGQ5OGJhYzQyMmYxIiwidHlwIjoiSldUIn0.eyJqdGkiOiJjMTRhYTczMi0wNmYwLTQxNGQtYTNiOS1iNGZlMTRkNmVlMDEiLCJzdWIiOiIyMTY2MjQ3NDY4NzU1ODUzIiwic2NvcGUiOiJEYXRhLkV4cG9ydCIsIm5iZiI6MTcwOTYzNjQyNiwiZXhwIjo0ODYzMjM2NDI2LCJpYXQiOjE3MDk2MzY0MjYsImlzcyI6ImNsYXJpdHkiLCJhdWQiOiJjbGFyaXR5LmRhdGEtZXhwb3J0ZXIifQ.lD2QpFkOaRO1TN4jqT1qszY8AfUY6px_ohSsykAYt_QukyWQ37fwLAt8jfM0lF51eZgyb0Z3w6A_821NlwZCP6ZVsk18htrBXW0eVrAa3ePECdoCEJy2RTTOCpP1VlEVeK8zTJa_VrTAG_BwW3672CUAMr9lPFJm6qg7oJePcWWPuKGVt0uir_p-P9T8oQ8fQf6lJKpDZmpjujNXeVyjRJ6u39blAN8GrjR9SlDTQ_mDF2fKGUQ2dMqDau14w07JHUcXJ7eSB1d1PKgBelZqcrM8u4GynS-QYM7S5E530cS4Po-JVnAgfiz21c3odnqY5V0HdGCTuSqdjFze_lL87w",
      "Content-Type": "application/json",
    };
    try {
      const response = await axios.get(
        "https://www.clarity.ms/export-data/api/v1/project-live-insights",
        {
          params: params,
          headers: headers,
        }
      );
      // console.log("Response:", response);
      return res.status(200).json({
        message: "data",
        data: response.data,
        statusCode: 200,
        success: true,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message, statusCode: 500, success: false });
    }
  }
}

const DashboardDataServicesObj = new DashboardDataServices();
export default DashboardDataServicesObj;

// Function to fetch real-time report from Google Analytics Data API
async function fetchRealtimeReport() {
  const GA4_PROPERTY_ID = "429965679";
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runRealtimeReport`;

  const requestData = {
    dimensions: [{ name: "country" }],
    metrics: [{ name: "activeUsers" }],
  };

  const headers = {
    Authorization:
      "Bearer 4%2F0AeaYSHCFRFY8olE-A-RUVl1S_utlvj_7pqIFLJ1n1A8wer77b-2lL96181RvDY0PF4-hfA",
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(url, requestData, { headers });
    console.log("Real-time Report:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching real-time report:", error.response.data);
    throw error.response.data;
  }
}

// Call the function
// fetchRealtimeReport();

// import querystring  from'querystring';
const clientId =
  "28748684164-6aaqavc3u2tb4jjd0a1j35g32dahem36.apps.googleusercontent.com";
const clientSecret = "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";
// Function to exchange authorization code for access token
async function exchangeCodeForAccessToken(
  clientId,
  clientSecret,
  code,
  redirectUri
) {
  const tokenEndpoint = "https://oauth2.googleapis.com/token";
  const requestBody = {
    client_id: clientId,
    client_secret: clientSecret,
    code: code,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  };

  try {
    const response = await axios.post(
      tokenEndpoint,
      querystring.stringify(requestBody),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const accessToken = response.data.access_token;
    console.log("Access Token:", accessToken);
    return accessToken;
  } catch (error) {
    console.error(
      "Error exchanging code for access token:",
      error.response.data
    );
    throw error.response.data;
  }
}

// Call the function with your client ID, client secret, authorization code, and redirect URI
const authorizationCode =
  "4/0AeaYSHDtXsDFTF_nidYkcOeX8cckYCoS46_PKVsYLIvevsEEEFPBogaXeZSrS7o8HSo4vA"; // Extracted from the URL query parameters
const redirectUri = "https://helloworlds246.blogspot.com/";
// exchangeCodeForAccessToken(
//   clientId,
//   clientSecret,
//   authorizationCode,
//   redirectUri
// );

// Function to obtain OAuth 2.0 access token
async function getAccessToken(clientId, clientSecret) {
  const tokenEndpoint = "https://oauth2.googleapis.com/token";
  const requestBody = {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "client_credentials",
  };

  try {
    const response = await axios.post(tokenEndpoint, requestBody);
    const accessToken = response.data.access_token;
    console.log("Access Token:", accessToken);
    return accessToken;
  } catch (error) {
    console.error("Error getting access en:", error.response.data);
    throw error.response.data;
  }
}

// Call the function with your client ID and client secret

// getAccessToken(clientId, clientSecret);

async function sol() {
  try {
    // let get = await axios.get(
    //   "https://analyticsdata.googleapis.com/v1beta/properties/429877837/metadata"
    // );
    //ga4 fetching data
    // console.log(get, "GEttttttttttt");
  } catch (err) {
    console.log(err, "Erorororo");
  }
}
// sol();
// Response: [
//   { metricName: 'DeadClickCount', information: [] },
//   { metricName: 'ExcessiveScroll', information: [] },
//   { metricName: 'RageClickCount', information: [] },
//   { metricName: 'QuickbackClick', information: [] },
//   { metricName: 'ScriptErrorCount', information: [] },
//   { metricName: 'ErrorClickCount', information: [] },
//   { metricName: 'ScrollDepth', information: [] },
//   { metricName: 'Traffic', information: [] },
//   { metricName: 'EngagementTime', information: [] }
// ] //1:13

// Call the function
// fetchLiveInsights();
// Response: [
//   { metricName: 'DeadClickCount', information: [] },
//   { metricName: 'ExcessiveScroll', information: [] },
//   { metricName: 'RageClickCount', information: [] },
//   { metricName: 'QuickbackClick', information: [] },
//   { metricName: 'ScriptErrorCount', information: [] },
//   { metricName: 'ErrorClickCount', information: [] },
//   { metricName: 'ScrollDepth', information: [] },
//   { metricName: 'Traffic', information: [] },
//   { metricName: 'EngagementTime', information: [] }
// ]
// DeadClickCount ADASd []
// ExcessiveScroll ADASd []
// RageClickCount ADASd []
// QuickbackClick ADASd []
// ScriptErrorCount ADASd []
// ErrorClickCount ADASd []
// ScrollDepth ADASd []
// Traffic ADASd []
// EngagementTime ADASd []

// Create a new Node.js project and install the necessary dependencies.

// Create a new API controller and define the route for fetching the live user count.

// app.get('/live-user-count', async (req, res) => {
//   // Call the Pub/Sub API to get the current number of live users.
//   const [response] = await pubsub.topic('live-users').get();
//   const liveUserCount = response.messageCount;

//   // Return the live user count to the client.
//   res.json({
//     liveUserCount,
//   });
// });

// // Start the API server.
// app.listen(3000, () => {
//   console.log('API server started on port 3000.');
// });

let g;
/**
 * TODO(developer): Uncomment this variable and replace with your
 *   Google Analytics 4 property ID before running the sample.
 */
// propertyId = 'YOUR-GA4-PROPERTY-ID';

// // Imports the Google Analytics Data API client library.
// import { BetaAnalyticsDataClient } from "@google-analytics/data";

// // Using a default constructor instructs the client to use the credentials
// // specified in GOOGLE_APPLICATION_CREDENTIALS environment variable.
// const analyticsDataClient = new BetaAnalyticsDataClient();

// // Runs a simple report.
// async function runReport() {
//   const [response] = await analyticsDataClient.runReport({
//     property: `properties/${429965679}`,
//     dateRanges: [
//       {
//         startDate: "2024-02-01",
//         endDate: "today",
//       },
//     ],
//     dimensions: [
//       {
//         name: "delhi",
//       },
//     ],
//     metrics: [
//       {
//         name: "activeUsers",
//       },
//     ],
//   });

//   console.log("Report result:");
//   response.rows.forEach((row) => {
//     console.log(row.dimensionValues[0], row.metricValues[0]);
//   });
// }

// // runReport();
