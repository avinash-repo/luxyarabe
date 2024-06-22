import Joi from "joi";

export const addProductchema = Joi.object({
  title: Joi.string().min(3).max(50).trim().required().label("Title"),
  sku: Joi.string().required().label("sku"),
  model_number: Joi.string().max(20).required().label("model_number"),
  frame_type_id: Joi.string()
    .max(10)
    .required()
    .custom((value, helpers) => {
      if (value < 0) {
        return helpers.message("frame_type_id cannot be negative");
      }
      return value;
    })
    .label("frame_type"),
  summary: Joi.string().min(10).max(5000).trim().required().label("Summary"),
  description: Joi.string()
    .min(10)
    .max(9000)
    .trim()
    .required()
    .label("description"),
  cat_id: Joi.string()
    .trim()
    .required()
    .custom((value, helpers) => {
      if (value < 0) {
        return helpers.message("Category_id cannot be negative");
      }
      return value;
    })
    .label("category"),
  shape_id: Joi.string()
    .max(10)
    .trim()
    .custom((value, helpers) => {
      if (value < 0) {
        return helpers.message("shape_id cannot be negative");
      }
      return value;
    })
    .required()
    .label("shape"),
  material_id: Joi.string()
    .max(10)
    .trim()
    .custom((value, helpers) => {
      if (value < 0) {
        return helpers.message("material_id cannot be negative");
      }
      return value;
    })
    .required()
    .label("material_id"),
  description: Joi.string()
    .min(10)
    .max(9250)
    .trim()
    .required()
    .label("description"),
  gender: Joi.array().items(Joi.string().trim()).required().label("Gender"),
  weight_group_id: Joi.string()
    .trim()
    .required()
    .custom((value, helpers) => {
      if (value < 0) {
        return helpers.message("weight_group_id cannot be negative");
      }
      return value;
    })
    .label("weight_group_id"),
  size_id: Joi.string()
    .trim()
    .required()
    .custom((value, helpers) => {
      if (value < 0) {
        return helpers.message("size_id cannot be negative");
      }
      return value;
    })
    .label("size_id"),
  frame_width: Joi.string()
    .custom((value, helpers) => {
      if (value < 0) {
        return helpers.message("frame_width cannot be negative");
      }
      return value;
    })
    .label("frame_width"),
  lens_width: Joi.string()
    .trim()
    .custom((value, helpers) => {
      if (value < 0) {
        return helpers.message("lens_width cannot be negative");
      }
      return value;
    })
    .label("lens_width"),
  lens_height: Joi.string()
    .trim()
    .custom((value, helpers) => {
      if (value < 0) {
        return helpers.message("lens_height cannot be negative");
      }
      return value;
    })
    .label("lens_height"),
  bridge_width: Joi.string()
    .trim()
    .custom((value, helpers) => {
      if (value < 0) {
        return helpers.message("bridge_width cannot be negative");
      }
      return value;
    })
    .label("bridge_width"),
  temple_length: Joi.string()
    .trim()
    .custom((value, helpers) => {
      if (value < 0) {
        return helpers.message("temple_length cannot be negative");
      }
      return value;
    })
    .label("temple_length"),
});
// "full_rim", "half_rim", "rim_less"

export const editProductchema = Joi.object({
  title: Joi.string().min(3).max(50).trim().label("Title"),
  sku: Joi.string().trim().label("sku"),
  summary: Joi.string().min(10).max(5251).trim().label("Summary"),
  product_id: Joi.string()
    .trim()
    .required()
    .custom((value, helpers) => {
      if (value < 0) {
        return helpers.message("product_id cannot be negative");
      }
      return value;
    })
    .label("product_id"),

  shape_id: Joi.string()
    .trim()
    .max(4)
    .custom((value, helpers) => {
      if (value < 0) {
        return helpers.message("shape_id cannot be negative");
      }
      return value;
    })
    .label("shape_id"),
  size_id: Joi.string()
    .trim()
    .max(4)
    .custom((value, helpers) => {
      if (value < 0) {
        return helpers.message("size_id cannot be negative");
      }
      return value;
    })
    .label("size_id"),
  material_id: Joi.string()
    .trim()
    .max(4)
    .custom((value, helpers) => {
      if (value < 0) {
        return helpers.message("material_id cannot be negative");
      }
      return value;
    })
    .label("material_id"),

  description: Joi.string().min(10).max(9125).trim().label("description"),
  gender: Joi.array().items(Joi.string().trim()).label("Gender"),
});

export const addProductVariantchema = Joi.object({
  product_id: Joi.string()
    .trim()
    .max(4)
    .custom((value, helpers) => {
      if (value < 0) {
        return helpers.message("product_id cannot be negative");
      }
      return value;
    })
    .required()
    .label("Product id"),
  color_id: Joi.string()
    .required()
    .trim()
    .max(10)
    .custom((value, helpers) => {
      if (value < 0) {
        return helpers.message("color_id cannot be negative");
      }
      return value;
    })
    .label("color id"),
});

export const editProductVariantchema = Joi.object({
  variant_id: Joi.string().trim().max(10).required().label("variant_id"),
});

export const addProductVariantImageschema = Joi.object({
  product_id: Joi.string().required().trim().max(10).label("Product id"),
  variant_id: Joi.string().required().trim().max(10).label("Variant id"),
});

export const editProductVariantImageschema = Joi.object({
  variantImageName: Joi.string().required().trim().max(200).label("varaintImageName"),
  variant_id: Joi.string().required().trim().max(10).label("Variant id"),
});
export const DeleteProductVariantsCountrychema = Joi.object({
  country_code: Joi.string().max(5).required().label("country_code"),
  variant_id: Joi.string().max(10).required().label("Variant_id"),
  product_id: Joi.string().max(10).required().label("Product_id"),
});

export const addProductVariantStockschema = Joi.object({
  // product_id: Joi.string()
  //   .required()
  //   .label("product_id"),
  variant_id: Joi.string().required().trim().max(10).label("variant_id"),
  country_code: Joi.string().required().trim().max(10).label("country_code"),
  stock: Joi.number()
    .required()
    .custom((value, helpers) => {
      if (value <= 0) {
        return helpers.message("Stock cannot be negative or zero");
      }
      return value;
    })
    .label("stock"),
});

export const addProductCountryschema = Joi.object({
  variant_id: Joi.string().required().trim().max(10).label("variant_id"),
  country_code: Joi.string().trim().max(10).required().label("country_code"),
  price: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (value <= 0) {
        return helpers.message("Sale Price cannot be negative or zero");
      }
      return value;
    })
    .label("Sale Price"),
  purchase_price: Joi.string()
    // .required()
    .custom((value, helpers) => {
      if (value <= 0) {
        return helpers.message("Purchase price cannot be negative or zero");
      }
      return value;
    })
    .label("purchase_price"),
  // country: Joi.string()
  //   // .required()
  //   .label("country"),
  discount: Joi.number()
    .required()
    .custom((value, helpers) => {
      if (value < 0) {
        return helpers.message("Discount cannot be negative");
      } else if (value > 90) {
        return helpers.message("Discount cannot be more than 90%");
      }
      return value;
    })
    .label("discount"),
  // currency_symbol: Joi.string()
  //   // .required()
  //   .label("currency_symbol"),
  status: Joi.string().valid("active", "inactive").label("status"),
  stock: Joi.number()
    .required()
    .custom((value, helpers) => {
      if (value < 0) {
        return helpers.message("Stock cannot be negative");
      }
      return value;
    })
    .label("stock"),
});

export const addProductCountryOnlyschema = Joi.object({
  variant_id: Joi.string().required().trim().max(10).label("variant_id"),
  country_data: Joi.array()
    .items(
      Joi.object({
        country_code: Joi.string().required().trim().max(10).label("country_code"),
        country: Joi.string().required().trim().max(60).label("country"),
        currency_symbol: Joi.string().required().trim().max(10).label("currency_symbol"),
        status: Joi.string().valid("active", "inactive").label("status"),
      })
    )
    .min(1)
    .required()
    .label("country_details"),
});

export const editVariantCountryStatusschema = Joi.object({
  variant_id: Joi.string().required().trim().max(10).label("variant_id"),
  country_code: Joi.string().required().trim().max(10).label("country_code"),
  status: Joi.string().valid("active", "inactive").label("status"),
});

export const fetch_all_productschema = Joi.object({
  cat_id: Joi.number().optional(),
  sort: Joi.string()
    .valid(
      "ascending",
      "descending",
      "new_arrival",
      "popular",
      "null",
      "default"
    )
    .max(30)
    .optional(),
  gender: Joi.number().max(30).optional(),
  color: Joi.array().items(Joi.number().max(30)).optional(),
  weight_group_id: Joi.array().items(Joi.number().max(30)).optional(),
  size_id: Joi.array().items(Joi.number().max(30)).optional(),
  shape_id: Joi.array().items(Joi.number().max(30)).optional(),
  material_id: Joi.array().items(Joi.number().max(30)).optional(),
  page: Joi.number().max(30).optional(),
  limit: Joi.number().max(30).optional(),
  country_code: Joi.string().max(7).optional(),
  minPrice: Joi.array().items(Joi.number().max(30)).optional(),
  maxPrice: Joi.array().items(Joi.number().max(30)).optional(),
  // sort_order: Joi.string().valid("ascending", "descending","null").optional(),
});

export const search_query_string = Joi.object({
  searchString: Joi.string().optional().label("searchString"),
});

export const fetch_product_by_id_schema = Joi.object({
  id: Joi.string().max(10).optional().label("id"),
});
