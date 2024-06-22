import Joi from "joi";

const phonePattern = /^\+\d{1,4}-\d{10,16}$/;

export const ContactUS = Joi.object({
  full_name: Joi.string().min(3).max(100).trim().required().label("Name"),
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required()
    .label("Email"),
  // phone: Joi.string().trim().required().label("Phone Number"),
  phone: Joi.string()
    // .trim()
    // .required()
    .regex(phonePattern)
    .messages({
      "string.pattern.base":
        "Invalid Phone number format. It should be in the format +xx-xxxxxxxxxx",
      "any.required": "Phone number is required",
      "string.empty": "Phone number must not be empty",
    })
    .label("Phone Number"),
  subject: Joi.string().min(3).max(100).trim().allow("", null).label("Subject"),
  message: Joi.string().min(3).max(500).trim().allow("", null).label("Message"),
});
