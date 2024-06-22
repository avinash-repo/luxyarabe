import ProductModel from "../../models/ProductModel.js";
import { Op, literal, where } from "sequelize";
import { environmentVars } from "../../config/environmentVar.js";
import ProductVariantModel from "../../models/ProductVariantModel.js";
import ProductDescriptionModel from "../../models/ProductDescriptionModel.js";
import dbConnection from "../../config/dbConfig.js";
import filterProduct from "../../models/filterDataModel.js";

import jwt from "jsonwebtoken";
import AdminUserModel from "../../models/AdminUserModel.js";
import WishlistModel from "../../models/WishlistModel.js";
import SearchParametersModel from "../../models/SearchParameterModel.js";
import OrderModel from "../../models/OrderModel.js";
import SeoModel from "../../models/SeoModel.js";

class ProductServices {
//previous api
  //   async fetch_all_productData(req, res) {
//     try {
//       let productListQuery = `SELECT *, product_condition as 'condition' from product_view5 WHERE status='active'`;
//       // let productListQuery = `
//       //     SELECT
//       //         p.id, p.title,
//       //         p.condition,
//       //         p.gender,
//       //         p.model_number,p.frame_type_id,
//       //         p.status,
//       //         p.shape_id,p.material_id,
//       //         p.thumbnail_img,
//       //         p.created_at,p.is_student,
//       //         p.cat_id,  -- Add the primary key or unique column here
//       //         group_concat(DISTINCT pv.color_id) as colors,
//       //         JSON_ARRAYAGG(
//       //             JSON_OBJECT(
//       //               'product_id',pv.product_id,
//       //                 'variant_id', pv.variant_id,
//       //                 'code',pv.code,
//       //                 'sku',pv.code,
//       //                 'variant_name',p.title,
//       //                 'size_id',p.size_id,
//       //                 'variant_price_details',pv.variant_price_details,
//       //                 'thumbnail_url', pv.thumbnail_url,
//       //                 'thumbnail_images', pi.images, -- Aggregate image URLs as an array
//       //                 'color_id', pv.color_id
//       //                 -- Add other variant properties here
//       //                 )
//       //                 ) AS variants,
//       //     IFNULL(
//       //       (
//       //           SELECT JSON_OBJECT(
//       //               'id', seo.id,
//       //               'meta_title', seo.meta_title,
//       //               'meta_description', seo.meta_description,
//       //               'tags',seo.tags
//       //           )
//       //           FROM seo
//       //           WHERE seo.product_id = p.id
//       //           LIMIT 1
//       //       ),
//       //       JSON_OBJECT()
//       //   ) AS seo_data
//       //                 FROM products p
//       //                 LEFT JOIN product_variants pv ON p.id = pv.product_id
//       //                 LEFT JOIN product_images pi ON pv.variant_id = pi.variant_id
//       //     WHERE p.status = 'active' AND pv.status = 'active'`;

//       const replacements = {};
//       let whereClauseAdded = false;

//       if (req.query.cat_id) {
//         productListQuery += ` AND cat_id = ${req.query.cat_id}`;
//         // replacements.cat_id = req.query.cat_id;
//         // whereClauseAdded = true;
//       }
//       if (req.query.sort == "new_arrival") {
//         productListQuery += ` AND product_condition = 'new'`;
//       } else if (req.query.sort == "popular") {
//         productListQuery += ` AND product_condition = 'popular'`;
//       }

//       // if (req.query.gender && req.query.gender !== "undefined") {
//       //   productListQuery += whereClauseAdded
//       //     ? " AND JSON_CONTAINS(p.gender, JSON_QUOTE(:gender))"
//       //     : " AND JSON_CONTAINS(p.gender, JSON_QUOTE(:gender))";
//       //   replacements.gender = req.query.gender;
//       //   whereClauseAdded = true;
//       // }
//       if (req.query.gender && req.query.gender !== "undefined") {
//         // productListQuery += ` AND JSON_CONTAINS(gender, JSON_QUOTE(${req.query.gender}))`
//         productListQuery += ` AND JSON_CONTAINS(gender, JSON_QUOTE('${req.query.gender}'))`;

//         // replacements.gender = req.query.gender;
//         // whereClauseAdded = true;
//       }

//       if (req.body?.color_id && req.body.color_id?.length > 0) {
//         let colorIds = req.body.color_id.map((color) => parseInt(color));
//         productListQuery += ` AND (`;
//         colorIds.forEach((colorId, index) => {
//           productListQuery += `FIND_IN_SET('${colorId}', colors) > 0`;
//           if (index !== colorIds.length - 1) {
//             productListQuery += ` OR `;
//           }
//         });
//         productListQuery += `)`;
//       }

//       if (req.body?.weight_group_id && req.body?.weight_group_id?.length > 0) {
//         let weightIds = req.body.weight_group_id.map((el) => parseInt(el)); // Assuming color_id is integer, adjust accordingly
//         weightIds = weightIds?.toString();
//         console.log(weightIds, "weightIdsweightIdsweightIds");
//         productListQuery += ` AND weight_group_id IN (${weightIds})`;
//       }
//       let t1;

//       if (req.body.size_id && req.body?.size_id?.length > 0) {
//         let sizeIds = req.body.size_id.map((el) => parseInt(el)); // Assuming color_id is integer, adjust accordingly
//         sizeIds = sizeIds?.toString();
//         productListQuery += ` AND size_id IN (${sizeIds})`;
//       }

//       if (
//         req.body?.shape_id &&
//         req.body?.shape_id.length > 0 &&
//         !req.body?.shape_id?.includes(null)
//       ) {
//         // console.log(req.body.shape_id,"req,body.sahpeidddd111111")
//         let shapeIds = req.body.shape_id.map((el) => parseInt(el));
//          shapeIds =shapeIds?.toString()
//          productListQuery += ` AND shape_id IN (${shapeIds})`;
//       }
    
//       if (req.body?.material_id && req.body.material_id.length > 0) {
//        let  material_id = req.body.material_id.map((el) => parseInt(el));
//         material_id = material_id?.toString()
//         productListQuery += ` AND material_id IN (${material_id})`;
//       }


//       if (req.query.sort === "new_arrival") {
//         productListQuery += " ORDER BY created_at DESC";
//       }

//       const page = req.query.page || 1;
//       const limit = req.query.limit || 10;
//       const offset = (page - 1) * limit;
//       const end = offset + limit;

//       productListQuery += ` LIMIT ${limit} OFFSET ${offset}`;

//       let productList = await dbConnection.query(productListQuery, {
//         // replacements,
//         type: dbConnection.QueryTypes.SELECT,
//       });
//       // console.log(productList, "productListproductListproductList");
//       //---------------here fetch total count--------------
//       // let productListQueryCount = `
//       //     SELECT
//       //       COUNT(DISTINCT p.id) AS total_count
//       //     FROM products p
//       //     LEFT JOIN product_variants pv ON p.id = pv.product_id
//       //     LEFT JOIN product_images pi ON pv.variant_id = pi.variant_id
//       //     WHERE p.status = 'active' AND pv.status = 'active'`;

//       // const countReplacements = { ...replacements };
//       // if (req.query.cat_id) {
//       //   productListQueryCount += " AND p.cat_id = :cat_id";
//       // }

//       // if (req.query.sort == "new_arrival") {
//       //   productListQueryCount += " AND p.condition = 'new'";
//       // } else if (req.query.sort == "popular") {
//       //   productListQueryCount += " AND p.condition = 'hot'";
//       // }
//       // if (req.query.gender && req.query.gender !== "undefined") {
//       //   productListQueryCount +=
//       //     " AND JSON_CONTAINS(p.gender, JSON_QUOTE(:gender))";
//       // }

//       // if (req.body?.color_id && req.body.color_id?.length > 0) {
//       //   const colorIds = req.body.color_id.map((color) => parseInt(color));
//       //   productListQueryCount += ` AND pv.color_id IN (:color_id)`;
//       //   countReplacements.color_id = colorIds;
//       // }
//       // if (req.body?.weight_group_id && req.body?.weight_group_id?.length > 0) {
//       //   const weightIds = req.body.weight_group_id.map((el) => parseInt(el));
//       //   productListQueryCount += ` AND p.weight_group_id IN (:weight_group_id)`;
//       //   countReplacements.weight_group_id = weightIds;
//       // }

//       // if (req.body.size_id && req.body?.size_id?.length > 0) {
//       //   const sizeIds = req.body.size_id.map((el) => parseInt(el));
//       //   productListQueryCount += ` AND p.size_id IN (:size_id)`;
//       //   countReplacements.size_id = sizeIds;
//       // }
//       // if (
//       //   req.body?.shape_id &&
//       //   req.body?.shape_id.length > 0 &&
//       //   !req.body?.shape_id?.includes(null)
//       // ) {
//       //   const shapeIds = req.body.shape_id.map((el) => parseInt(el));
//       //   productListQueryCount += ` AND p.shape_id IN (:shape_id)`;
//       //   countReplacements.shape_id = shapeIds;
//       // }
//       // if (req.body?.material_id && req.body.material_id.length > 0) {
//       //   const shapeIds = req.body.material_id.map((el) => parseInt(el));
//       //   productListQueryCount += ` AND p.material_id IN (:material_id)`;
//       //   countReplacements.material_id = shapeIds;
//       // }

//       // const countResult = await dbConnection.query(productListQueryCount, {
//       //   replacements: countReplacements,
//       //   type: dbConnection.QueryTypes.SELECT,
//       // });
//       // console.log("jhjhjhjhjhjh",productListQueryCount,"aaaaaaaaa")
//       const totalCount = 10; //countResult[0].total_count;

//       let fetch = await filterProduct.findOne({ raw: true });
//       let _secrate = req?.cookies?._token;
//       let getAllWishlistData = [];
//       if (_secrate) {
//         const proof = jwt.verify(_secrate, environmentVars.jwtSecret, {
//           algorithm: "HS512",
//         });
//         if (proof && proof?.id) {
//           getAllWishlistData = await WishlistModel.findAll({
//             where: { user_id: proof?.id },
//             raw: true,
//           });
//         }
//       }
//       let fetchColor = fetch?.color;
//       let fetchGender = fetch?.gender;
//       let fetchFrameTypeData = fetch?.frame_type;
// let tt;
//       // for (let i = productList?.length - 1; i >= 0; i--) {
//       //   const el = productList[i];

//       //   if (req.query && req.query.country_code !== "") {
//       //     el.variants = el.variants?.filter((variant) => {
//       //       if (variant.variant_price_details) {
//       //         let filterData = variant?.variant_price_details?.filter(
//       //           (detail) =>
//       //             detail?.country_code === req.query.country_code &&
//       //             "price" in detail
//       //         );
//       //         variant.variant_price_details = filterData;
//       //         return filterData.length > 0;
//       //       }
//       //       return false;
//       //     });
//       //     if (!el.variants || el.variants.length === 0) {
//       //       productList.splice(i, 1);
//       //     }
//       //   }
//       // }
//       // console.log(productList,"productListproductList");
//       // if (
//       //   req.body.minPrice?.length &&
//       //   req.body.maxPrice?.length &&
//       //   req.query.country_code &&
//       //   productList?.length > 0
//       // ) {
//       //   const minPrices = req.body?.minPrice?.map((price) => parseFloat(price));
//       //   const maxPrices = req.body?.maxPrice?.map((price) =>
//       //     price === "morethan" ? null : parseFloat(price)
//       //   );
//       //   productList = productList?.filter((product) => {
//       //     product.variants = product?.variants?.filter((variant) => {
//       //       const priceDetails = variant?.variant_price_details || [];
//       //       const hasMatchingDetails = priceDetails?.some((details) => {
//       //         return (
//       //           details.country_code === req.query?.country_code &&
//       //           minPrices.some((minPrice, index) => {
//       //             let price = parseFloat(details.price);
//       //             let totalDiscount = Number(details?.discount);
//       //             let totalPrice = Number(details?.price);
//       //             price = Number(
//       //               totalPrice - (totalDiscount * totalPrice) / 100
//       //             );
//       //             price = Math.ceil(price);
//       //             return (
//       //               price >= minPrice &&
//       //               (maxPrices[index] === null || price <= maxPrices[index])
//       //             );
//       //           })
//       //         );
//       //       });
//       //       if (hasMatchingDetails) {
//       //         variant.variant_price_details = priceDetails.filter((details) => {
//       //           return (
//       //             details.country_code === req.query?.country_code &&
//       //             minPrices.some((minPrice, index) => {
//       //               let price = parseFloat(details.price);
//       //               let totalDiscount = Number(details?.discount);
//       //               let totalPrice = Number(details?.price);
//       //               price = Number(
//       //                 totalPrice - (totalDiscount * totalPrice) / 100
//       //               );
//       //               price = Math.ceil(price);
//       //               return (
//       //                 price >= minPrice &&
//       //                 (maxPrices[index] === null || price <= maxPrices[index])
//       //               );
//       //             })
//       //           );
//       //         });
//       //       }
//       //       return hasMatchingDetails;
//       //     });
//       //     return product.variants.length > 0;
//       //   });

//       //   // productList = productList?.filter((product) => {
//       //   //   product.variants = product?.variants?.filter((variant) => {
//       //   //     const priceDetails = variant?.variant_price_details || [];
//       //   //     console.log(priceDetails, "priceDetailspriceDetailspriceDetails");
//       //   //     const hasMatchingDetails = priceDetails?.some(
//       //   //       (details) =>
//       //   //         details.country_code == req.query?.country_code &&
//       //   //         minPrices.some(
//       //   //           (minPrice, index) =>
//       //   //             parseFloat(details.price) >= minPrice &&
//       //   //             (maxPrices[index] === null ||
//       //   //               parseFloat(details?.price) <= maxPrices[index])
//       //   //         )
//       //   //     );
//       //   //     console.log(
//       //   //       hasMatchingDetails,
//       //   //       "hasMatchingDetailshasMatchingDetails"
//       //   //     );
//       //   //     variant.variant_price_details = hasMatchingDetails
//       //   //       ? priceDetails
//       //   //       : [];
//       //   //     return hasMatchingDetails;
//       //   //   });
//       //   //   return product.variants.length > 0;
//       //   // });
//       // }
// let k;
//       // if (productList && productList?.length) {
//       //   for (let el of productList) {
//       //     if (req.query && req.query.country_code !== "") {
//       //       el.variants = el.variants?.map((variant) => {
//       //         if (variant.variant_price_details) {
//       //           let filterData = variant?.variant_price_details.filter(
//       //             (detail) => detail?.country_code === req?.query?.country_code
//       //           );

//       //           variant.variant_price_details = filterData;
//       //         }
//       //         return variant;
//       //       });
//       //     }
//       //     let checkWishlistProduct = getAllWishlistData.find(
//       //       (element) => element?.product_id == el?.id
//       //     );
//       //     if (checkWishlistProduct && checkWishlistProduct?.id) {
//       //       el.isWishlisted = true;
//       //     } else {
//       //       el.isWishlisted = false;
//       //     }
//       //     let colorArray = el?.colors?.split(",");
//       //     if (el.variants) {
//       //       colorArray = colorArray.filter((colorId) =>
//       //         el.variants.some((variant) => variant.color_id == colorId)
//       //       );
//       //     }
//       //     let colorArray2 = [];
//       //     colorArray?.map((ele) => {
//       //       let findData = fetchColor.find((elem) => elem?.id == ele);
//       //       if (findData && findData?.status == "active") {
//       //         colorArray2.push({ color_id: ele, value: findData?.value });
//       //       }
//       //     });
//       //     let genderdata = [];
//       //     el?.gender?.map((ele) => {
//       //       let findData = fetchGender.find((elem) => elem?.id == ele);
//       //       if (findData && findData?.status == "active") {
//       //         genderdata.push({ gender_id: ele, value: findData?.value });
//       //       }
//       //     });
//       //     el.genderDataArr = genderdata;
//       //     el.colorData = colorArray2;
//       //     el.variants = el.variants?.sort((variantA, variantB) => {
//       //       const priceA = Math.min(
//       //         ...variantA.variant_price_details.map(
//       //           (detail) => detail?.price || 0
//       //         )
//       //       );

//       //       const priceB = Math.min(
//       //         ...variantB.variant_price_details.map(
//       //           (detail) => detail?.price || 0
//       //         )
//       //       );
//       //       return priceA - priceB;
//       //     });
//       //   }
//       // }

//       if (productList && productList?.length) {
//         if (req.query.sort == "ascending" && req.query.country_code) {
//           productList.sort((a, b) => {
//             const aPrice = a.variants[0]?.variant_price_details[0]?.price || 0;
//             const bPrice = b.variants[0]?.variant_price_details[0]?.price || 0;
//             return parseFloat(aPrice) - parseFloat(bPrice);
//           });
//         } else if (req.query.sort == "descending" && req.query.country_code) {
//           productList.sort((a, b) => {
//             const aPrice = a.variants[0]?.variant_price_details[0]?.price || 0;
//             const bPrice = b.variants[0]?.variant_price_details[0]?.price || 0;
//             return parseFloat(bPrice) - parseFloat(aPrice);
//           });
//         }
//       }
//       // console.log(productList?.length, "@@@@@@@@@@");
//       // productList = productList.slice(offset, end);
//       // console.log(productList?.length, "productListproductList");
//       // let cacheDataOf = {
//       //   message: "Fetch all products",
//       //   data: productList,
//       //   pagination: { page, limit, offset, totalCount },
//       //   success: true,
//       // };
//       // cacheDataOf = JSON.stringify(cacheDataOf);
//       // // cacheDataOf=JSON.stringify(cacheDataOf)
//       // console.log(cacheDataOf, "chhcchchchchh");
//       // try {
//       //   await ProductWithCache.create({
//       //     id: cacheKey,
//       //     data: `${cacheDataOf}`,
//       //   });
//       // } catch (err) {
//       //   console.error(err, "eeeeeeeeeeee");
//       // }
//       let t;
//       // let cacheKey = `FetchProduct_${req.query.cat_id}`;
//       // let tempobj = "productList";
//       // console.log(tempobj, "Seeeeee!!!!!!!!!!!");
//       // if (cacheKey) {
//       //   // console.log("@#!@#!@#!@#productList");
//       //   await redisInstance.setValue(cacheKey, JSON.stringify(tempobj), 86400);
//       // }
//       // // console.log("asdasdasdadasd!!!!!!!!!!!!!!!!!!");

//       // // const cacheKey = `fetchProduct${req.query.cat_id}`;
//       // const cachedResult = await redisInstance.getValue(cacheKey);
//       // console.log("asdasdasdadasd##########3");
//       // console.log(cachedResult, "cachedResultcachedResult");
//       let y;
//       // if (cachedResult) {
//       //   return res.status(200).json({
//       //     message: "Fetch data",
//       //     data: cachedResult,
//       //     success: true,
//       //     optCached: true,
//       //   });
//       // }

//       return res.status(200).json({
//         message: "Fetch all products",
//         data: productList,
//         pagination: { page, limit, offset, totalCount },
//         success: true,
//       });
//     } catch (err) {
//       console.log(err, "Errrr in fetch all prodcut by filter rrr");
//       return res
//         .status(500)
//         .json({ message: err?.message, success: false, statusCode: 500 });
//     }
//   }


  async fetch_all_productData(req, res) {
    try {
      let productListQuerywhere = "";
      if (req.query.cat_id) {
        productListQuerywhere += ` AND cat_id = ${req.query.cat_id}`;
      }
      if (req.query.sort == "new_arrival") {
        productListQuerywhere += ` AND product_condition = 'new'`;
      } else if (req.query.sort == "popular") {
        productListQuerywhere += ` AND product_condition = 'popular'`;
      }

      if (req.query.gender && req.query.gender !== "undefined") {
        productListQuerywhere += ` AND JSON_CONTAINS(gender, JSON_QUOTE('${req.query.gender}'))`;
      }

      if (req.body?.color_id && req.body.color_id?.length > 0) {
        let colorIds = req.body.color_id.map((color) => parseInt(color));
        productListQuerywhere += ` AND (`;
        colorIds.forEach((colorId, index) => {
          productListQuerywhere += `FIND_IN_SET('${colorId}', colors) > 0`;
          if (index !== colorIds.length - 1) {
            productListQuerywhere += ` OR `;
          }
        });
        productListQuerywhere += `)`;
      }

      if (req.body?.weight_group_id && req.body?.weight_group_id?.length > 0) {
        let weightIds = req.body.weight_group_id.map((el) => parseInt(el)); // Assuming color_id is integer, adjust accordingly
        weightIds = weightIds?.toString();
        console.log(weightIds, "weightIdsweightIdsweightIds");
        productListQuerywhere += ` AND weight_group_id IN (${weightIds})`;
      }
      if (req.body.size_id && req.body?.size_id?.length > 0) {
        let sizeIds = req.body.size_id.map((el) => parseInt(el)); // Assuming color_id is integer, adjust accordingly
        sizeIds = sizeIds?.toString();
        productListQuerywhere += ` AND size_id IN (${sizeIds})`;
      }

      if (
        req.body?.shape_id &&
        req.body?.shape_id.length > 0 &&
        !req.body?.shape_id?.includes(null)
      ) {
        let shapeIds = req.body.shape_id.map((el) => parseInt(el));
        shapeIds = shapeIds?.toString();
        productListQuerywhere += ` AND shape_id IN (${shapeIds})`;
      }

      if (req.body?.material_id && req.body.material_id.length > 0) {
        let material_id = req.body.material_id.map((el) => parseInt(el));
        material_id = material_id?.toString();
        productListQuerywhere += ` AND material_id IN (${material_id})`;
      }
      // console.log(productListQuerywhere,"productListQuerywhereproductListQuerywhere");
      // let productListQuery = `SELECT *, product_condition as 'condition' from product_view5 WHERE status='active' LIMIT 0, 10`;
      let productListQuery = `SELECT *,
      (SELECT COUNT(*) FROM product_view5 WHERE status='active' ${productListQuerywhere}) AS total_record,
      product_condition AS 'condition' FROM product_view5 WHERE status='active' ${productListQuerywhere} `;
      //  console.log(productListQuery,"productListQueryproductListQuery");

      // let productListQuery = `
      //     SELECT
      //         p.id, p.title,
      //         p.condition,
      //         p.gender,
      //         p.model_number,p.frame_type_id,
      //         p.status,
      //         p.shape_id,p.material_id,
      //         p.thumbnail_img,
      //         p.created_at,p.is_student,
      //         p.cat_id,  -- Add the primary key or unique column here
      //         group_concat(DISTINCT pv.color_id) as colors,
      //         JSON_ARRAYAGG(
      //             JSON_OBJECT(
      //               'product_id',pv.product_id,
      //                 'variant_id', pv.variant_id,
      //                 'code',pv.code,
      //                 'sku',pv.code,
      //                 'variant_name',p.title,
      //                 'size_id',p.size_id,
      //                 'variant_price_details',pv.variant_price_details,
      //                 'thumbnail_url', pv.thumbnail_url,
      //                 'thumbnail_images', pi.images, -- Aggregate image URLs as an array
      //                 'color_id', pv.color_id
      //                 -- Add other variant properties here
      //                 )
      //                 ) AS variants,
      //     IFNULL(
      //       (
      //           SELECT JSON_OBJECT(
      //               'id', seo.id,
      //               'meta_title', seo.meta_title,
      //               'meta_description', seo.meta_description,
      //               'tags',seo.tags
      //           )
      //           FROM seo
      //           WHERE seo.product_id = p.id
      //           LIMIT 1
      //       ),
      //       JSON_OBJECT()
      //   ) AS seo_data
      //                 FROM products p
      //                 LEFT JOIN product_variants pv ON p.id = pv.product_id
      //                 LEFT JOIN product_images pi ON pv.variant_id = pi.variant_id
      //     WHERE p.status = 'active' AND pv.status = 'active'`;

      if (req.query.sort === "new_arrival") {
        productListQuery += " ORDER BY created_at DESC";
      }
      // productListQuery += " GROUP BY id";

      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      const offset = (page - 1) * limit;
      const end = offset + limit;

      productListQuery += ` LIMIT ${limit} OFFSET ${offset}`;
// console.log(productListQuery,"pppppppppppppppppppppppppp")
      let productList = await dbConnection.query(productListQuery, {
        type: dbConnection.QueryTypes.SELECT,
      });
      // console.log(productList?.length, "productListproductList");
      //---------------here fetch total count--------------
      // let productListQueryCount = `
      //     SELECT
      //       COUNT(DISTINCT p.id) AS total_count
      //     FROM products p
      //     LEFT JOIN product_variants pv ON p.id = pv.product_id
      //     LEFT JOIN product_images pi ON pv.variant_id = pi.variant_id
      //     WHERE p.status = 'active' AND pv.status = 'active'`;

      // let productListQueryCount = `SELECT COUNT(*) AS total_count from product_view5 WHERE status='active'`;

      // if (req.query.cat_id) {
      //   productListQuery += ` AND cat_id = ${req.query.cat_id}`;
      // }

      // if (req.query.sort == "new_arrival") {
      //   productListQuery += ` AND product_condition = 'new'`;
      // } else if (req.query.sort == "popular") {
      //   productListQuery += ` AND product_condition = 'popular'`;
      // }

      // if (req.query.gender && req.query.gender !== "undefined") {
      //   productListQuery += ` AND JSON_CONTAINS(gender, JSON_QUOTE('${req.query.gender}'))`;
      // }

      // if (req.body?.color_id && req.body.color_id?.length > 0) {
      //   let colorIds = req.body.color_id.map((color) => parseInt(color));
      //   productListQuery += ` AND (`;
      //   colorIds.forEach((colorId, index) => {
      //     productListQuery += `FIND_IN_SET('${colorId}', colors) > 0`;
      //     if (index !== colorIds.length - 1) {
      //       productListQuery += ` OR `;
      //     }
      //   });
      //   productListQuery += `)`;
      // }

      // if (req.body?.weight_group_id && req.body?.weight_group_id?.length > 0) {
      //   let weightIds = req.body.weight_group_id.map((el) => parseInt(el)); // Assuming color_id is integer, adjust accordingly
      //   weightIds = weightIds?.toString();
      //   // console.log(weightIds, "weightIdsweightIdsweightIds");
      //   productListQuery += ` AND weight_group_id IN (${weightIds})`;
      // }
      // if (req.body.size_id && req.body?.size_id?.length > 0) {
      //   let sizeIds = req.body.size_id.map((el) => parseInt(el)); // Assuming color_id is integer, adjust accordingly
      //   sizeIds = sizeIds?.toString();
      //   productListQuery += ` AND size_id IN (${sizeIds})`;
      // }

      // if (
      //   req.body?.shape_id &&
      //   req.body?.shape_id.length > 0 &&
      //   !req.body?.shape_id?.includes(null)
      // ) {
      //   let shapeIds = req.body.shape_id.map((el) => parseInt(el));
      //    shapeIds =shapeIds?.toString()
      //    productListQuery += ` AND shape_id IN (${shapeIds})`;
      // }

      // if (req.body?.material_id && req.body.material_id.length > 0) {
      //  let  material_id = req.body.material_id.map((el) => parseInt(el));
      //   material_id = material_id?.toString()
      //   productListQuery += ` AND material_id IN (${material_id})`;
      // }

      // if (req.query.sort === "new_arrival") {
      //   productListQuery += " ORDER BY created_at DESC";
      // }

      // if (req.body?.weight_group_id && req.body?.weight_group_id?.length > 0) {
      //   const weightIds = req.body.weight_group_id.map((el) => parseInt(el));
      //   productListQueryCount += ` AND p.weight_group_id IN (:weight_group_id)`;
      //   countReplacements.weight_group_id = weightIds;
      // }

      // if (req.body.size_id && req.body?.size_id?.length > 0) {
      //   const sizeIds = req.body.size_id.map((el) => parseInt(el));
      //   productListQueryCount += ` AND p.size_id IN (:size_id)`;
      //   countReplacements.size_id = sizeIds;
      // }
      // if (
      //   req.body?.shape_id &&
      //   req.body?.shape_id.length > 0 &&
      //   !req.body?.shape_id?.includes(null)
      // ) {
      //   const shapeIds = req.body.shape_id.map((el) => parseInt(el));
      //   productListQueryCount += ` AND p.shape_id IN (:shape_id)`;
      //   countReplacements.shape_id = shapeIds;
      // }
      // if (req.body?.material_id && req.body.material_id.length > 0) {
      //   const shapeIds = req.body.material_id.map((el) => parseInt(el));
      //   productListQueryCount += ` AND p.material_id IN (:material_id)`;
      //   countReplacements.material_id = shapeIds;
      // }

      // const countResult = await dbConnection.query(productListQueryCount, {
      //   // replacements: countReplacements,
      //   type: dbConnection.QueryTypes.SELECT,
      // });
      // console.log(countResult,"jhjhjhjhjhjh","productListQueryCount","aaaaaaaaa")
      // const totalCount = countResult[0].total_count;
      let t;
      let fetch = await filterProduct.findOne({ raw: true });
      let _secrate = req?.cookies?._token;
      let getAllWishlistData = [];
      if (_secrate) {
        const proof = jwt.verify(_secrate, environmentVars.jwtSecret, {
          algorithm: "HS512",
        });
        if (proof && proof?.id) {
          getAllWishlistData = await WishlistModel.findAll({
            where: { user_id: proof?.id },
            raw: true,
          });
        }
      }
      // console.log(getAllWishlistData,"getAllWishlistDatagetAllWishlistData");
      let fetchColor = fetch?.color;
      let fetchGender = fetch?.gender;

      for (let i = productList?.length - 1; i >= 0; i--) {
        const el = productList[i];

        if (req.query && req.query.country_code !== "") {
          el.variants = el.variants?.filter((variant) => {
            if (variant.variant_price_details) {
              let filterData = variant?.variant_price_details?.filter(
                (detail) =>
                  detail?.country_code === req.query.country_code &&
                  "price" in detail
              );
              variant.variant_price_details = filterData;
              return filterData.length > 0;
            }
            return false;
          });
          if (!el.variants || el.variants.length === 0) {
            productList.splice(i, 1);
            if (productList[0] && productList[0]?.total_record) {
              productList[0].total_record--;
            }
          }
        }
      }

      if (
        req.body.minPrice?.length &&
        req.body.maxPrice?.length &&
        req.query.country_code &&
        productList?.length > 0
      ) {
        const minPrices = req.body?.minPrice?.map((price) => parseFloat(price));
        const maxPrices = req.body?.maxPrice?.map((price) =>
          price === "morethan" ? null : parseFloat(price)
        );
        productList = productList?.filter((product) => {
          product.variants = product?.variants?.filter((variant) => {
            const priceDetails = variant?.variant_price_details || [];
            const hasMatchingDetails = priceDetails?.some((details) => {
              return (
                details.country_code === req.query?.country_code &&
                minPrices.some((minPrice, index) => {
                  let price = parseFloat(details.price);
                  let totalDiscount = Number(details?.discount);
                  let totalPrice = Number(details?.price);
                  price = Number(
                    totalPrice - (totalDiscount * totalPrice) / 100
                  );
                  price = Math.ceil(price);
                  return (
                    price >= minPrice &&
                    (maxPrices[index] === null || price <= maxPrices[index])
                  );
                })
              );
            });
            if (hasMatchingDetails) {
              variant.variant_price_details = priceDetails.filter((details) => {
                return (
                  details.country_code === req.query?.country_code &&
                  minPrices.some((minPrice, index) => {
                    let price = parseFloat(details.price);
                    let totalDiscount = Number(details?.discount);
                    let totalPrice = Number(details?.price);
                    price = Number(
                      totalPrice - (totalDiscount * totalPrice) / 100
                    );
                    price = Math.ceil(price);
                    return (
                      price >= minPrice &&
                      (maxPrices[index] === null || price <= maxPrices[index])
                    );
                  })
                );
              });
            }
            return hasMatchingDetails;
          });
          return product.variants.length > 0;
        });

        // productList = productList?.filter((product) => {
        //   product.variants = product?.variants?.filter((variant) => {
        //     const priceDetails = variant?.variant_price_details || [];
        //     console.log(priceDetails, "priceDetailspriceDetailspriceDetails");
        //     const hasMatchingDetails = priceDetails?.some(
        //       (details) =>
        //         details.country_code == req.query?.country_code &&
        //         minPrices.some(
        //           (minPrice, index) =>
        //             parseFloat(details.price) >= minPrice &&
        //             (maxPrices[index] === null ||
        //               parseFloat(details?.price) <= maxPrices[index])
        //         )
        //     );
        //     console.log(
        //       hasMatchingDetails,
        //       "hasMatchingDetailshasMatchingDetails"
        //     );
        //     variant.variant_price_details = hasMatchingDetails
        //       ? priceDetails
        //       : [];
        //     return hasMatchingDetails;
        //   });
        //   return product.variants.length > 0;
        // });
      }
      
      if (productList && productList?.length) {
        for (let el of productList) {
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
          let checkWishlistProduct = getAllWishlistData.find(
            (element) => element?.product_id == el?.id
          );
          if (checkWishlistProduct && checkWishlistProduct?.id) {
            el.isWishlisted = true;
          } else {
            el.isWishlisted = false;
          }
          let colorArray = el?.colors?.split(",");
          if (el.variants) {
            colorArray = colorArray.filter((colorId) =>
              el.variants.some((variant) => variant.color_id == colorId)
            );
          }
          let colorArray2 = [];
          colorArray?.map((ele) => {
            let findData = fetchColor.find((elem) => elem?.id == ele);
            if (findData && findData?.status == "active") {
              colorArray2.push({ color_id: ele, value: findData?.value });
            }
          });
          let genderdata = [];
          el?.gender?.map((ele) => {
            let findData = fetchGender.find((elem) => elem?.id == ele);
            if (findData && findData?.status == "active") {
              genderdata.push({ gender_id: ele, value: findData?.value });
            }
          });
          el.genderDataArr = genderdata;
          el.colorData = colorArray2;
          el.variants = el.variants?.sort((variantA, variantB) => {
            const priceA = Math.min(
              ...variantA.variant_price_details.map(
                (detail) => detail?.price || 0
              )
            );

            const priceB = Math.min(
              ...variantB.variant_price_details.map(
                (detail) => detail?.price || 0
              )
            );
            return priceA - priceB;
          });
        }
      }

      if (productList && productList?.length) {
        if (req.query.sort == "ascending" && req.query.country_code) {
          productList.sort((a, b) => {
            const aPrice = a.variants[0]?.variant_price_details[0]?.price || 0;
            const bPrice = b.variants[0]?.variant_price_details[0]?.price || 0;
            return parseFloat(aPrice) - parseFloat(bPrice);
          });
        } else if (req.query.sort == "descending" && req.query.country_code) {
          productList.sort((a, b) => {
            const aPrice = a.variants[0]?.variant_price_details[0]?.price || 0;
            const bPrice = b.variants[0]?.variant_price_details[0]?.price || 0;
            return parseFloat(bPrice) - parseFloat(aPrice);
          });
        }
      }
      // console.log(productList?.length, "@@@@@@@@@@");
      // productList = productList.slice(offset, end);
      // console.log(productList?.length, "productListproductList");

      return res.status(200).json({
        message: "Fetch all products",
        data: productList,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          offset: Number(offset),
          totalCount: productList[0]?.total_record || 10,
        },
        success: true,
      });
    } catch (err) {
      console.log(err, "Errrr in fetch all prodcut by filter rrr");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async fetch_all_productData_for_landingPage(req, res) {
    try {
      // console.log(req.query, "wwwwww");

      let productListQuery = `
        SELECT p.*, 
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'variant_id', pv.variant_id,
              'variant_name', pv.variant_name,
              'sku', pv.sku,
              'price', pv.price,
              'stock_quantity', pv.stock_quantity,
           
              'image_url', pv.image_url,
              'is_available', pv.is_available,
              'color_id', pv.color_id,
              'color_name', pc.color,
              'gender', (
                SELECT JSON_ARRAYAGG(pg.gender)
                FROM product_genders pg
                WHERE JSON_CONTAINS(pv.gender, JSON_QUOTE(CAST(pg.id AS CHAR)), '$')
              ),
              'material_id', pv.material_id,
              'material_name', pm.material_name,
              'size_id', pv.size_id,
              'size_name', ps.size
              -- Add other variant properties here
            )
          ) AS variants
        FROM products p
        LEFT JOIN product_variants pv ON p.id = pv.product_id
        LEFT JOIN product_sizes ps ON pv.size_id = ps.id
        LEFT JOIN product_materials pm ON pv.material_id = pm.id
        LEFT JOIN product_color pc ON pv.color_id = pc.id
      `;

      const replacements = {};

      if (req.query.cat_id) {
        productListQuery += " WHERE p.cat_id = :cat_id";
        replacements.cat_id = req.query.cat_id;
      }
      if (req.query.shape_id) {
        productListQuery += " WHERE p.shape_id = :shape_id";
        replacements.cat_id = req.query.cat_id;
      }
      if (req.query.color_id) {
        productListQuery += " AND pv.color_id = :color_id";
        replacements.color_id = req.query.color_id;
      }

      productListQuery += " GROUP BY p.id"; // Group by product ID

      let productList = await dbConnection.query(productListQuery, {
        replacements,
        type: dbConnection.QueryTypes.SELECT,
      });

      if (req.query.gender && req.query.gender !== "") {
        const genders = req.query.gender.split(","); // Split gender string into an array
        productList.forEach((product) => {
          product.variants = product.variants?.filter((variant) => {
            return variant?.gender?.some((gender) => genders.includes(gender));
          });
        });
        productList = productList.filter(
          (product) => product.variants.length > 0
        );
      }
      if (req.query.color_id) {
        productList = productList.map((product) => {
          product.variants = product.variants?.filter((variant) => {
            return variant.color_id == req.query.color_id;
          });
          return product;
        });
        productList = productList.filter(
          (product) => product.variants.length > 0
        );
      }
      if (req.query.material_id) {
        productList = productList.map((product) => {
          product.variants = product.variants?.filter((variant) => {
            return variant.material_id == req.query.material_id;
          });
          return product;
        });
        productList = productList.filter(
          (product) => product.variants.length > 0
        );
      }
      if (req.query.size_id) {
        productList = productList.map((product) => {
          product.variants = product.variants?.filter((variant) => {
            return variant.size_id == req.query.size_id;
          });
          return product;
        });
        productList = productList.filter(
          (product) => product.variants.length > 0
        );
      }

      return res.status(200).json({
        message: "Fetch all products",
        data: productList,
        success: true,
      });
    } catch (err) {
      console.log(err, "Errrrrrrrrrrrrr");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async get_all_product_by_search_data(req, res) {
    try {
      // console.log(req.query, "req.queryyyyyyyyy");
      const searchString = req.query.searchString?.trim().toLowerCase();
      let getFilterData = await filterProduct.findOne({ raw: true });

      const filterData = (arr, key) => {
        return arr.reduce((result, item) => {
          if (item?.value?.toLowerCase().includes(searchString)) {
            result[key] = item?.id;
          }
          return result;
        }, {});
      };

      const filteredCategories = filterData(getFilterData.categories, "cat_id");
      const filteredGender = filterData(getFilterData.gender, "gender_id");
      const filteredShape = filterData(getFilterData.shape, "shape_id");
      const filteredMaterial = filterData(
        getFilterData.material,
        "material_id"
      );
      const filteredSize = filterData(getFilterData.size, "size_id");

      const filteredResults = {
        ...filteredCategories,
        ...filteredGender,
        ...filteredShape,
        ...filteredMaterial,
        ...filteredSize,
      };

      // console.log(filteredResults, "filteredResultsfilteredResults");

      let productListQuery = `
        SELECT p.id,
         p.title, p.cat_id,p.is_student, p.material_id, p.shape_id, p.thumbnail_img,p.gender,p.size_id,
          p.model_number,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'variant_id', pv.variant_id,
              'variant_price_details', pv.variant_price_details,
              'image_url', pv.thumbnail_url,
              'color_id', pv.color_id
            )
          ) AS variants
        FROM products p
        INNER JOIN product_variants pv ON p.id = pv.product_id
      `;

      const replacements = {};

      const conditions = Object.keys(filteredResults)
        .map((key) => {
          if (key === "cat_id") {
            replacements[key] = filteredResults[key];
            return `p.${key} = ${filteredResults[key]}`;
          } else if (key === "material_id") {
            replacements[key] = filteredResults[key];
            return `p.${key} = ${filteredResults[key]}`;
          } else if (key === "shape_id") {
            replacements[key] = filteredResults[key];
            return `p.${key} = ${filteredResults[key]}`;
          } else if (key === "size_id") {
            replacements[key] = filteredResults[key];
            return `p.${key} = ${filteredResults[key]}`;
          } else if (key == "gender_id") {
            return `JSON_CONTAINS(p.gender, '"${filteredResults[key]}"', '$')`;
          }
          return null;
        })
        .filter(Boolean);

      if (searchString) {
        conditions.push(`(LOWER(p.title) LIKE :searchString )`);
        replacements.searchString = `%${searchString}%`;
      }

      if (conditions.length > 0) {
        productListQuery += ` WHERE ${conditions.join(" OR ")}`;
      }

      productListQuery += ` GROUP BY p.id`;

      let productList = await dbConnection.query(productListQuery, {
        replacements,
        type: dbConnection.QueryTypes.SELECT,
      });

      // for (let el of productList) {
      //   if (req.query && req.query.country_code !== "") {
      //     el.variants = el.variants?.map((variant) => {
      //       if (variant.variant_price_details) {
      //         let filterData = variant.variant_price_details.filter(
      //           (detail) => detail?.country_code === req.query.country_code
      //         );

      //         variant.variant_price_details = filterData;
      //       }
      //       return variant;
      //     });
      //   }
      // }

      for (let i = productList.length - 1; i >= 0; i--) {
        const el = productList[i];
        // console.log(el, "eleleleelleleell");
        if (req.query && req.query.country_code !== "") {
          el.variants = el.variants?.filter((variant) => {
            // console.log(variant, "variantvariantvariant");
            if (variant.variant_price_details) {
              let filterData = variant?.variant_price_details?.filter(
                (detail) => detail?.country_code === req.query.country_code
              );
              variant.variant_price_details = filterData;
              return filterData.length > 0;
            }
            return false;
          });
          if (!el.variants || el.variants.length === 0) {
            productList.splice(i, 1);
          }
        }
      }

      return res.status(200).json({
        message: "Fetch all products",
        data: productList,
        success: true,
      });
    } catch (err) {
      console.log(err, "Errrrrrrrrrrrrr");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async SearchParametersData(req, res) {
    try {
      const searchString = req.body.searchString?.trim().toLowerCase();
      let getfetchSearchParam = await SearchParametersModel.findOne({
        where: { search_params: searchString },
        raw: true,
      });
      if (!getfetchSearchParam) {
        let obj = {
          search_params: searchString,
          search_count: 1,
        };
        await SearchParametersModel.create(obj);
        return res.status(201).json({
          message: "Search parameter data added successfully",
          statusCode: 201,
          success: true,
        });
      } else {
        let number = getfetchSearchParam?.search_count;
        number = number + 1;
        await SearchParametersModel.update(
          { search_count: number },
          { where: { id: getfetchSearchParam?.id } }
        );
        
        return res.status(200).json({
          message: "Search parameter data Update successfully",
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

  //change here add frame data
  async fetch_product_by_id_data(req, res) {
    try {
      const getProductById = await dbConnection.query(
        `
        SELECT p.*,group_concat(DISTINCT pv.color_id) as colors,
      --  group_concat(DISTINCT p.size_id) as sizes,
     --  pd.summary, pd.description,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'product_id',pv.product_id,
              'variant_id', pv.variant_id,
              -- 'variant_name', p.title,
              'sku', pv.code,
              'variant_price_details',pv.variant_price_details,
             -- 'weight_group_id', p.weight_group_id,
              'thumbnail_url', pv.thumbnail_url, 
              'thumbnail_images', pi.images, -- Aggregate image URLs as an array
              'color_id', pv.color_id,
              'status',pv.status,
              'created_at', pv.created_at,
              'updated_at', pv.updated_at
            )
          ) AS variants ,
          IFNULL(
            (
                SELECT JSON_OBJECT(
                    'id', seo.id,
                    'meta_title', seo.meta_title,
                    'meta_description', seo.meta_description,
                    'tags',seo.tags
                )
                FROM seo
                WHERE seo.product_id = p.id
                LIMIT 1
            ),
            JSON_OBJECT()
        ) AS seo_data
        FROM products p
        LEFT JOIN product_variants pv ON p.id = pv.product_id
       -- LEFT JOIN product_descriptions pd ON pv.product_id = pd.product_id
        LEFT JOIN product_images pi ON pv.variant_id = pi.variant_id
        WHERE p.id = :productId AND pv.status = 'active' -- Filter only active variants
       -- GROUP BY p.id, p.title, pd.summary, pd.description -- Include non-aggregated columns in GROUP BY clause
        `,
        {
          replacements: { productId: req.query.id },
          type: dbConnection.QueryTypes.SELECT,
        }
      );
      for (let el of getProductById) {
        if (el.id == null || el.id == "null") {
          return res.status(400).json({
            message: "Product not found",
            statusCode: 400,
            success: false,
          });
        }
      }
      let fetch = await filterProduct.findOne();
      let fetchFrame_type_data = fetch?.frame_type;
      let fetchColor = fetch?.color;
      let fetchMaterial = fetch?.material;
      let fetchShape = fetch?.shape;
      let fetchSize = fetch?.size;
      let fetchWeight = fetch?.weight_group;
      let fetchGender = fetch?.gender;
      let getAllWishlistData = [];
      let _secrate = req?.cookies?._token;
      if (_secrate) {
        const proof = jwt.verify(_secrate, environmentVars.jwtSecret, {
          algorithm: "HS512",
        });
        if (proof && proof?.id) {
          getAllWishlistData = await WishlistModel.findAll({
            where: { user_id: proof?.id },
            raw: true,
          });
        }
      }
      // console.log(getProductById, "getProductByIdgetProductById");
      for (let el of getProductById) {
        let checkWishlistProduct = getAllWishlistData.find(
          (element) => element?.product_id == el?.id
        );
        if (checkWishlistProduct && checkWishlistProduct?.id) {
          el.isWishlisted = true;
        } else {
          el.isWishlisted = false;
        }

        if (req.query && req.query.country_code !== "") {
          el.variants = el.variants?.map((variant) => {
            if (variant.variant_price_details) {
              let filterData = variant.variant_price_details.filter(
                (detail) =>
                  detail?.country_code === req.query.country_code &&
                  "price" in detail
              );
              variant.variant_price_details = filterData;
            }
            return variant;
          });
        }
        el.variants = el.variants.filter(
          (variant) => variant.variant_price_details.length > 0
        );

        // const variantColors = new Set(
        //   el.variants.map((variant) => variant.color_id)
        // );
        // el.colorData = el.colorData.filter((color) =>
        //   variantColors.has(color.color_id)
        // );
        let colorArray = el?.colors?.split(",");

        // Filter color IDs based on variant availability
        if (el.variants) {
          // console.log(colorArray, "colorar123123123w", el.variants);
          colorArray = colorArray.filter((colorId) =>
            el.variants.some((variant) => variant.color_id == colorId)
          );

          // console.log(colorArray, "colorarrw22222222");
        }
        // console.log(colorArray, "colorarraywwwwwwww");
        // let colorArray = el?.colors?.split(",");

        let colorArray2 = [];
        let find = colorArray?.map((ele) => {
          let findData = fetchColor?.find((elem) => elem?.id == ele);
          if (findData && findData?.status == "active") {
            colorArray2.push({ color_id: ele, value: findData?.value });
          }
        });
        el.colorData = colorArray2;

        let sizeArray2 = [];
        let findData = fetchSize?.find((elem) => elem?.id == el?.size_id);
        if (findData && findData?.status == "active") {
          sizeArray2.push({ size_id: el?.size_id, value: findData?.value });
        }
        el.sizeData = sizeArray2;

        let genderArray2 = [];
        let findGenderData = el?.gender?.map((ele) => {
          let findData = fetchGender?.find((elem) => elem?.id == ele);
          if (findData && findData?.status == "active") {
            genderArray2.push({ id: ele, value: findData?.value });
          }
        });
        el.genderDataArr = genderArray2;
        let weight = el?.weight_group_id;
        let weightobj = {};
        // console.log(size, "sizeaaarararararar");
        // let sizeArray2 = [];
        // let findData = sizeArray?.map((ele) => {
        let findDataWeight = fetchWeight?.find((elem) => elem?.id == weight);
        if (findData && findData?.status == "active") {
          weightobj.id = weight;
          weightobj.value = findDataWeight?.value;
        }
        el.weightData = weightobj;

        let findDataOf = fetchMaterial.find(
          (elem) => elem?.id == el?.material_id
        );
        if (findDataOf && findDataOf?.status == "active") {
          el.materialData = {
            material_id: el?.material_id,
            value: findDataOf?.value,
          };
        }
        let findShapeData = fetchShape.find((elem) => elem?.id == el?.shape_id);
        if (findShapeData && findShapeData?.status == "active") {
          el.shapeobj = {
            id: el?.shape_id,
            value: findShapeData?.value,
          };
        }
        if (fetchFrame_type_data && el?.frame_type_id) {
          let findFrameData = fetchFrame_type_data.find(
            (elem) => elem?.id == el?.frame_type_id
          );
          if (findFrameData && findFrameData?.status == "active") {
            el.frameTypeObj = {
              id: el?.frame_type_id,
              value: findFrameData?.value,
            };
          }
        }
        el.variants = el.variants?.sort((variantA, variantB) => {
          const priceA = Math.min(
            ...variantA.variant_price_details.map(
              (detail) => detail?.price || 0
            )
          );

          const priceB = Math.min(
            ...variantB.variant_price_details.map(
              (detail) => detail?.price || 0
            )
          );
          return priceA - priceB;
        });
      }

      return res.status(200).json({
        message: "Fetch product by id",
        data: getProductById, // getproductList,
        success: true,
      });
    } catch (err) {
      console.log(err, "Errrr servce");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async fetchSearchParams(req, res) {
    try {
      //
      const orderByCreatedAt = await SearchParametersModel.findAll({
        raw: true,
        order: [["created_at", "DESC"]],
        limit: 5,
      });

      const orderBySearchCount = await SearchParametersModel.findAll({
        raw: true,
        order: [["search_count", "DESC"]],
        limit: 5,
      });
      return res.status(200).json({
        message: "get data",
        // data: "get",
        statusCode: 200,
        success: true,
        orderByCreatedAt,
        orderBySearchCount,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async checkIsProductPurcased(req, res) {
    try {
      const productId = req.query.product_id;
      let orders = await OrderModel.findAll({
        where: literal(`
          user_id = ${req.id} AND 
          JSON_CONTAINS(variant_quantity, '{"product_id": ${productId}}') 
        `),
        raw: true,
        attributes: ["variant_quantity", "user_id", "order_id", "id", "status"],
      });
      orders = orders?.filter((el) => el?.status == "delivered");
      if (orders && orders?.length > 0) {
        return res.status(200).json({
          message: "User eligible for giving review on this product",
          success: true,
          statusCode: 200,
          // data: orders,
        });
      } else {
        return res.status(400).json({
          message: "User not eligible for giving review on this product",
          success: false,
          statusCode: 400,
        });
      }
    } catch (err) {
      console.log(err, "EEE user check product purchase EEEEEEEE");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async fetchVariantDataById(req, res) {
    try {
      let fetchData = await ProductVariantModel.findOne({
        where: { variant_id: req?.query?.variant_id },
        attributes: [
          "variant_id",
          "product_id",
          "variant_name",
          "sku",
          "variant_price_details",
          "thumbnail_url",
          "is_available",
          "color_id",
          "material_id",
          "is_featured",
          "size_id",
          "frame_width",
          "lens_width",
          "lens_height",
          "bridge_width",
          "temple_length",
        ],
        raw: true,
      });
      if (fetchData && fetchData?.product_id) {
        let productData = await ProductModel.findOne({
          where: { id: fetchData?.product_id },
          raw: true,
        });
        fetchData.productObj = productData;
        let productDEscriptionObj = await ProductDescriptionModel.findOne({
          where: { product_id: fetchData?.product_id },
          raw: true,
        });
        fetchData.productDescriptionObj = productDEscriptionObj;
      }
      return res.status(200).json({
        message: "Fetch Variant data",
        success: true,
        statusCode: 200,
        data: fetchData,
      });
    } catch (err) {
      console.log(err, "EEEEEEEEEEEEE");
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  //seo data
  async getAllSeoData(req, res) {
    try {
      const query = `
SELECT s.*, 
       p.id AS product_id, 
       p.title AS product_title, 
       p.sku AS product_sku, 
       p.slug AS product_slug, 
       p.summary AS product_summary, 
       p.model_number AS model_number,
       p.description AS product_description, 
       p.condition AS product_condition, 
       p.gender AS product_gender , 
       p.status AS product_status 
FROM seo AS s
INNER JOIN products AS p ON s.product_id = p.id
`;
      let getAll = await dbConnection.query(query, {
        type: dbConnection.QueryTypes.SELECT,
      });
      getAll = getAll.filter((el) => el?.status == "active");
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

  async fetchSeoDataById(req, res) {
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

  async getAllSeoTemp(req, res) {
    try {
      //       let query = `
      // SELECT s.*
      // FROM seo AS s
      // `;
      // let getAll = await dbConnection.query(query, {
      //   type: dbConnection.QueryTypes.SELECT,
      // });
      let query = `INSERT INTO admin_user_otps (user_id, otp_code,creation_time, used,created_at,updated_at) 
      VALUES ('2','123112','1709635248317','3','2024-01-24 16:57:21','2024-02-24 16:57:21')
      `;
      let getAll = await dbConnection.query(query);

      // getAll = getAll.filter((el) => el?.status == "active");
      return res.status(200).json({
        message: "Fetch data ",
        data: getAll,
        success: true,
        statusCode: 200,
      });
    } catch (err) {
      console.log(err, "Erroror");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
}

const ProductServicesObj = new ProductServices();
export default ProductServicesObj;
