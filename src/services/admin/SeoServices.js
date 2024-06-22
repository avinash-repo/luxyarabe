import dbConnection from "../../config/dbConfig.js";
import ProductModel from "../../models/ProductModel.js";
import SeoModel from "../../models/SeoModel.js";

class SeoServices {
  async addData(req, res) {
    try {
      let { product_id, meta_title, meta_description, tags, id } = req.body;
      meta_title = meta_title?.trim();
      // meta_description = meta_description?.trim();
      meta_description = meta_description?.trim();

      if (id) {
        let dataExist = await SeoModel.findOne({
          // where: { id,status:"active" },
          where: { id },
          raw: true,
        });
        if (!dataExist) {
          return res.status(400).json({
            message: "Data not found",
            statusCode: 400,
            success: false,
          });
        } else {
          let object = {
            meta_title: meta_title || dataExist?.meta_title,
            meta_description: meta_description || dataExist?.meta_description,
            tags: tags || dataExist?.tags,
          };
          await SeoModel.update(object, { where: { id } });
          return res.status(200).json({
            message: "Seo data update successfully",
            statusCode: 200,
            success: true,
          });
        }
      } else {
        let findProductExist = await ProductModel.findOne({
          where: { id: product_id },
          raw: true,
          attributes: ["id", "status"],
        });
        if (!findProductExist) {
          return res.status(400).json({
            message: "Product not found",
            statusCode: 400,
            succ: false,
          });
        } else if (findProductExist && findProductExist?.status != "active") {
          console.log(findProductExist, "finoduct @@ !1");
          return res.status(400).json({
            message: `This product status is not active `,
            statusCode: 400,
            success: false,
          });
        }
        let obj = {
          product_id: product_id,
          // product_id: product_id,
          meta_title,
          meta_description,
          tags,
        };
        let existCheck = await SeoModel.findOne({
          where: { product_id },
          raw: true,
        });
        if (existCheck) {
          return res.status(400).json({
            message: "Seo for this product already exist",
            statusCode: 400,
            success: false,
          });
        } else {
          await SeoModel.create(obj);
          return res.status(201).json({
            message: "Data add successfully",
            statusCode: 201,
            success: true,
          });
        }
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async getData(req, res) {
    try {
      // let getAll = await SeoModel.findAll({
      //   include: [
      //     {
      //       model: ProductModel,
      //       attributes: [
      //         "id",
      //         "title",
      //         "sku",
      //         "slug",
      //         "summary",
      //         "description",
      //         "condition",
      //         "gender",
      //         "status",
      //       ],
      //     },
      //   ],
      //   // raw: true,
      // });
      const query = `
  SELECT s.*, 
         p.id AS product_id, 
         p.title AS product_title, 
         p.sku AS product_sku, 
         p.slug AS product_slug, 
         p.summary AS product_summary, 
         p.description AS product_description, 
         p.condition AS product_condition, 
         p.gender AS product_gender , 
         p.status AS product_status 
  FROM seo AS s
  INNER JOIN products AS p ON s.product_id = p.id
`;
      const getAll = await dbConnection.query(query, {
        type: dbConnection.QueryTypes.SELECT,
      });
      return res.status(200).json({
        message: "Fetch data ",
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

  async changeStatus(req, res) {
    try {
      // const { id, status ,meta_title} = req.body;
      const { id, status } = req.body;
      const get = await SeoModel.findOne({
        where: { id },
        raw: true,
      });
      if (!get) {
        return res
          .status(400)
          .json({ message: "Data not found", statusCode: 400, success: false });
      }
      await SeoModel.update({ status: status }, { where: { id: id } });
      return res.status(200).json({
        message: "Status update successfully",
        success: true,
        statusCode: 200,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
  async get_by_id_data(req, res) {
    try {
      // console.log("req.body")
      let findObj = await SeoModel.findOne({
        where: { id: req.query.id, status: "active" },
        raw: true,
      });
      if (findObj && findObj.id) {
        return res.status(200).json({
          message: "Fetch data",
          data: findObj,
          statusCode: 200,
          success: true,
        });
      } else {
        return res.status(404).json({
          message: "Data not found",
          data: findObj,
          statusCode: 404,
          success: false,
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
}

const SeoServicesObj = new SeoServices();
export default SeoServicesObj;
