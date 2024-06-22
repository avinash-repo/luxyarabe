import Joi from "joi";

export const addCouponSchema = Joi.object({
  name: Joi.string().min(1).max(100).trim().required().label("Name"),
  code: Joi.string().min(1).max(100).trim().required().label("Code"),
  country: Joi.string()
  .min(1)
  .max(100)
  .trim()
  .required()
  .label("country"),
  type: Joi.string().min(1).max(10).trim().allow("", null).label("Type"),
  value: Joi.string()
    .min(1)
    .max(10)
    .trim()
    // .allow(null)
    .required()
    .label("Discounted Value") .custom((value, helpers) => {
      if (parseInt(value, 10) < 0) {
        return helpers.message('"Discounted Value" cannot be negative');
      }
      return value;
    }),
  start_date: Joi.string().min(1).trim().required().label("Start Date"),
  buy_product: Joi.number().min(1).allow(null).required().label("Buy"),
  // max_uses_per_user: Joi.number().min(1).positive().required().label("max_uses_per_user"),
  max_uses_per_user: Joi.number().min(0).required().label("max_uses_per_user"),
  new_user: Joi.string().max(10).valid("active","inactive").label("new_user"),
  get_product: Joi.number().min(1).allow(null).required().label("Get"),
  expired_date: Joi.string()
    .min(1)
    .trim()
    .required()
    .label("Expired Date")
    .custom((value, helpers) => {
      const startDate = helpers.state.ancestors[0].start_date; // Accessing start_date value
      if (new Date(value) < new Date(startDate)) {
        return helpers.message(
          '"Expired Date" must be greater than "Start Date"'
        );
      }
      return value;
    }),
  min_purchase: Joi.string()
    .min(1)
    .max(10)
    .trim()
    // .allow(null)
    .required()
    .label("Minimum Purchase") .custom((value, helpers) => {
      if (parseInt(value, 10) < 0) {
        return helpers.message('"Minimum purchase" cannot be negative');
      }
      return value;
    }),
  max_purchase: Joi.string()
    .min(1)
    .max(10)
    .trim()
    // .allow(null)
    .required()
    .label("Maximum Purchase")
    .custom((value, helpers) => {
      const minPurchase = helpers.state.ancestors[0].min_purchase; // Accessing min_purchase value
      if (parseInt(value, 10) < 0) {
        return helpers.message('"Maximum Purchase" cannot be negative');
      }
      if (parseInt(value, 10) <= parseInt(minPurchase, 10)) {
        return helpers.message(
          '"Maximum Purchase" must be greater than "Min Purchase"'
        );
      }
      return value;
    }),
  limit: Joi.string().min(1).max(10).trim().required().label("Limit"),
});
export const updateCouponSchema = Joi.object({
  name: Joi.string().min(1).max(100).trim().label("Name"),
  code: Joi.string().min(1).max(100).trim().required().label("Code"),
  type: Joi.string().min(1).max(10).trim().label("Type"),
  value: Joi.string()
    .min(1)
    .max(10)
    .trim()
    // .allow(null)
    .required()
     .custom((value, helpers) => {
      if (parseInt(value, 10) < 0) {
        return helpers.message('"Discounted Value" cannot be negative');
      }
      return value;
    })
    .label("Discounted Value"),
  start_date: Joi.string().min(1).trim().label("Start Date"),
  expired_date: Joi.string()
    .min(1)
    .trim()
    .label("Expired Date")
    .custom((value, helpers) => {
      const startDate = helpers.state.ancestors[0].start_date; // Accessing start_date value
      if (new Date(value) < new Date(startDate)) {
        return helpers.message(
          '"Expired Date" must be greater than "Start Date"'
        );
      }
      return value;
    }),
  min_purchase: Joi.string().min(1).max(10).trim().allow(null).label("Minimum Purchase") .custom((value, helpers) => {
    if (parseInt(value, 10) < 0) {
      return helpers.message('"Minimum Purchase" cannot be negative');
    }
    return value;
  }),
  new_user: Joi.string().valid("active","inactive").label("new_user"),
  max_purchase: Joi.string()
    .min(1)
    .max(10)
    .trim().allow(null)
    .label("Maximum Purchase")
    .custom((value, helpers) => {
      const minPurchase = helpers.state.ancestors[0].min_purchase; // Accessing min_purchase value
      if (parseInt(value, 10) < 0) {
        return helpers.message('"Maximum Purchase" cannot be negative');
      }
      if (parseInt(value, 10) <= parseInt(minPurchase, 10)) {
        return helpers.message(
          '"Max Purchase" must be greater than "Min Purchase"'
        );
      }
      return value;
    }),
  limit: Joi.string().min(1).max(10).trim().label("Limit"),
});
