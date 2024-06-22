import CartModel from "../../models/CartModel.js";
import { Op, literal } from "sequelize";
import dbConnection from "../../config/dbConfig.js";
import ProductModel from "../../models/ProductModel.js";
import ProductVariantModel from "../../models/ProductVariantModel.js";
import filterProduct from "../../models/filterDataModel.js";

class CartServices {
  async AddToCart(req, res) {
    try {
      const productId = req?.body?.product_id.trim();
      const productVariantId = req?.body?.product_variant_id.trim();
      const quantity = req?.body?.quantity.trim();
      let fetchproductData = await ProductModel.findOne({
        where: { id: productId },
        raw: true,
        attributes: ["id", "status", "title"],
      });
      if (!fetchproductData) {
        return res.status(400).json({
          message: "Product not found",
          statusCode: 400,
          success: false,
        });
      } else if (fetchproductData && fetchproductData?.status != "active") {
        return res.status(400).json({
          message: "This product is not active",
          statusCode: 400,
          success: false,
        });
      }
      let fetchVariantData = await ProductVariantModel.findOne({
        where: { variant_id: productVariantId },
        raw: true,
      });
      if (!fetchVariantData) {
        return res.status(400).json({
          message: "Product variant not found",
          statusCode: 400,
          success: false,
        });
      } else if (fetchVariantData && fetchVariantData?.status != "active") {
        return res.status(400).json({
          message: "Product variant is not active",
          statusCode: 400,
          success: false,
        });
      }
      if (fetchVariantData?.product_id != productId) {
        return res.status(400).json({
          message: `This variant is not belongs to this Product id '${productId}' `,
          statusCode: 400,
          success: false,
        });
      }
      let findCurrencyExist = await CartModel.findOne({
        where: { user_id: req.id, product_variant_id: productVariantId },
      });
      if (findCurrencyExist) {
        return res.status(200).json({
          message: "Product already added to cart",
          success: false,
          statusCode: 200,
        });
      } else {
        let obj = {
          product_id: productId,
          product_variant_id: productVariantId,
          user_id: req.id,
          quantity: quantity,
        };
        await CartModel.create(obj, { raw: true });
        return res.status(201).json({
          message: "Product added to Cart",
          success: true,
          statusCode: 201,
        });
      }
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async getCartData(req, res) {
    try {
      // console.log(req.id, "reqqqqqqq");
      if (!req.query.country_code) {
        return res.status(400).json({
          message: "Country code must be provided",
          statusCode: 400,
          success: false,
        });
      }
      let fetchFilterData = await filterProduct.findOne({ raw: true });
      let fetchCategory = fetchFilterData?.categories;
      let productListQuery = `
      SELECT 
          c.id,
          c.product_id,
          c.product_variant_id,
          c.user_id,
          c.quantity,
          p.title AS product_title,
          p.condition,
          p.gender,
          p.status,
          p.shape_id,
          p.material_id,
          p.summary,p.description,
          p.thumbnail_img,
          p.created_at,p.is_student,
          p.cat_id,
        --  MAX(pd.description) AS description,  
        --  MAX(pd.summary) AS summary, 
          group_concat(DISTINCT pv.color_id) as colors,
          JSON_ARRAYAGG(
              JSON_OBJECT(
                  'variant_id', pv.variant_id,
                  'variant_name', p.title,
                  'sku', p.sku,
                  'variant_price_details', pv.variant_price_details,
                  'thumbnail_url', pv.thumbnail_url,
                  'thumbnail_images', pi.images,
                  -- 'is_available', pv.is_available,
                  'color_id', pv.color_id,
                  'size_id', p.size_id,
                  'weight_group_id', p.weight_group_id
              )
          ) AS variants
      FROM carts c
      LEFT JOIN products p ON c.product_id = p.id
      LEFT JOIN product_variants pv ON c.product_variant_id = pv.variant_id
   --   LEFT JOIN product_descriptions pd ON c.product_id = pd.product_id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pv.variant_id = pi.variant_id
      WHERE c.user_id = :userId
      GROUP BY c.id, p.id, pv.variant_id
  `;
      const replacements = {
        userId: req.id,
      };

      let productList = await dbConnection.query(productListQuery, {
        replacements,
        type: dbConnection.QueryTypes.SELECT,
      });
      for (let el of productList) {
        let findCategorydata = fetchCategory?.find(
          (elem) => elem?.id == el.cat_id
        );
        if (findCategorydata) {
          // let name = findCategorydata?.title?.toLowerCase().includes("student");
          // if (name) {
          //   el.is_student = true;
          // } else {
          //   el.is_student = false;
          // }
        }
        if (req.query && req.query.country_code !== "") {
          el.variants = el.variants?.map((variant) => {
            if (variant.variant_price_details) {
              let filterData = variant?.variant_price_details.filter(
                (detail) => detail?.country_code === req?.query?.country_code
              );
              variant.variant_price_details = filterData;
            }
            return variant;
          });
        }
      }
      // let findCurrencyExist = await CartModel.findAll({
      //   where: { user_id: req.id },
      // });
      // if (findCurrencyExist) {
      return res.status(200).json({
        message: "Fetch cart",
        success: true,
        statusCode: 200,
        // data: findCurrencyExist,
        productList,
      });
      // } else {
      //   return res.status(404).json({
      //     message: "Product not found",
      //     success: false,
      //     statusCode: 404,
      //   });
      // }
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async UpdateProductInCart(req, res) {
    try {
      const productVariantId = req?.body?.product_variant_id.trim();
      const quantity = req?.body?.quantity.trim();

      let findCurrencyExist = await CartModel.findOne({
        where: { user_id: req.id, product_variant_id: productVariantId },
      });
      if (findCurrencyExist) {
        const obj = {
          quantity: quantity || findCurrencyExist.quantity,
        };

        await CartModel.update(obj, {
          where: { user_id: req.id, product_variant_id: productVariantId },
        });

        return res.status(200).json({
          message: "Product Update successfully",
          success: true,
          statusCode: 200,
        });
      } else {
        return res.status(404).json({
          message: "Product not found",
          statusCode: 404,
          success: false,
        });
      }
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async DeleteOrClearCart(req, res) {
    const { product_variant_id } = req.query;
    if (!product_variant_id) {
      return res.status(400).json({
        message: "Product data is Required",
        success: false,
        statusCode: 400,
      });
    } else {
      const user_id = req.id;
      if (product_variant_id === "all") {
        // Clear cart for user
        const existCheck = await CartModel.findOne({
          where: { user_id },
        });

        if (existCheck) {
          await CartModel.destroy({
            where: {
              user_id: user_id,
            },
          });

          return res.status(200).json({
            success: true,
            message: "Cart cleared successfully",
            statusCode: 200,
          });
        } else {
          return res.status(404).json({
            message: "Product not found",
            success: false,
            statusCode: 404,
          });
        }
      } else {
        // Delete product from cart by product_variant_id
        const existCheck = await CartModel.findOne({
          where: { product_variant_id, user_id },
        });

        if (existCheck) {
          await CartModel.destroy({
            where: {
              product_variant_id,
              user_id: user_id,
            },
          });

          return res.status(200).json({
            success: true,
            message: "Product removed from Cart successfully",
            statusCode: 200,
          });
        } else {
          return res.status(404).json({
            message: "Product not found",
            success: false,
            statusCode: 404,
          });
        }
      }
    }
  }
  async getCountCart(req, res) {
    try {
      const user_id = req.id;
      if (!user_id) {
        return res.status(404).json({
          message: "Data is Found",
          success: false,
          statusCode: 404,
        });
      } else {
        const getCountCart = await CartModel.count({ where: { user_id } });
        // console.log(getCountCart, "getCountCart");
        return res.status(200).json({
          message: "Count Fetches",
          data: getCountCart,
          success: true,
          statusCode: 200,
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  async getCountFromCartData(req, res) {
    try {
      const user_id = req.id;
      if (!user_id) {
        return res.status(404).json({
          message: "Data is Found",
          success: false,
          statusCode: 404,
        });
      } else {
      
        const getCountCart = await CartModel.count({ where: { user_id } });
        // console.log(getCountCart, "getCountCart");
        return res.status(200).json({
          message: "Count data",
          data: getCountCart,
          success: true,
          statusCode: 200,
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
}

const CartServicesObj = new CartServices();
export default CartServicesObj;
