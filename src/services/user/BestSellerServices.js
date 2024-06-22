import CategoryModel from "../../models/CategoryModel.js";
import { Op } from "sequelize";
import { environmentVars } from "../../config/environmentVar.js";
import dbConnection from "../../config/dbConfig.js";

class BestSellerServices {
  async getData(req, res) {
    try {
      const query = `
  SELECT b.*, pv.variant_price_details,
  pv.thumbnail_url,
  p.title AS variant_name, 
  p.title
  FROM bestseller b
  LEFT JOIN product_variants pv ON b.variant_id = pv.variant_id
  LEFT JOIN products p ON pv.product_id = p.id
`;
      let result = await dbConnection.query(query, {
        type: dbConnection.QueryTypes.SELECT,
        raw: true,
      });
      // console.log(result, "resulttttttttttttt");
      // for (let el of result) {
      //   if (req.query && req.query.country_code !== "") {
      //     let filterData = el?.variant_price_details.filter(
      //       (detail) => detail?.country_code == req?.query?.country_code
      //     );
      //     el.variant_price_details = filterData;
      //   }
      // }
      let filteredResult = result
        .filter((el) => {
          if (req.query && req.query.country_code !== "") {
            let filterData = el?.variant_price_details.filter(
              (detail) => detail?.country_code == req?.query?.country_code
            );
            el.variant_price_details = filterData;
          }
          return el.variant_price_details?.length > 0;
        })
        .map((el) => {
          return el;
        });

      result = filteredResult?.filter((el) => el?.status == "active");
      return res.status(200).json({
        message: "fetch data",
        data: filteredResult,
        statusCode: 200,
        success: true,
      });
    } catch (err) {
      console.log(err, "Erororo");
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
}

const BestSellerObj = new BestSellerServices();
export default BestSellerObj;
