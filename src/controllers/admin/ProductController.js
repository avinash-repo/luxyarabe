import { ImageFileCheck, removefIle } from "../../helpers/validateImageFile.js";
import {
  addProductVariantchema,
  addProductchema,
  addProductVariantImageschema,
  editProductchema,
  editProductVariantchema,
  editProductVariantImageschema,
  addProductVariantStockschema,
  addProductCountryschema,
  editVariantCountryStatusschema,
  addProductCountryOnlyschema,
  DeleteProductVariantsCountrychema,
} from "../../helpers/validateProduct.js";
import ProductServicesObj from "../../services/admin/ProductServices.js";
import fs from "fs";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

class ProductController {
  async addProduct(req, res) {
    try {
      let { error } = addProductchema.validate(req?.body, options);
      if (error) {
        return res
          .status(400)
          .json({ message: error.details[0]?.message, success: false });
      }
      // console.log(req.files?.thumbnail_img,":req.files?.thumbnail_imgreq.files?.thumbnail_img");
      if (req.files && req.files?.thumbnail_img?.length) {
        let name = req.files?.thumbnail_img[0]?.filename;
        let size = req.files?.thumbnail_img[0].size;
        let get = await ImageFileCheck(name, res, size);
        if (get == "invalid file") {
          try {removefIle(name)} catch (er) {console.log(er,"eoror in remove product imgae")  }
          return res.status(400).json({
            message:
              "Product image must be png or jpeg or webp file and size must be less than 500 kb",
            statusCode: 400,
            success: false,
          });
        }
      } else {
        return res.status(400).json({
          message: "Product image is mandatory",
          success: false,
          statusCode: 400,
        });
      }
      ProductServicesObj.addProductData(req, res);
    } catch (err) {
      console.error(err, "Error ");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async editProduct(req, res) {
    try {
      let { error } = editProductchema.validate(req?.body, options);
      if (error) {
        return res
          .status(400)
          .json({ message: error.details[0]?.message, success: false });
      }

      if (req.files && req.files?.thumbnail_img?.length) {
        let name = req.files?.thumbnail_img[0]?.filename;
        let size = req.files?.thumbnail_img[0]?.size;
        let get = await ImageFileCheck(name, res, size);
        // console.log(get, "GGGGFFFFFFFFFFDDDDDDDDDDDDDDDDDDD prodcut image");
        if (get == "invalid file") {
          try {removefIle(name)} catch (er) {console.log(er,"eoror in remove product imgae")  }
          return res.status(400).json({
            message:
              "Product image must be png or jpeg or webp file and must size must be less than 500 kb",
            statusCode: 400,
            success: false,
          });
        }
      }

      ProductServicesObj.editProductData(req, res);
    } catch (err) {
      console.error(err, "Error ");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async addProductVariant(req, res) {
    try {
      let { error } = addProductVariantchema.validate(req?.body, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }

      ProductServicesObj.addProductVariantData(req, res);
    } catch (err) {
      console.error(err, "Error  ");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async editProductVariant(req, res) {
    try {
      let { error } = editProductVariantchema.validate(req?.body, options);
      if (error) {
        return res
          .status(400)
          .json({ message: error.details[0]?.message, success: false });
      }
      if (req.files?.variant_image && req.files?.variant_image?.length > 0) {
        let array = req.files?.variant_image;
        for (let el of array) {
          let name = el?.filename;
          let size = el?.size;
          let get = await ImageFileCheck(name, res, size);
          if (get == "invalid file") {
            try {removefIle(name)} catch (er) {console.log(er,"eoror in remove product imgae")  }
            return res.status(400).json({
              message:
                "Product variant image must be png or jpeg or webp file and size must be less than 500 kb",
              statusCode: 400,
              success: false,
            });
          }
        }
      }
      ProductServicesObj.editProductVariantData(req, res);
    } catch (err) {
      console.error(err, "Error  ");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async add_product_variant_Images(req, res) {
    try {
      // if (req.userData && req.userData?.role != "admin") {
      //   return res.status(400).json({
      //     message: "Not authorise to add product",
      //     success: false,
      //     statusCode: 400,
      //   });
      // }

      let { error } = addProductVariantImageschema.validate(req?.body, options);
      if (error) {
        return res
          .status(400)
          .json({ message: error.details[0]?.message, success: false });
      }
      if (req.files.variant_image_Arr && req.files.variant_image_Arr?.length) {
        let array = req.files.variant_image_Arr;
        // console.log(array,"arrayayayayy");
        let msg=[]
        for (let el of array) {
          let name = el?.filename;
          let size = el?.size;
          let get = await ImageFileCheck(name, res, size);
          // console.log(get,"GEgetgetg");
          if (get == "invalid file") {
              try {removefIle(name)} catch (er) {console.log(er,"eoror in remove product imgae")  }
              msg.push(name)
          }
        }
        if(msg&&msg?.length){
          console.log(msg,"msggggggggggggggggg");
          return res.status(400).json({
            message:
              `Product variant image must be png or jpeg or webp file and size must be less than 500 kb`,
            statusCode: 400,
            success: false,
          });
        }
      } else {
        return res.status(400).json({
          message: "Product variant image is mandatory",
          success: false,
        });
      }
      ProductServicesObj.addProductVariantImageData(req, res);
    } catch (err) {
      console.error(err, "Error  ");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async edit_product_variant_Images(req, res) {
    try {
      // console.log(req.body, "req.bodyyyyyyyyyyyyy");
      let { error } = editProductVariantImageschema.validate(
        req?.body,
        options
      );
      if (error) {
        return res
          .status(400)
          .json({ message: error.details[0]?.message, success: false });
      }
      ProductServicesObj.editProductVariantImageData(req, res);
    } catch (err) {
      console.error(err, "Error  ");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async fetch_all_product(req, res) {
    try {
      ProductServicesObj.fetch_all_productData(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async get_all_product_by_search(req, res) {
    try {
      ProductServicesObj.get_all_product_by_search_data(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async fetch_product_by_id(req, res) {
    try {
      if (!req.query.id) {
        return res
          .status(400)
          .json({ message: "Product Id not found", success: false });
      }
      ProductServicesObj.fetch_product_by_id_data(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async fetch_all_product_admin(req, res) {
    try {
      ProductServicesObj.fetch_all_productDataForAdmin(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async destro_product_by_id(req, res) {
    try {
      if (!req.query.id) {
        return res.status(400).json({
          message: "Product id is mandatory",
          statusCode: 400,
          success: false,
        });
      }
      ProductServicesObj.destro_product(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async destro_product_variant_by_id(req, res) {
    try {
      if (!req.query.id) {
        return res.status(400).json({
          message: "Product variant id is mandatory",
          statusCode: 400,
          success: false,
        });
      }
      ProductServicesObj.destro_product_variant(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async destro_product_variant_country_by_id(req, res) {
    try {
      let { error } = DeleteProductVariantsCountrychema.validate(
        req?.query,
        options
      );
      if (error) {
        return res
          .status(400)
          .json({ message: error.details[0]?.message, success: false });
      }

   
      ProductServicesObj.destro_product_variant_country(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async change_status_product(req, res) {
    try {
      if (!req.body.id) {
        return res.status(400).json({
          message: "Product id is mandatory",
          statusCode: 400,
          success: false,
        });
      } else if (!req.body.status) {
        return res.status(400).json({
          message: "Product status is mandatory",
          statusCode: 400,
          success: false,
        });
      } else if (req.body.status != "active" && req.body.status != "inactive") {
        return res.status(400).json({
          message: "Status must be 'active' or 'inactive'",
          statusCode: 400,
          success: false,
        });
      }
      ProductServicesObj.change_status_product(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async change_status_product_variant(req, res) {
    try {
      if (!req.body.id) {
        return res.status(400).json({
          message: "Product variant id is mandatory",
          statusCode: 400,
          success: false,
        });
      } else if (!req.body.status) {
        return res.status(400).json({
          message: "Product variant status is mandatory",
          statusCode: 400,
          success: false,
        });
      }
      ProductServicesObj.change_status_product_variant_by_id(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async fetch_product_variant_by_id(req, res) {
    try {
      if (!req.query.id) {
        return res.status(400).json({
          message: "Product variant id is mandatory",
          statusCode: 400,
          success: false,
        });
      }
      ProductServicesObj.fetch_product_variant_by_id_data(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async add_stock(req, res) {
    try {
      // console.log(req.body, "req.bodyyyyyyyyyyyyy");
      let { error } = addProductVariantStockschema.validate(req?.body, options);
      if (error) {
        return res
          .status(400)
          .json({ message: error.details[0]?.message, success: false });
      }
      ProductServicesObj.addProductVariantStockData(req, res);
    } catch (err) {
      console.error(err, "Error  ");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async add_country_only(req, res) {
    try {
      // console.log(req.body, "req.bodyyyyyyyyyyyy");
      let { error } = addProductCountryOnlyschema.validate(req?.body, options);
      if (error) {
        return res
          .status(400)
          .json({ message: error.details[0]?.message, success: false });
      }
      ProductServicesObj?.addVariantOnlyCountryData(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async add_country_data(req, res) {
    try {
      let { error } = addProductCountryschema.validate(req?.body, options);
      if (error) {
        return res
          .status(400)
          .json({ message: error.details[0]?.message, success: false });
      }
      // console.log(req.body, "eeeeeee");
      // if (Number(req.body.discount) >= Number(req.body.price)) {
      //   return res.status(400).json({
      //     message: "Discount cannot be more than or equal to price",
      //     statusCode: 400,
      //     success: false,
      //   });
      // }
      // else if (Number(req.body.purchase_price) > Number(req.body.price)) {
      //   return res.status(400).json({
      //     message: "Purchase price cannot be more than selling price",
      //     statusCode: 400,
      //     success: false,
      //   });
      // }
      ProductServicesObj?.addVariantCountryData(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async edit_variant_country_status(req, res) {
    try {
      let { error } = editVariantCountryStatusschema.validate(
        req?.body,
        options
      );
      if (error) {
        return res
          .status(400)
          .json({ message: error.details[0]?.message, success: false });
      }
      ProductServicesObj?.editVariantCountryStatusData(req, res);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
}

const ProductControllerObj = new ProductController();
export default ProductControllerObj;
