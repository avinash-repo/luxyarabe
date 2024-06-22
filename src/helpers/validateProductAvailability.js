import Joi from "joi";

export const addZipCodeSchema = Joi.object({
  country_code: Joi.string()
    .trim()
    .label("country_code")
    .required(),
  currency_symbol: Joi.string()
    .trim()
    .required()
    .label("currency_symbol"),
  tax_name: Joi.string()
    .trim().allow("",null).optional()
    // .required()
    .label("tax_name"),
  tax_value: Joi.number().allow(null).optional()
    // .required()
    .custom((value, helpers) => {
      if (value < 0) {
        return helpers.message('"Tax Value" cannot be negative');
      }
      return value;
    })
    .label("tax_value"),
  country: Joi.string()
    .trim()
    .label("country")
    .required(),
  zipcodes: Joi.array()
    .required()
    .label("zipcodes"),
});

export const editZipCodeSchema = Joi.object({
  status: Joi.string()
    .valid("active", "inactive")
    .label("status")
    .required(),
  id: Joi.string()
    .trim()
    .label("id")
    .required(),
});

export const checkProductAvailableSchema = Joi.object({
  country_code: Joi.string()
    .label("country_code")
    .required(),
  zipcode: Joi.string()
    .trim()
    .required()
    .label("zipcode"),
});
