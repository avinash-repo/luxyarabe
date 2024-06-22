import dbConnection from "../../config/dbConfig.js";
import ProductAvailability from "../../models/ProductAvailability.js";
import { Op, literal, where } from "sequelize";
class ProductAvailabilityServices {
  async isProductAvailable(req, res) {
    try {
      let { country_code, zipcode } = req.query;

      let findCountryExist = await ProductAvailability.findOne({
        where: { country_code },
        raw: true,
      });

      if (!findCountryExist) {
        return res.status(404).json({
          message: "Country not found",
          statusCode: 404,
          success: false,
        });
      } else if (findCountryExist && findCountryExist?.status == "inactive") {
        return res.status(403).json({
          message: "Country is inactive",
          statusCode: 403,
          success: false,
        });
      }

      let query = `
        SELECT COUNT(id) AS data
        FROM product_availability
        WHERE country_code='${country_code}' AND zipcodes LIKE '%${zipcode}%';
      `;

      let [result] = await dbConnection.query(query, {
        replacements: { country_code, zipcodes: [zipcode] },
        type: dbConnection.QueryTypes.SELECT,
        raw: true,
      });
      console.log(result, "resultresultresult");
      let productAvailable = result && result?.data > 0 ? true : false;
      // console.log(productAvailable, "productAvailable");
      if (productAvailable) {
        return res.status(200).json({
          message: "Product available for this zipcode",
          statusCode: 200,
          success: true,
        });
      } else {
        return res.status(200).json({
          message: "Product not available for this zipcode",
          statusCode: 200,
          success: false,
        });
      }
    } catch (err) {
      console.log(err, "");
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  //admin here below
  async addZipCodes(req, res) {
    try {
      let {
        country_code,
        country,
        currency_symbol,
        zipcodes,
        status,
        tax_name,
        tax_value,
      } = req.body;
      let findCountryExist = await ProductAvailability.findOne({
        where: { country_code },
        raw: true,
      });
      let message = "";
      let statusCode;
      if (findCountryExist && findCountryExist?.id) {
        zipcodes=new Set(zipcodes)
        zipcodes=[...zipcodes]
        // console.log(zipcodes,"asdasda");
        // let dbTemp = findCountryExist?.zipcodes;
        // let uniqueTemp = [];
        // if (zipcodes) {
        //   for (let le of zipcodes) {
        //     let find = dbTemp.find((ele) => ele == le);
        //     if (!find) {
        //       uniqueTemp.push(le);
        //     }
        //   }
        // }
        // let mergedArr = [...dbTemp, ...uniqueTemp];
        let obj = {
          // zipcodes: mergedArr,
          zipcodes: zipcodes,
          status: status || findCountryExist?.status,
          tax_name: tax_name || findCountryExist?.tax_name,
          tax_value: tax_value || findCountryExist?.tax_value || 0,
        };
        await ProductAvailability.update(obj, {
          where: { id: findCountryExist?.id },
        });
        
        message = "Product Availability update successfully";
        statusCode = 200;
      } else {
        await ProductAvailability.create(req.body);
        message = "Product Availability data create successfully";
        statusCode = 201;
      }
      return res
        .status(statusCode)
        .json({ message, success: true, statusCode });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async changeStatus(req, res) {
    try {
      let { id, status } = req.body;
      let findData = await ProductAvailability.findOne({
        where: { id },
        raw: true,
      });
      if (!findData) {
        return res.status(400).json({
          message: "Products availability data not found",
          statusCode: 400,
          success: false,
        });
      }
      await ProductAvailability.update({ status }, { where: { id } });
      return res.status(200).json({
        message: "Product availability status update successfully",
        statusCode: 200,
        success: true,
      });
    } catch (er) {
      return res
        .status(500)
        .json({ message: er?.message, statusCode: 500, success: false });
    }
  }

  async getAll(req, res) {
    try {
      const page = req.query.page || 1;
      const pageSize = req.query.pageSize || 10;
      const offset = (page - 1) * pageSize;
      let fetchData = [];
      if (req.userData?.role != "super_admin") {
          fetchData = await ProductAvailability.findAll({
            where: { country_code: req.userData?.country },
            raw: true,
            limit: pageSize,
            offset: offset,
          });
      } else {
          fetchData = await ProductAvailability.findAll({
            raw: true,
            limit: pageSize,
            offset: offset,
          });
      }
      return res.status(200).json({
        message: "fetch data",
        data: fetchData,
        success: true,
        statusCode: 200,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async getActive(req, res) {
    try {
      
      const getAll = await ProductAvailability.findAll({
        where: { status: "active" },
        // attributes: ["country_code", "country", "currency_symbol"],
        raw: true,
      });

      return res.status(200).json({
        message: "Fetch data",
        data: getAll,
        success: true,
        statusCode: 200,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
}
const ProductAvailabilityServicesObj = new ProductAvailabilityServices();
export default ProductAvailabilityServicesObj;
