import Joi from "joi";
import jwt from "jsonwebtoken";

export const getValidateFilterdatafochema = Joi.object({
  country_code: Joi.string()
    .min(2)
    .max(5)
    .trim()
    .required()
    .label("country_code"),
  cat_id: Joi.number().positive().required().label("category"),
  gender: Joi.number().positive().required().label("sub-category"),
});
