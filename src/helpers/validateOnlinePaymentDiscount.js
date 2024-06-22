import Joi from "joi";

export const onlinePaymentDiscountSchema = Joi.object({
  discount: Joi.number()
    .custom((value, helpers) => {
      if (value < 0 || value > 100) {
        return helpers.message(
          "discount cannot be negative or cannot be greator than 100 %"
        );
      }
      return value;
    })
    .required()
    .label("discount"),
    country_code:Joi.string().required()
});
export const editStatusonlinePaymentDiscountSchema = Joi.object({
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
