import ProductModel from "../../models/ProductModel.js";
import { Op, literal } from "sequelize";
import { environmentVars } from "../../config/environmentVar.js";
import ProductVariantModel from "../../models/ProductVariantModel.js";
import ProductMaterialModel from "../../models/ProductMaterialModel.js";
import ProductDescriptionModel from "../../models/ProductDescriptionModel.js";
import dbConnection from "../../config/dbConfig.js";
import filterProduct from "../../models/filterDataModel.js";
import ProductImageModel from "../../models/ProductImageModel.js";
import {
  cdnFuncCall,
  deleteCdnFile,
  removefIle,
} from "../../helpers/validateImageFile.js";
import fs from "fs";
import SeoModel from "../../models/SeoModel.js";
let salt = environmentVars.salt;
// import { redisCache } from "../../helpers/redis/redisCacheModels.js";
class ProductServices {
  async addProductData(req, res) {
    try {
      let {
        title,
        summary,
        description,
        condition,
        status,
        cat_id,
        shape_id,
        // variantData,
        gender,
        material_id,
        sku,
        model_number,
        weight_group_id,
        size_id,
        frame_width,
        lens_width,
        lens_height,
        bridge_width,
        temple_length,
        frame_type_id,
      } = req.body;
      let slug = title?.trim()?.toLowerCase()?.replace(/\s+/g, "-");

      // let { variant_image_Arr } = req.files;
      let get = await filterProduct.findAll();
      // console.log(get, "gggggggbbbb");
      let categoryArray = get[0]?.categories;
      let shapeArray = get[0]?.shape;
      let genderArray = get[0]?.gender;
      let colorArray = get[0]?.color;
      let materialArray = get[0]?.material;
      let sizeArray = get[0]?.size;
      let weight_group_array = get[0]?.weight_group;
      let frame_type_array = get[0]?.frame_type;
      if (frame_type_id) {
        let checkExit = frame_type_array.find((el) => el?.id == frame_type_id);
        if (!checkExit) {
          return res.status(400).json({
            status: "Frame type is not exist",
            statusCode: 400,
            success: false,
          });
        } else if (checkExit && checkExit.status != "active") {
          return res.status(400).json({
            status: "Frame type is not active",
            statusCode: 400,
            success: false,
          });
        }
      }
      let checkCategoryExit = {};
      if (cat_id) {
        checkCategoryExit = categoryArray.find((el) => el?.id == cat_id);
        if (!checkCategoryExit) {
          removefIle(req.files?.thumbnail_img[0]?.filename);
          return res.status(400).json({
            message: "Category not found",
            success: false,
            statusCode: 400,
          });
        } else if (checkCategoryExit && checkCategoryExit.status != "active") {
          removefIle(req.files?.thumbnail_img[0]?.filename);
          return res.status(400).json({
            message: "Category not active",
            success: false,
            statusCode: 400,
          });
        }
      }
      if (material_id) {
        let existcheck2 = materialArray.find((el) => el?.id == material_id);
        if (!existcheck2) {
          removefIle(req.files?.thumbnail_img[0]?.filename);
          return res.status(400).json({
            message: "Material not found",
            success: false,
            statusCode: 400,
          });
        } else if (existcheck2?.status == "inactive") {
          removefIle(req.files?.thumbnail_img[0]?.filename);
          return res.status(400).json({
            message: "Material is not active",
            success: false,
            statusCode: 400,
          });
        }
      }
      if (shape_id) {
        let checkShapeExit = shapeArray.find((el) => el.id == shape_id);
        if (!checkShapeExit) {
          removefIle(req.files?.thumbnail_img[0]?.filename);
          return res.status(400).json({
            message: "Shape not found",
            success: false,
            statusCode: 400,
          });
        } else if (checkShapeExit && checkShapeExit?.status != "active") {
          removefIle(req.files?.thumbnail_img[0]?.filename);
          return res.status(400).json({
            message: "Shape is not active",
            success: false,
            statusCode: 400,
          });
        }
      }
      if (size_id) {
        let checkSizeExit = sizeArray.find((el) => el.id == size_id);
        if (!checkSizeExit) {
          removefIle(req.files?.thumbnail_img[0]?.filename);
          return res.status(400).json({
            message: "Size not found",
            success: false,
            statusCode: 400,
          });
        } else if (checkSizeExit && checkSizeExit?.status != "active") {
          removefIle(req.files?.thumbnail_img[0]?.filename);
          return res.status(400).json({
            message: "Size is not active",
            success: false,
            statusCode: 400,
          });
        }
      }
      if (weight_group_id) {
        let checkWeightExit = weight_group_array.find(
          (el) => el.id == weight_group_id
        );
        if (!checkWeightExit) {
          removefIle(req.files?.thumbnail_img[0]?.filename);
          return res.status(400).json({
            message: "Weight not found",
            success: false,
            statusCode: 400,
          });
        } else if (checkWeightExit && checkWeightExit?.status != "active") {
          removefIle(req.files?.thumbnail_img[0]?.filename);
          return res.status(400).json({
            message: "Weight is not active",
            success: false,
            statusCode: 400,
          });
        }
      }
      // console.log(gender,"genderrrrrrrrrrrrrrrrrr")
      if (gender && gender?.length) {
        for (let ele of gender) {
          let checkGenderExit = genderArray.find((el) => el.id == ele);
          if (!checkGenderExit) {
            removefIle(req.files?.thumbnail_img[0]?.filename);
            return res.status(400).json({
              message: "Gender not found ",
              statusCode: 400,
              success: false,
            });
          } else if (checkGenderExit && checkGenderExit?.status == "inactive") {
            removefIle(req.files?.thumbnail_img[0]?.filename);
            return res.status(400).json({
              message: "Gender is not active",
              statusCode: 400,
              success: false,
            });
          }
        }
      }

      let existCheck = await ProductModel.findOne({
        where: {
          [Op.or]: [{ title }, { sku }, { model_number }],
        },
        attributes: ["title", "id", "model_number"],
      });
      if (existCheck && existCheck?.id) {
        removefIle(req.files?.thumbnail_img[0]?.filename);
        return res.status(400).json({
          message: "Product title or sku or model-number must be unique",
          success: false,
          statusCode: 400,
        });
      }
      let obj = {
        title: title?.trim(),
        slug,
        condition,
        status,
        material_id,
        cat_id,
        shape_id,
        gender,
        thumbnail_img: req.files?.thumbnail_img[0]?.filename,
        sku,
        model_number,
        weight_group_id,
        size_id,
        frame_width,
        lens_width,
        lens_height,
        bridge_width,
        temple_length,
        summary,
        description,
        is_student: checkCategoryExit?.is_special_offer == 1 ? 1 : 0,
        frame_type_id,
      };
      if (req.files?.thumbnail_img && req.files?.thumbnail_img.length) {
        try {
           cdnFuncCall(req.files?.thumbnail_img[0]?.filename,req.files?.thumbnail_img[0]?.path, "product");
        } catch (err) {
          console.log(err, "errr`");
        }
      }
      await ProductModel.create(obj);
      return res.status(201).json({
        message: "Product create successfully",
        success: true,
        statusCode: 201,
      });
    } catch (err) {
      console.log(err, "eee in service product ad");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async editProductData(req, res) {
    try {
      let {
        title,
        summary,
        description,
        shape_id,
        material_id,
        size_id,
        condition,
        status,
        gender,
        product_id,
        sku,
        model_number,
        frame_width,
        lens_width,
        lens_height,
        frame_type_id,
        bridge_width,
        temple_length,
      } = req.body;
      // console.log(req.body, "eeeeeeeeeee");
      let slug;
      if (title) {
        slug = title?.trim()?.toLowerCase()?.replace(/\s+/g, "-");
      }

      let get = await filterProduct.findAll();
      let frame_type_array = get[0]?.frame_type;
      let genderArray = get[0]?.gender;
      let colorArr = get[0]?.colorArr;
      let shapeArr = get[0]?.shape;
      let sizeArr = get[0]?.size;
      let materialArr = get[0]?.material;
      // console.log(frame_type_array,"req.bod2222222yyyyy",frame_type_id);
      if (frame_type_id && frame_type_id != "" && frame_type_id != null) {
        let checkExit = frame_type_array.find((el) => el?.id == frame_type_id);

        // console.log(checkExit,"chek existtttttttttt");
        if (!checkExit) {
          return res.status(400).json({
            status: "Frame type is not exist",
            statusCode: 400,
            success: false,
          });
        } else if (checkExit && checkExit.status != "active") {
          return res.status(400).json({
            status: "Frame type is not active",
            statusCode: 400,
            success: false,
          });
        }
      }

      if (gender && gender?.length) {
        for (let ele of gender) {
          let checkGenderExit = genderArray.find((el) => el.id == ele);
          if (!checkGenderExit) {
            if (req.files && req.files?.thumbnail_img?.length) {
              removefIle(req.files?.thumbnail_img[0]?.filename);
            }
            return res.status(400).json({
              message: "Gender is not found",
              statusCode: 400,
              success: false,
            });
          } else if (checkGenderExit && checkGenderExit?.status == "inactive") {
            if (req.files && req.files?.thumbnail_img?.length) {
              removefIle(req.files?.thumbnail_img[0]?.filename);
            }
            return res.status(400).json({
              message: "Gender is not active",
              statusCode: 400,
              success: false,
            });
          }
        }
      }
      // console.log(shapeArr, "shapeArrshapeArr");
      if (shape_id) {
        let get = shapeArr?.find((el) => el?.id == shape_id);
        // console.log(get,"getttttt",shape_id,"shape_iddd");
        if (!get) {
          return res.status(400).json({
            mesage: " Shape data not found",
            statusCode: 400,
            success: false,
          });
        } else if (get && get?.status != "active") {
          return res.status(400).json({
            status: "Shape is not active",
            statusCode: 400,
            success: false,
          });
        }
      }
      if (size_id) {
        let get = sizeArr?.find((el) => el?.id == size_id);
        if (!get) {
          return res.status(400).json({
            mesage: "Size_id data not found",
            statusCode: 400,
            success: false,
          });
        } else if (get && get?.status != "active") {
          return res.status(400).json({
            status: "Size is not active",
            statusCode: 400,
            success: false,
          });
        }
      }
      if (material_id) {
        let get = materialArr?.find((el) => el?.id == material_id);
        if (!get) {
          return res.status(400).json({
            mesage: "Material_id data not found",
            statusCode: 400,
            success: false,
          });
        } else if (get && get?.status != "active") {
          return res.status(400).json({
            status: "Material is not active",
            statusCode: 400,
            success: false,
          });
        }
      }
      let existCheck = await ProductModel.findOne({
        where: { id: product_id },
        attributes: ["title", "id", "thumbnail_img"],
        raw: true,
      });
      if (!existCheck) {
        if (req.files && req.files?.thumbnail_img?.length) {
          removefIle(req.files?.thumbnail_img[0]?.filename);
        }
        return res.status(400).json({
          message: "Product not found",
          success: false,
          statusCode: 400,
        });
      } else {
        let obj = {
          sku: sku || existCheck?.sku,
          model_number: model_number || existCheck?.model_number,
          title: title?.trim() || existCheck?.title,
          slug: slug || existCheck?.slug,
          condition: condition || existCheck?.condition,
          status: status || existCheck?.status,
          gender: gender || existCheck?.gender,
          summary: summary || existCheck?.summary,
          description: description || existCheck?.description,
          frame_width: frame_width || existCheck?.frame_width,
          lens_width: lens_width || existCheck?.lens_width,
          shape_id: shape_id || existCheck?.shape_id,
          size_id: size_id || existCheck?.size_id,
          material_id: material_id || existCheck?.material_id,

          lens_height: lens_height || existCheck?.lens_height,
          bridge_width: bridge_width || existCheck?.bridge_width,
          temple_length: temple_length || existCheck?.temple_length,
          updated_at: Date.now(),
          frame_type_id: frame_type_id || existCheck?.frame_type_id,
        };
        if (req.files && req.files?.thumbnail_img?.length) {
          try {
            if (
              existCheck &&
              existCheck?.thumbnail_img &&
              existCheck?.thumbnail_img?.length
            ) {
              try {
                // console.log(existCheck?.thumbnail_img,"ASDQWE!@EQWDASCDQWDEQ@");
                try {
                  await removefIle(existCheck?.thumbnail_img);
                } catch (err) {
                  console.log(err, "error in delete uplaod folder");
                }
                try {
                  await deleteCdnFile(existCheck?.thumbnail_img, "product");
                } catch (err) {
                  console.log(err, "err in cdn delete");
                }
              } catch (err) {
                console.log(err, "erroro");
              }
            }
            try {
              await cdnFuncCall(
                req.files?.thumbnail_img[0]?.filename,
                req.files?.thumbnail_img[0]?.path,
                "product"
              );
            } catch (err) {
              console.log(err, " uplod in cdn");
            }
            obj.thumbnail_img = req.files?.thumbnail_img[0]?.filename;
          } catch (err) {
            console.log(err, "er in uploading variant image");
          }
        } else {
          obj.thumbnail_img = existCheck?.thumbnail_img;
        }
        await ProductModel.update(obj, { where: { id: product_id } });
      }
      if (sku) {
        let findVariantAll = await ProductVariantModel.findOne({
          where: { product_id: product_id },
          raw: true,
        });
        if (findVariantAll && findVariantAll?.length) {
          for (let i = 0; i < findVariantAll.length; i++) {
            let colorData = colorArr?.find(
              (el) => el?.id == findVariantAll[i].color_id
            );
            let code = sku + colorData?.value;
            await ProductVariantModel.update(
              { code: code },
              { where: { id: findVariantAll[i].variant_id } }
            );
          }
        }
      }
      return res.status(200).json({
        message: "Product update successfully",
        success: true,
        statusCode: 200,
      });
    } catch (err) {
      console.log(err, "@@@ product ad");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async addProductVariantData(req, res) {
    try {
      let { color_id, product_id } = req.body;

      let existCheckProduct = await ProductModel.findOne({
        where: { id: product_id, status: "active" },
        attributes: ["title", "id", "status", "sku"],
      });
      if (!existCheckProduct) {
        if (req.files && req.files?.variant_image_Arr?.length) {
          let array = req.files.variant_image_Arr;
          for (let el of array) {
            await removefIle(el?.filename);
          }
        }
        return res.status(400).json({
          message: "Product not exist or not active",
          success: false,
          statusCode: 400,
        });
      }
      // else if (existCheckProduct && existCheckProduct?.status == "inactive") {
      //   if (req.files && req.files?.variant_image_Arr?.length) {
      //     let array = req.files.variant_image_Arr;
      //     for (let el of array) {
      //       await removefIle(el?.filename);
      //     }
      //   }
      //   return res.status(400).json({
      //     message: "Product is not active",
      //     statusCode: 400,
      //     success: false,
      //   });
      // }
      let get = await filterProduct.findAll();

      let colorArray = get[0]?.color;

      let existcheck = colorArray.find((el) => el?.id == color_id);
      if (!existcheck) {
        return res.status(400).json({
          message: "Color not found",
          success: false,
          statusCode: 400,
        });
      } else if (existcheck?.status == "inactive") {
        return res.status(400).json({
          message: "Color is not active",
          success: false,
          statusCode: 400,
        });
      }
      let variantObject = {
        product_id,
        code: existCheckProduct?.sku + existcheck?.value,
        color_id: color_id,
        variant_price_details: [],
      };
      let exisstCheck = await ProductVariantModel.findOne({
        where: { product_id: product_id, color_id },
        raw: true,
      });

      if (exisstCheck && exisstCheck?.product_id) {
        return res.status(400).json({
          message: "Variant already exist",
          statusCode: 400,
          success: false,
        });
      } else {
        await ProductVariantModel.create(variantObject, { raw: true });
        return res.status(201).json({
          message: "Product variant added successfully",
          success: true,
          statusCode: 201,
        });
      }
    } catch (err) {
      console.log(err, "eee in service product ad");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async editProductVariantData(req, res) {
    try {
      let { status, variant_id } = req.body;
      let exisrtCheck = await ProductVariantModel.findOne({
        where: { variant_id },
        raw: true,
      });
      if (!exisrtCheck) {
        return res.status(400).json({
          message: "Product variant not found",
          statusCode: 400,
          success: false,
        });
      }

      let imageData = "";
      if (req.files && req.files?.variant_image?.length > 0) {
        imageData = req.files?.variant_image[0]?.filename;
        try {
          if (
            exisrtCheck &&
            exisrtCheck?.thumbnail_url &&
            exisrtCheck?.thumbnail_url?.length
          ) {
            try {
              try{

                await removefIle(exisrtCheck?.thumbnail_url);
              }catch(er){

              }
              try{
                await deleteCdnFile(exisrtCheck?.thumbnail_url, "product");
              }catch(err){
                console.log(err,"Err");
              }
            } catch (err) {
              console.log(err, "erroro");
            }
          }
          await cdnFuncCall(
            req.files?.variant_image[0]?.filename,
            req.files?.variant_image[0]?.path,
            "product"
          );
        } catch (err) {
          console.log(err, "er in uploading variant image");
        }
      }
      let variantObject = {
        thumbnail_url: imageData || exisrtCheck?.thumbnail_url,
        status: status || exisrtCheck?.status,
      };
      await ProductVariantModel.update(variantObject, {
        where: { variant_id },
      });
      return res.status(200).json({
        message: "Product variant update successfully",
        success: true,
        statusCode: 200,
      });
    } catch (err) {
      console.log(err, "eee in service product ad");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async addVariantCountryData(req, res) {
    try {
      let {
        variant_id,
        country_code,
        price,
        stock,
        purchase_price,
        // country,
        discount,
        // currency_symbol,
        status,
      } = req.body;
      // console.log(req.body, "REq.bodyyyyyyyyyyyyyyyyyyyyy");
      let findVariantData = await ProductVariantModel.findOne({
        where: { variant_id: variant_id },
        raw: true,
      });
      if (!findVariantData) {
        return res.status(400).json({
          message: "Variant not found",
          statusCode: 400,
          success: false,
        });
      } else if (findVariantData && findVariantData?.status == "inactive") {
        return res.status(400).json({
          message: "Variant is not active",
          statusCode: 400,
          success: false,
        });
      }

      let findcountryExist;
      if (findVariantData?.variant_price_details?.length) {
        findcountryExist = findVariantData?.variant_price_details?.find(
          (el) => el?.country_code == country_code
        );
      } else {
        return res
          .status(400)
          .json({ message: "Add country first", status: 400, success: false });
      }
      if (findcountryExist) {
        let object = {
          country_code,
          price,
          stock,
          discount,
          purchase_price,
          country: findcountryExist?.country,
          currency_symbol: findcountryExist?.currency_symbol,
          status: status || findcountryExist?.status,
        };
        let filterData = findVariantData?.variant_price_details?.filter(
          (el) => el?.country_code != country_code
        );
        let tempArr = [...filterData];
        tempArr = [...tempArr, object];
        await ProductVariantModel.update(
          { variant_price_details: tempArr },
          { where: { variant_id } }
        );
        return res.status(200).json({
          message: "Variant data update successfully",
          statusCode: 200,
          success: true,
        });
      } else {
        return res.status(400).json({
          message: `This country ${country_code} is not added`,
          statusCode: 400,
          success: false,
        });
      }
      // if (findcountryExist) {
      //   let remainCounryData;
      //   if (findVariantData?.variant_price_details?.length) {
      //     remainCounryData = findVariantData?.variant_price_details?.filter(
      //       (el) => el?.country_code != country_code
      //     );
      //   }
      //   let tempArr = [...remainCounryData, object];
      //   await ProductVariantModel.update(
      //     {
      //       variant_price_details: tempArr,
      //     },
      //     {
      //       where: { variant_id },
      //     }
      //   );
      // } else {
      //   // console.log("udpateeeeeeeeeeeee");
      //   let temoArr = [];
      //   if (findVariantData?.variant_price_details?.length) {
      //     temoArr = [...findVariantData?.variant_price_details, object];
      //   } else {
      //     temoArr = [object];
      //   }
      //   await ProductVariantModel.update(
      //     {
      //       variant_price_details: temoArr,
      //     },
      //     { where: { variant_id } }
      //   );
      // }
    } catch (err) {
      console.log(err, "erororor in varianrt ");
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async addVariantOnlyCountryData(req, res) {
    try {
      let { variant_id, country_data } = req.body;
      let findVariantData = await ProductVariantModel.findOne({
        where: { variant_id: variant_id, status: "active" },
        raw: true,
      });
      if (!findVariantData) {
        return res.status(400).json({
          message: "Variant not found",
          statusCode: 400,
          success: false,
        });
      }
      // else if (findVariantData && findVariantData?.status == "inactive") {
      //   return res.status(400).json({
      //     message: "Variant is not active",
      //     statusCode: 400,
      //     success: false,
      //   });
      // }
      let msg = [];
      // if (findVariantData?.variant_price_details?.length) {
      //   for (let el of findVariantData?.variant_price_details) {
      //     let findEist = country_data?.find(
      //       (elem) => elem?.country_code == el?.country_code
      //     );
      //     if (findEist) {
      //       msg.push(`This country '${findEist?.country}' is already exist`);
      //       // return res.status(400).json({
      //       //   message: `This country '${findEist?.country}' is already exist`,
      //       // });
      //     }
      //   }
      // }
      let tempArr = [];
      if (findVariantData?.variant_price_details?.length) {
        tempArr = [...findVariantData?.variant_price_details];
        // tempArr = [...tempArr, ...country_data];
      }
      //  else {
      //   tempArr = [...country_data];
      // }
      if (country_data) {
        for (let el of country_data) {
          let check = tempArr?.find(
            (ele) => ele?.country_code == el?.country_code
          );
          if (!check) {
            tempArr.push(el);
          }
        }
      }
      await ProductVariantModel.update(
        {
          variant_price_details: tempArr,
        },
        { where: { variant_id } }
      );
      return res.status(200).json({
        message: "Variant data update successfully",
        statusCode: 200,
        success: true,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async addProductVariantImageData(req, res) {
    try {
      let { variant_id, product_id } = req.body;

      let existCheck = await ProductModel.findOne({
        where: { id: product_id },
        attributes: ["title", "id"],
        raw: true,
      });
      if (!existCheck) {
        return res.status(400).json({
          message: "Product is not exist",
          success: false,
          statusCode: 400,
        });
      }
      let variantObj = await ProductVariantModel.findOne({
        where: { variant_id: variant_id },
        attributes: ["variant_id", "product_id"],
        raw: true,
      });
      if (!variantObj) {
        return res.status(400).json({
          message: "variant not found",
          success: false,
          statusCode: 400,
        });
      } else if (variantObj && variantObj?.product_id != product_id) {
        return res.status(400).json({
          message: "Product id and variant id does not match",
          statusCode: 400,
          success: false,
        });
      }
      let { variant_image_Arr } = req.files;
      let i = 0;
      let imageArr = [];
      if (variant_image_Arr && variant_image_Arr?.length) {
        for (let ele of variant_image_Arr) {
          imageArr.push(ele?.filename);
          await cdnFuncCall(ele?.filename,ele?.path, "product");
        }
      }
      let obj = {
        variant_id,
        product_id,
        images: imageArr,
      };
      let findDescriptionExist = await ProductImageModel.findOne({
        where: { variant_id, product_id },
        raw: true,
      });
      if (findDescriptionExist && findDescriptionExist.id) {
        // console.log(dbImageData," db Image Data Image Data ")
        if (findDescriptionExist && findDescriptionExist?.images?.length) {
          obj.images = [...findDescriptionExist.images, ...imageArr];
        } else {
          obj.images = [...imageArr];
        }

        await ProductImageModel.update(obj, {
          where: { variant_id, product_id },
        });
      } else {
        await ProductImageModel.create(obj);
      }
      return res.status(200).json({
        message: "Product variant images added successfully",
        success: true,
        statusCode: 200,
      });
    } catch (err) {
      console.log(err, "eee in service product ad");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async editProductVariantImageData(req, res) {
    try {
      let { variant_id, variantImageName } = req.body;

      let variantObj = await ProductVariantModel.findOne({
        where: { variant_id: variant_id },
        attributes: ["variant_id", "product_id"],
        raw: true,
      });
      if (!variantObj) {
        return res.status(400).json({
          message: "variant not found",
          success: false,
          statusCode: 400,
        });
      }

      let findDescriptionExist = await ProductImageModel.findOne({
        where: { variant_id },
        raw: true,
      });
      if (findDescriptionExist && findDescriptionExist.id) {
        let obj = {};
        let tempArrimages = [];
        tempArrimages = findDescriptionExist?.images;
        tempArrimages = tempArrimages.filter((el) => el != variantImageName);
        obj.images = tempArrimages;
        await ProductImageModel.update(obj, {
          where: { variant_id },
        });
        try {
          await removefIle(variantImageName);
        } catch (err) {
          console.log(err, "error in delete uplaod folder");
        }
        try {
          await deleteCdnFile(variantImageName, "product");
        } catch (err) {
          console.log(err, "err in cdn delete");
        }

        return res.status(200).json({
          message: "Product variant images removed successfully",
          success: true,
          statusCode: 200,
        });
      } else {
        return res.status(400).json({
          message: "Product variant images not found",
          statusCode: 400,
          success: false,
        });
      }
    } catch (err) {
      console.log(err, "eee in service product ad");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
  async fetch_all_productData(req, res) {
    try {
      let productListQuery = `
        SELECT 
            p.id, p.title,
            p.condition,p.frame_typ,
            p.gender,
            p.status,
            p.shape_id,p.material_id,
            p.thumbnail_img,p.frame_type_id,
            p.model_number,
            p.created_at,p.is_student,
            p.cat_id,  -- Add the primary key or unique column here
            group_concat(DISTINCT pv.color_id) as colors,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                  'product_id',pv.product_id,
                    'variant_id', pv.variant_id,
                    'code',pv.code,
                    'sku',pv.code,
                    'variant_name',p.title,
                    'size_id',p.size_id,
                    'variant_price_details',pv.variant_price_details,
                    'thumbnail_url', pv.thumbnail_url,
                    'thumbnail_images', pi.images, -- Aggregate image URLs as an array
                    'color_id', pv.color_id
                    -- Add other variant properties here
                    )
                    ) AS variants,
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
                    LEFT JOIN product_images pi ON pv.variant_id = pi.variant_id
        WHERE p.status = 'active' AND pv.status = 'active'`;

      const replacements = {};
      let whereClauseAdded = false;

      if (req.query.cat_id) {
        productListQuery += " AND p.cat_id = :cat_id";
        replacements.cat_id = req.query.cat_id;
        whereClauseAdded = true;
      }

      if (req.query.gender && req.query.gender !== "undefined") {
        productListQuery += whereClauseAdded
          ? " AND JSON_CONTAINS(p.gender, JSON_QUOTE(:gender))"
          : " AND JSON_CONTAINS(p.gender, JSON_QUOTE(:gender))";
        replacements.gender = req.query.gender;
        whereClauseAdded = true;
      }

      productListQuery += " GROUP BY p.id";

      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      const offset = (page - 1) * limit;

      productListQuery += ` LIMIT ${limit} OFFSET ${offset}`;

      let productList = await dbConnection.query(productListQuery, {
        replacements,
        type: dbConnection.QueryTypes.SELECT,
      });

      ////////////////////////////////////////////////////
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
              //////added here new case
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

      return res.status(200).json({
        message: "Fetch all products",
        data: productList,
        success: true,
      });
    } catch (err) {
      console.log(err, "Errrrrrrr in fetch all prodcut by filter rrr");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async fetch_all_productData_for_landingPage(req, res) {
    try {
      // console.log(req.query, "wwwwww");
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
              'weight', pv.weight,
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
        replacements.color_id = req.query.color_id; // assuming req.query.color_id holds the value
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
      // Retrieve the search string from req.body
      const searchString = req.query.searchString?.trim().toLowerCase();
      let productListQuery = `
          SELECT p.id, p.title,p.cat_id,p.frame_type_id,
         p.model_number,
            JSON_ARRAYAGG(
              JSON_OBJECT(
                'variant_id', pv.variant_id,
                'variant_name', pv.variant_name,
                'sku', pv.sku,
                'price', pv.variant_price,
                'stock_quantity', pv.stock_quantity,
                'weight', pv.weight,
                'image_url', pv.image_url,
                'is_available', pv.is_available,
                'color_id', pv.color_id,
                'material_id', pv.material_id,
                'material_name', pm.material_name,
                'size_id', pv.size_id,
                'size_name', ps.size
              )
            ) AS variants
          FROM products p
          LEFT JOIN product_variants pv ON p.id = pv.product_id
          LEFT JOIN product_sizes ps ON pv.size_id = ps.id
          LEFT JOIN product_materials pm ON pv.material_id = pm.id
          LEFT JOIN categories c ON p.cat_id = c.id
      `;

      const replacements = {};

      if (searchString && searchString.length >= 3) {
        productListQuery += `
              WHERE 
              (
                  LOWER(p.title) LIKE :searchString 
                  OR LOWER(c.title) LIKE :searchString 
                  OR LOWER(pv.variant_name) LIKE :searchString
                  OR JSON_CONTAINS(pv.gender, JSON_QUOTE(:genderSearch), '$')
                  
              )
          `;
        replacements.searchString = `%${searchString}%`;
        replacements.genderSearch = searchString;
      }

      productListQuery += ` GROUP BY p.id`; // Add GROUP BY clause

      let productList = await dbConnection.query(productListQuery, {
        replacements,
        type: dbConnection.QueryTypes.SELECT,
      });

      return res.status(200).json({
        message: "Fetch all products",
        data: productList,
        success: true,
      });

      // let productListQuery = `
      //   SELECT p.*,
      //     JSON_ARRAYAGG(
      //       JSON_OBJECT(
      //         'variant_id', pv.variant_id,
      //         'variant_name', pv.variant_name,
      //         'sku', pv.sku,
      //         'price', pv.price,
      //         'stock_quantity', pv.stock_quantity,
      //         'weight', pv.weight,
      //         'image_url', pv.image_url,
      //         'is_available', pv.is_available,
      //         'color_id', pv.color_id,
      //         'color_name', pc.color,
      //         'gender', (
      //           SELECT JSON_ARRAYAGG(pg.gender)
      //           FROM product_genders pg
      //           WHERE JSON_CONTAINS(pv.gender, JSON_QUOTE(CAST(pg.id AS CHAR)), '$')
      //         ),
      //         'material_id', pv.material_id,
      //         'material_name', pm.material_name,
      //         'size_id', pv.size_id,
      //         'size_name', ps.size
      //         -- Add other variant properties here
      //       )
      //     ) AS variants
      //   FROM products p
      //   LEFT JOIN product_variants pv ON p.id = pv.product_id
      //   LEFT JOIN product_sizes ps ON pv.size_id = ps.id
      //   LEFT JOIN product_materials pm ON pv.material_id = pm.id
      //   LEFT JOIN product_color pc ON pv.color_id = pc.id
      // `;

      // const replacements = {};

      // if (req.query.cat_id) {
      //   productListQuery += " WHERE p.cat_id = :cat_id";
      //   replacements.cat_id = req.query.cat_id;
      // }
      // if (req.query.shape_id) {
      //   productListQuery += " WHERE p.shape_id = :shape_id";
      //   replacements.cat_id = req.query.cat_id;
      // }
      // if (req.query.color_id) {
      //   productListQuery += " AND pv.color_id = :color_id";
      //   replacements.color_id = req.query.color_id; // assuming req.query.color_id holds the value
      // }

      // productListQuery += " GROUP BY p.id"; // Group by product ID

      // let productList = await dbConnection.query(productListQuery, {
      //   replacements,
      //   type: dbConnection.QueryTypes.SELECT,
      // });

      // return res.status(200).json({
      //   message: "Fetch all products",
      //   data: productList,
      //   success: true,
      // });
    } catch (err) {
      console.log(err, "Errrrrrrrrrrrrr");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  //not woring below pai
  // async fetch_product_by_id_data(req, res) {
  //   try {
  //     const getProductById = await dbConnection.query(
  //       `
  //       SELECT p.*,
  //         (
  //           SELECT JSON_ARRAYAGG(
  //             JSON_OBJECT(
  //               'variant_id', pv.variant_id,
  //               'variant_name', pv.variant_name,
  //               'sku', pv.sku,
  //               'price', pv.price,
  //               'stock_quantity', pv.stock_quantity,
  //               'weight', pv.weight,
  //               'image_url', pv.image_url,
  //               'is_available', pv.is_available,
  //               'color_id', pv.color_id,
  //               'color_name', pc.color,
  //               'material_id', pv.material_id,
  //               'material_name', pm.material_name,
  //               'size_id', pv.size_id,
  //               'size_name', ps.size,
  //               'created_at', pv.created_at,
  //               'updated_at', pv.updated_at,
  //               'gender', (
  //                 SELECT JSON_ARRAYAGG(pg.gender)
  //                 FROM product_genders pg
  //                 WHERE JSON_CONTAINS(pv.gender, JSON_QUOTE(CAST(pg.id AS CHAR)), '$')
  //               ),
  //               'images_array', pd.images
  //             )
  //           )
  //           FROM product_variants pv
  //           WHERE pv.product_id = p.id
  //         ) AS variants
  //       FROM products p
  //       WHERE p.id = :productId
  //       `,
  //       {
  //         replacements: { productId: req.query.id },
  //         type: dbConnection.QueryTypes.SELECT,
  //       }
  //     );

  //     return res.status(200).json({
  //       message: "Fetch product by id",
  //       data: getProductById, // getproductList,
  //       success: true,
  //     });
  //   } catch (err) {
  //     console.log(err, "Errrr servce");
  //     return res
  //       .status(500)
  //       .json({ message: err?.message, success: false, statusCode: 500 });
  //   }
  // }

  //admin get all product

  async fetch_all_productDataForAdmin(req, res) {
    try {
      // console.log(
      //   req.body,
      //   "EEEEEEEEEEEEEEEEEEE",
      //   req.query,
      //   "asdf",
      //   req.userData
      // );
      // req.query.country_code="IN"
      //       let productListQuery = `
      //         SELECT
      //             p.id,
      //              p.title,p.slug,
      //             p.condition,
      //             p.gender,
      //             p.status,
      //             p.shape_id,
      //             p.material_id,p.weight_group_id,
      //             p.size_id,
      //             p.frame_width,
      //             p.lens_width,
      //              p.model_number,p.frame_type_id,
      //             p.lens_height,p.bridge_width,
      //             p.temple_length,
      //          p.thumbnail_img,
      // JSON_OBJECT(
      //   'meta_title', MAX(s.meta_title),
      //     'meta_description', MAX(s.meta_description),
      //     'tags', MAX(s.tags),
      //     'product_id', MAX(s.product_id),
      //     'status', MAX(s.status)
      // ) AS seoObj,
      //           p.created_at,
      //             p.cat_id,p.sku,
      //             JSON_ARRAYAGG(
      //               JSON_OBJECT(
      //                 'variant_id', pv.variant_id,
      //                 'product_id',pv.product_id,
      //                 'variant_price_details',pv.variant_price_details,
      //                 'thumbnail_url', pv.thumbnail_url,
      //                 'color_id', pv.color_id,
      //                 'status',pv.status
      //               )
      //             ) AS variants
      //                     FROM products p
      //                     LEFT JOIN product_variants pv ON p.id = pv.product_id
      //                     LEFT JOIN seo s ON p.id = s.product_id AND s.status = 'active'
      //                   --  WHERE p.status = 'active' OR pv.status = 'active'
      //                     GROUP BY p.id;
      //                `;

      //       let productList = await dbConnection.query(productListQuery, {
      //         type: dbConnection.QueryTypes.SELECT,
      //       });
      let t;

      let productListQuery = `
    SELECT 
        p.id,
        p.title,
        p.slug,
        p.condition,
        p.gender,
        p.status,
        p.shape_id,
        p.material_id,
        p.weight_group_id,
        p.size_id,
        p.frame_width,
        p.lens_width,
        p.model_number,
        p.frame_type_id,
        p.lens_height,
        p.bridge_width,
        p.temple_length,
        p.thumbnail_img,
        JSON_OBJECT(
            'meta_title', MAX(s.meta_title),
            'meta_description', MAX(s.meta_description),
            'tags', MAX(s.tags),
            'product_id', MAX(s.product_id),
            'status', MAX(s.status)
        ) AS seoObj,
        p.created_at,
        p.cat_id,
        p.sku,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'variant_id', pv.variant_id,
                'product_id',pv.product_id,
                'variant_price_details',pv.variant_price_details,
                'thumbnail_url', pv.thumbnail_url, 
                'color_id', pv.color_id,
                'status',pv.status
            )
        ) AS variants
    FROM 
        products p
    LEFT JOIN 
        product_variants pv ON p.id = pv.product_id
    LEFT JOIN 
        seo s ON p.id = s.product_id AND s.status = 'active'
        ${req.query.name ? "WHERE p.title LIKE :productName" : ""}  
       -- p.title LIKE :productName
    GROUP BY 
        p.id;
`;

      let productList = await dbConnection.query(productListQuery, {
        type: dbConnection.QueryTypes.SELECT,
        // replacements: { productName: `%${req.query?.name}%` } // Dynamic replacement for the product name
        replacements: req.query.name
          ? { productName: `%${req.query.name}%` }
          : {},
      });

      let get = await filterProduct.findAll();
      let colorArray = get[0]?.color;
      let frame_type_array = get[0]?.frame_type;
      for (let le of productList) {
        le.variants = le.variants.filter((ele) => ele.color_id !== null);
        for (let ele of le.variants) {
          let colorData = colorArray.find(
            (element) => element?.id == ele?.color_id
          );
          ele.colorName = colorData?.value;
        }
      }

      // console.log(req.userData, "req.userdataaaa");
      if (req.userData.role != "super_admin") {
        let country_code = req.userData?.country;
        for (let i = 0; i < productList.length; i++) {
          for (let j = 0; j < productList[i]?.variants.length; j++) {
            const le = productList[i]?.variants[j];
            const obj = { ...le };
            const filterData = le?.variant_price_details?.filter(
              (elem) => elem?.country_code === country_code
            );
            delete obj.variant_price_details;
            obj.variant_price_details = filterData;
            productList[i].variants[j] = obj;
          }
        }
      }
      productList = productList.sort((x, y) => y?.created_at - x?.created_at);
      return res.status(200).json({
        message: "Fetch all productss",
        data: productList,
        success: true,
        statusCode: 200,
      });
    } catch (err) {
      console.log(err, "Errrrrrrr in fetch all prodcut by filter rrr");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async destro_product(req, res) {
    try {
      let { id } = req.query;
      let findExist = await ProductModel.findOne({
        where: { id },
        raw: true,
        attributes: ["id", "title", "thumbnail_img"],
      });
      let get = await ProductImageModel.findOne({
        where: { product_id: id },
        attributes: ["images"],
        raw: true,
      });
      let getVariantImages = await ProductVariantModel.findOne({
        where: { product_id: id },
        attributes: ["thumbnail_url"],
        raw: true,
      });

      // console.log(
      //   findExist,
      //   "findexisttttt",
      //   get,
      //   "get22get22",
      //   getVariantImages
      // );
      if (findExist) {
        await ProductImageModel.destroy({ where: { product_id: id } });
        if (findExist?.thumbnail_img) {
          try {
            let filePath = `./src/uploads/${findExist?.thumbnail_img}`;
            await fs.unlinkSync(filePath);
          } catch (err) {
            console.error(err, "Eroror");
          }
          try {
             deleteCdnFile(findExist?.thumbnail_img, "product");
          } catch (err) {
            console.log(err, "err in cdn delete");
          }
          
        }
        if (getVariantImages && getVariantImages?.thumbnail_url) {
          try {
          let  filePath = `./src/uploads/${getVariantImages?.thumbnail_url}`;
            await fs.unlinkSync(filePath);
          } catch (error) {
            console.error(error, "Eroror");
          }
          try {
             deleteCdnFile(getVariantImages?.thumbnail_url, "product");
          } catch (err) {
            console.log(err, "err in cdn delete");
          }
        }
        await ProductModel.destroy({ where: { id } });
        await ProductVariantModel.destroy({ where: { product_id: id } });
        if (get && get?.images?.length) {
          try {
            for (let el of get?.images) {
              let filePath = `./src/uploads/${el}`;
              await fs.unlinkSync(filePath);
            }
          } catch (err) {
            console.error(err, "Eroror");
          }
          try {
            for (let el of get?.images) {
              let filePath = `./src/uploads/${el}`;
              await deleteCdnFile(el, "product");
            }
          } catch (err) {
            console.log(err, "err in cdn delete");
          }
        }
        return res.status(200).json({
          message: "Product deleted successfully",
          statusCode: 200,
          success: true,
        });
      } else {
        return res.status(400).json({
          message: "Product not found or deleted already",
          statusCode: 400,
          success: false,
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async destro_product_variant(req, res) {
    try {
      let { id } = req.query;
      let findExist = await ProductVariantModel.findOne({
        where: { variant_id: id },
        raw: true,
        attributes: ["variant_id"],
      });
      if (findExist) {
        await ProductVariantModel.destroy({ where: { variant_id: id } });
        return res.status(200).json({
          message: "Product variant deleted successfully",
          statusCode: 200,
          success: true,
        });
      } else {
        return res.status(400).json({
          message: "Product variant not found or deleted already",
          statusCode: 400,
          success: false,
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async change_status_product(req, res) {
    try {
      let { id, status } = req.body;
      let findExist = await ProductModel.findOne({
        where: { id },
        raw: true,
        attributes: ["id", "title", "status"],
      });
      if (findExist) {
        // await ProductDescriptionModel.destroy({ where: { product_id: id } });
        await ProductModel.update({ status }, { where: { id } });
        await ProductVariantModel.update(
          { status },
          { where: { product_id: id } }
        );
        return res.status(200).json({
          message: "Product status update successfully",
          statusCode: 200,
          success: true,
        });
      } else {
        return res.status(400).json({
          message: "Product not found",
          statusCode: 400,
          success: false,
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async change_status_product_variant_by_id(req, res) {
    try {
      let { id, status } = req.body;
      // console.log(req.query,"Reqqqqqqqqqqq")
      let findExist = await ProductVariantModel.findOne({
        where: { variant_id: id },
        attributes: ["variant_id"],
        raw: true,
      });
      if (findExist) {
        await ProductVariantModel.update(
          { status },
          { where: { variant_id: id } }
        );
        return res.status(200).json({
          message: "Product variant status update successfully",
          statusCode: 200,
          success: true,
        });
      } else {
        return res.status(400).json({
          message: "Product variant not found ",
          statusCode: 400,
          success: false,
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async fetch_product_by_id_data(req, res) {
    try {
      let getProductById = await ProductModel.findOne({
        where: { id: req.query.id },
        // include: [
        //   { model: ProductVariantModel, as: "variants", raw: true },
        // ],
        raw: true,
      });

      if (getProductById) {
        let filterData = await filterProduct.findOne({ raw: true });
        let filterCatData = filterData?.categories;
        getProductById.categoryName = filterCatData?.find(
          (el) => el?.id == getProductById?.cat_id
        )?.value;

        let filterShapeData = filterData?.shape;
        getProductById.shapeName = filterShapeData?.find(
          (el) => el?.id == getProductById?.shape_id
        )?.value;
        let filterMaterialData = filterData?.material;
        getProductById.materialName = filterMaterialData?.find(
          (el) => el?.id == getProductById?.material_id
        )?.value;
        let filterSizeData = filterData?.size;
        getProductById.sizeName = filterSizeData?.find(
          (e) => e?.id == getProductById?.size_id
        )?.value;
        let filterFrameData = filterData?.frame_type;
        getProductById.frameTypeName = filterFrameData?.find(
          (e) => e?.id == getProductById?.frame_type_id
        )?.value;

        let filterGenderData = filterData?.gender;
        let tempGender = [];
        if (getProductById && getProductById?.gender?.length) {
          for (let elem of getProductById?.gender) {
            let check = filterGenderData?.find((el) => el?.id == elem)?.value;
            tempGender.push(check);
          }
        }
        getProductById.genderArr = tempGender;

        let filterColorData = filterData?.color;
        let variantData = await ProductVariantModel.findAll({
          where: { product_id: req.query.id },
          raw: true,
        });
        if (variantData && variantData?.length) {
          for (let elem of variantData) {
            elem.colorName = filterColorData?.find(
              (e) => e?.id == elem?.color_id
            )?.value;
          }
          getProductById.variantData = variantData;
        }
        let fetchSeoData = await SeoModel.findOne({
          where: { product_id: req.query.id, status: "active" },
          raw: true,
        });
        if (fetchSeoData && fetchSeoData.id) {
          getProductById.seoData = fetchSeoData;
        }

        return res.status(200).json({
          message: "Fetch product by id",
          data: getProductById,
          success: true,
          statusCode: 200,
        });
      } else {
        return res.status(400).json({
          message: "Product not found",
          success: false,
          statusCode: 400,
        });
      }
    } catch (err) {
      console.log(err, "Errrr servce");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async fetch_product_variant_by_id_data(req, res) {
    try {
      let getProductVariantById = await ProductVariantModel.findOne({
        where: { variant_id: req.query.id },
        raw: true,
      });

      if (getProductVariantById) {
        let filterData = await filterProduct.findOne({ raw: true });
        let filterColorData = filterData?.color;
        getProductVariantById.colorName = filterColorData?.find(
          (e) => e?.id == getProductVariantById?.color_id
        )?.value;

        let productData = await ProductModel.findOne({
          where: { id: getProductVariantById?.product_id },
          raw: true,
        });
        if (productData) {
          let filterCatData = filterData?.categories;
          productData.categoryName = filterCatData?.find(
            (el) => el?.id == productData?.cat_id
          )?.value;

          let filterShapeData = filterData?.shape;
          productData.shapeName = filterShapeData?.find(
            (el) => el?.id == productData?.shape_id
          )?.value;
          let filterMaterialData = filterData?.material;
          productData.materialName = filterMaterialData?.find(
            (el) => el?.id == productData?.material_id
          )?.value;
          let filterSizeData = filterData?.size;
          productData.sizeName = filterSizeData?.find(
            (e) => e?.id == productData?.size_id
          )?.value;
          let filterGenderData = filterData?.gender;
          let tempGender = [];
          if (productData && productData?.gender?.length) {
            for (let elem of productData?.gender) {
              let check = filterGenderData?.find((el) => el?.id == elem)?.value;
              tempGender.push(check);
            }
          }
          productData.genderArr = tempGender;
        }

        getProductVariantById.productObj = productData;
        let variantData = await ProductImageModel.findOne({
          where: {
            variant_id: getProductVariantById?.variant_id,
            product_id: getProductVariantById?.product_id,
          },
          raw: true,
        });
        // if()
        getProductVariantById.variantImageObj = variantData;
        return res.status(200).json({
          message: "Fetch product by id",
          data: getProductVariantById,
          success: true,
          statusCode: 200,
        });
      } else {
        return res.status(400).json({
          message: "Product variant not found",
          success: false,
          statusCode: 400,
        });
      }
    } catch (err) {
      console.log(err, "Errrr servce");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async addProductVariantStockData(req, res) {
    try {
      let { variant_id, country_code, stock } = req.body;
      let findVariant = await ProductVariantModel.findOne({
        where: { variant_id },
        raw: true,
      });
      if (!findVariant) {
        return res.status(400).json({
          message: "Variant not found",
          statusCode: 400,
          success: false,
        });
      } else {
        let countryData = findVariant?.variant_price_details;
        let countryExist = countryData?.find(
          (el) => el?.country_code == country_code
        );
        if (!countryExist) {
          return res.status(400).json({
            message: `This country_code "${country_code}" is not added`,
            statusCode: 400,
            success: false,
          });
        }
        countryData = countryData?.map((el) => {
          if (el?.country_code == country_code) {
            // el.stock = parseInt(el?.stock) + parseInt(stock);
            el.stock = parseInt(stock);
            return el;
          } else {
            return el;
          }
        });

        await ProductVariantModel.update(
          { variant_price_details: countryData },
          { where: { variant_id } }
        );
        return res.status(200).json({
          message: "Variant inventory update successfully",
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

  async editVariantCountryStatusData(req, res) {
    try {
      let { variant_id, country_code, status } = req.body;
      let findVariant = await ProductVariantModel.findOne({
        where: { variant_id },
        raw: true,
      });
      if (!findVariant) {
        return res.status(400).json({
          message: "Variant not found",
          statusCode: 400,
          success: false,
        });
      } else {
        let countryData = findVariant?.variant_price_details;
        let countryExist = countryData?.find(
          (el) => el?.country_code == country_code
        );
        if (!countryExist) {
          return res.status(400).json({
            message: `This country_code "${country_code}" is not added`,
            statusCode: 400,
            success: false,
          });
        }
        countryData = countryData?.map((el) => {
          if (el?.country_code == country_code) {
            // el.stock = parseInt(el?.stock) + parseInt(stock);
            el.status = status;
            return el;
          } else {
            return el;
          }
        });

        await ProductVariantModel.update(
          { variant_price_details: countryData },
          { where: { variant_id } }
        );
        return res.status(200).json({
          message: "Variant country status update successfully",
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

  async destro_product_variant_country(req, res) {
    try {
      let { variant_id, product_id, country_code } = req.query;
      let findExist = await ProductVariantModel.findOne({
        where: { variant_id: variant_id, product_id: product_id },
        raw: true,
        attributes: ["variant_id", "product_id", "variant_price_details"],
      });

      if (findExist?.variant_id) {
        let temp = findExist?.variant_price_details;
        temp = temp?.filter((el) => el?.country_code != country_code);

        await ProductVariantModel.update(
          { variant_price_details: temp },
          { where: { variant_id: variant_id } }
        );
        return res.status(200).json({
          message: "Product variant updated successfully",
          statusCode: 200,
          success: true,
        });
      } else {
        return res.status(400).json({
          message: "Product variant's country not found",
          statusCode: 400,
          success: false,
        });
      }
    } catch (err) {
      console.error(err, "erorr in deleted cuntry ");
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
}

const ProductServicesObj = new ProductServices();
export default ProductServicesObj;
