import Joi from "joi";

export const paymentOptionSchema = Joi.object({
  option: Joi.string()
    .min(2)
    .trim()
    .label("option")
    .required(),
  description: Joi.string()
    .min(2)
    .trim()
    .required()
    .label("description"),
  country: Joi.string()
    .min(1)
    .trim()
    .required()
    .label("country"),
});
export const removePaymentOptionSchema = Joi.object({
  id: Joi.number()
    .required()
    .label("id"),
  country: Joi.string()
    .min(1)
    .trim()
    .required()
    .label("country"),
});

export const countrySchema = Joi.object({
  country: Joi.string()
    .required()
    .label("country"),
});

export const editStatusPaymentOptionSchema = Joi.object({
  id: Joi.number()
    .custom((value, helpers) => {
      if (value < 0) {
        return helpers.message("id cannot be negative");
      }
      return value;
    })
    .required()
    .label("id"),
  status: Joi.string()
    .valid("active", "inactive")
    .required()
    .label("status"),
});

export const addCodZipCodeSchema = Joi.object({
  zip_codes: Joi.array()
    .items(Joi.string().min(1))
    .min(1)
    .required()
    .label("zip_code"),
  country: Joi.string()
    .min(1)
    .trim()
    .required()
    .label("country"),
});
