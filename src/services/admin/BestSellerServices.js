import BestSellerModel from "../../models/BestSellerModel.js";
import { Op } from "sequelize";
import { environmentVars } from "../../config/environmentVar.js";
import ProductModel from "../../models/ProductModel.js";
import ProductVariantModel from "../../models/ProductVariantModel.js";
import dbConnection from "../../config/dbConfig.js";
import {
  cdnFuncCall,
  deleteCdnFile,
  removefIle,
} from "../../helpers/validateImageFile.js";

class BestSellerServices {
  async addBestSellerData(req, res) {
    try {
      let { product_id, variant_id, type, status, id } = req.body;
      if (product_id) {
        let productExist = await ProductModel.findOne({
          where: { id: product_id },
          raw: true,
          attributes: ["id", "status"],
        });
        if (!productExist) {
          return res.status(400).json({
            message: "Product not exist",
            statusCode: 400,
            success: false,
          });
        } else if (productExist && productExist?.status == "inactive") {
          return res.status(400).json({
            message: "Product is not active",
            statusCode: 400,
            success: false,
          });
        }
      }
      if (variant_id) {
        let fetchVariantExist = await ProductVariantModel.findOne({
          where: { variant_id: variant_id },
          raw: true,
          attributes: ["status", "variant_id", "product_id"],
        });

        if (!fetchVariantExist) {
          return res.status(400).json({
            message: "Product variant not exist",
            statusCode: 400,
            success: false,
          });
        } else if (
          fetchVariantExist &&
          fetchVariantExist?.status == "inactive"
        ) {
          return res.status(400).json({
            message: "Product variant is not active",
            statusCode: 400,
            success: false,
          });
        }
        if (product_id) {
          if (fetchVariantExist?.product_id != product_id) {
            return res.status(400).json({
              message: "Variant not found for this product",
              statusCode: 400,
              success: false,
            });
          }
        }
      }
      let image = "";
      if (req.files && req.files?.image?.length) {
        image = req.files?.image[0]?.filename;
        try {
          await cdnFuncCall(
            req.files?.image[0]?.filename,
            req.files?.image[0]?.path,
            "bestSeller"
          );
        } catch (err) {
          console.log(err, " uplod in cdn");
        }
      }

      let findLength = await BestSellerModel.findAll({
        raw: true,
        attributes: ["id"],
      });
      let obj = {
        product_id,
        variant_id,
        type,
        position: findLength?.length + 1,
        image,
        status,
      };
      let message = "";
      let statusCode;
      if (id) {
        let findExist = await BestSellerModel.findOne({
          where: { id },
          raw: true,
        });
        if (!findExist) {
          return res.status(400).json({
            message: "Document not found for this id",
            statusCode: 400,
            success: false,
          });
        } else {
          let objtemp = {
            // product_id: product_id || findExist.product_id,
            // variant_id: variant_id || findExist?.variant_id,
            type: type || findExist?.type,
            image: image || findExist?.image,
            status: status || findExist?.status,
            updated_at: Date.now(),
          };
          await BestSellerModel.update(objtemp, {
            where: { id: id },
          });
          if (req.files && req.files?.image?.length && findExist?.image) {
            try {
              await removefIle(findExist?.image, "bestSeller");
            } catch (err) {
              console.log(err, "error in delete uplaod folder");
            }
            try {
              await deleteCdnFile(findExist?.image, "bestSeller");
            } catch (err) {
              console.log(err, "err in cdn delete");
            }
          }
          message = "data updated successfully";
          statusCode = 200;
        }
      } else {
        await BestSellerModel.create(obj);
        message = "data added successfully";
        statusCode = 201;
      }
      return res
        .status(statusCode)
        .json({ message: message, statusCode, success: true });
    } catch (err) {
      console.log(err, "Error incat");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async getData(req, res) {
    try {
      //       const query = `
      //   SELECT b.*, pv.variant_price_details,pv.variant_name,pv.thumbnail_url
      //   FROM bestseller b
      //   LEFT JOIN product_variants pv ON b.variant_id = pv.variant_id;
      // `;

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
      result = result?.filter((el) => el?.status == "active");
      for (let el of result) {
        if (req.query && req.query.country_code !== "") {
          let filterData = el?.variant_price_details.filter(
            (detail) => detail?.country_code === req?.query?.country_code
          );
          el.variant_price_details = filterData;
        }
      }
      // result=result?.filter((el)=>el?.status=='active')
      return res.status(200).json({
        message: "fetch data",
        data: result,
        statusCode: 200,
        success: true,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async statusChange(req, res) {
    try {
      let { id, status } = req.body;
      let findxist = await BestSellerModel.findOne({
        where: { id },
        raw: true,
      });
      if (!findxist) {
        return res.status(404).json({
          message: "Data not found",
          statusCode: 404,
          success: false,
        });
      } else {
        await BestSellerModel.update({ status: status }, { where: { id } });
        return res.status(200).json({
          message: "Best seller status updated successfully",
          statusCode: 200,
          success: true,
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async delete_Data(req, res) {
    try {
      let { id } = req.query;
      let findxist = await BestSellerModel.findOne({
        where: { id },
        raw: true,
      });
      if (!findxist) {
        return res.status(404).json({
          message: "Data not found or deleted already",
          statusCode: 404,
          success: false,
        });
      } else {
        if (findxist?.image) {
          try {
            await removefIle(findxist?.image, "bestSeller");
          } catch (err) {
            console.log(err, "error in delete uplaod folder");
          }
          try {
            await deleteCdnFile(findxist?.image, "bestSeller");
          } catch (err) {
            console.log(err, "err in cdn delete");
          }
        }
        await BestSellerModel.destroy({ where: { id } });
        return res.status(200).json({
          message: "Best seller Data deleted successfully",
          statusCode: 200,
          success: true,
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
}

const BestSellerServicesObj = new BestSellerServices();
export default BestSellerServicesObj;
