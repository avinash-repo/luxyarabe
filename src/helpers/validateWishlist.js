import Joi from "joi";
import jwt from "jsonwebtoken";
import { environmentVars } from "../config/environmentVar.js";
import { phone } from "phone";


export const forgotPasswordSchema = Joi.object({
  captchaValue: Joi.string().min(1).required().label("Captcha"),
  
});

export const resetPasswordSchema = Joi.object({
  otp_code:Joi.string().max(4).required().label("otp_code"),
  password: Joi.string()
    .min(6)
    .regex(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/)
    .required()
    .label("Password")
    .messages({
      "string.pattern.base":
        "Password must contain at least one digit, one special character, one lowercase letter, and one uppercase letter.",
    }),
});
export const otpSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required()
    .label("Email"),
  otp_code: Joi.string()
    .trim()
    .length(4)
    .regex(/^\d+$/) // Ensure it contains only digits
    .required()
    .label("OTP Code"),
});


export const statusChangeSchema = Joi.object({
  id: Joi.number().required().label("id"),
  status: Joi.string().required().valid("active", "inactive").label("status"),
});
export const addWishlistSchema = Joi.object({
  product_id: Joi.number().required().label("id"),
});
