import Joi from "joi";

export const FooterSchema = Joi.object({
  h1_description: Joi.string()
    .min(30)
    .max(2000)
    .trim()
    .required()
    .label("description"),
  footer_email: Joi.string().min(10).max(50).trim().required().label("email"),
  footer_phone: Joi.string().min(10).allow("",null).max(30).trim().label("phone"),
  // social_media_data: Joi.json().min(1).required().label("social media"),
  social_media_data: Joi.array()
    // .min(1)
    // .required()
    .label("social_media_data"),
});

export const SocialMediaFooterSchema = Joi.object({
url: Joi.string()
    .min(4)
    .max(200)
    .trim()
    .required()
    .label("url"),
  // footer_email: Joi.string().min(10).max(50).trim().required().label("email"),
  // footer_phone: Joi.string().min(10).max(30).trim().required().label("phone"),
  // // social_media_data: Joi.json().min(1).required().label("social media"),
  // social_media_data: Joi.array()
  //   // .min(1)
    // .required()
    // .label("social_media_data"),
});

export const DeletedSchema = Joi.object({
  id: Joi.string().max(20).required().label("id"),
 social_id: Joi.string().max(20).required().label("id"),
  
});