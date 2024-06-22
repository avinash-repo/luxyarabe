import { Op, literal } from "sequelize";
import { environmentVars } from "../../config/environmentVar.js";
import { generateAccessToken } from "../../helpers/validateUser.js";
import filterProduct from "../../models/filterDataModel.js";
import ProductVariantModel from "../../models/ProductVariantModel.js";
import ProductModel from "../../models/ProductModel.js";
import dbConnection from "../../config/dbConfig.js";
let salt = environmentVars.salt;

class FilterProductServices {
  async getAllFilterProductData(req, res) {
    try {
      let fetchData = await filterProduct.findOne();

      const filterByStatus = (array) =>
        array.filter((item) => item.status === "active");

      fetchData.gender = filterByStatus(fetchData?.gender);
      fetchData.shape = filterByStatus(fetchData?.shape);
      fetchData.color = filterByStatus(fetchData?.color);
      fetchData.material = filterByStatus(fetchData?.material);
      fetchData.size = filterByStatus(fetchData?.size);
      fetchData.weight_group = filterByStatus(fetchData?.weight_group);
      fetchData.price_range = filterByStatus(fetchData?.price_range);

      res.status(200).json({
        message: "Fetch category data",
        data: fetchData,
        success: true,
        statusCode: 200,
      });
      return;
    } catch (err) {
      console.log(err, "erorororororororor");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async filterMinMaxPriceCountryWise(req, res) {
    try {
      let { cat_id, gender, country_code } = req.query;
      const products = await ProductModel.findAll({
        where: {
          cat_id: cat_id,
          status: "active",
          gender: literal(`JSON_CONTAINS(gender, '["${gender}"]')`),
        },
        attributes: ["id", "cat_id", "gender", "status"],
        raw: true,
      });
      let productIds = products.map((product) => product.id);
      const productVariants = await ProductVariantModel.findAll({
        where: {
          product_id: productIds,
          status: "active",
          // [Op.and]: [
          //  literal(`JSON_CONTAINS(variant_price_details, '${JSON.stringify({ country_code: country_code })}')`),
          //  literal(`JSON_SEARCH(variant_price_details, 'one', '${country_code}', null, '$**.country_code') IS NOT NULL`)
          // ]
          variant_price_details: literal(
            `JSON_CONTAINS(variant_price_details, '${JSON.stringify({
              country_code: country_code,
            })}')`
          ),
        },
        attributes: ["product_id", "variant_price_details"],
        raw: true,
      });

      let maxPrice = 0;
      let minPrice;
      let max_array = [];
      let min_array = [];
      let i = 0;
      
      for (let el of productVariants) {
        let find = el.variant_price_details?.find(
          (elem) => elem?.country_code == country_code
        );
        if (find && find?.discount && find?.price) {
          let totalDiscount = Number(find?.discount);
          let totalPrice = Number(find?.price);
          let Value = Number(totalPrice - (totalDiscount * totalPrice) / 100);
          let mixValueOf = Math.ceil(Value);
          if (i == 0) {
            mixValueOf = Math.floor(Value);
          }
          let MaxValueOf = Math.ceil(Value);
          max_array.push(MaxValueOf);
          min_array.push(mixValueOf);
        }
        i++;
      }
      if (min_array) {
        minPrice = Math.min(...min_array);
      }
      if (max_array) {
        maxPrice = Math.max(...max_array);
      }
      let numberOfRanges = 5;
      minPrice = parseFloat(minPrice);
      maxPrice = parseInt(maxPrice);
      let segmentWidth = (maxPrice - minPrice) / numberOfRanges;
      segmentWidth = segmentWidth.toFixed(2);
      let priceRanges = [];
      for (let i = 0; i < numberOfRanges; i++) {
        let startRange = minPrice + i * segmentWidth;
        startRange = parseInt(startRange);
        let endRange = parseFloat(startRange) + Number(segmentWidth);
        endRange = Math.ceil(endRange);
        priceRanges.push({ min: startRange, max: endRange });
      }

      if (productIds?.length == 0 || productVariants?.length == 0) {
        priceRanges = [
          {
            min: 0,
            max: 500,
          },
          {
            min: 501,
            max: 1000,
          },
          {
            min: 1001,
            max: 1500,
          },
          {
            min: 1501,
            max: 2000,
          },
        ];
      } else if (
        productVariants?.length == 1 &&
        productVariants[0]?.variant_price_details?.length == 1
      ) {
        minPrice = 0;
        priceRanges = [{ min: 0, max: maxPrice }];
      }
      return res.status(200).json({
        success: true,
        message: "Data Fetched",
        data: {
          country_code: req.query.country_code,
          maxPrice,
          minPrice,
          priceRanges,
        },
      });
    } catch (err) {
      console.error(err, "filter min max rpice Errrrr");
      return res
        .status(500)
        .json({ success: false, message: err?.message, statusCode: 500 });
    }
  }
}

const CategoryServicesObj = new FilterProductServices();
export default CategoryServicesObj;
