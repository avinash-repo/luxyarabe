import Joi from "joi";

export const onlinePaymentOptionSchema = Joi.object({
  payment_name: Joi.string()
    .min(2)
    .trim()
    .label("option")
    .required(),
  country_code: Joi.string()
    .min(2)
    .trim()
    .required()
    .label("description"),
  is_local: Joi.number()
    .min(1)
    .trim()
    .required()
    .label("country"),
  
});