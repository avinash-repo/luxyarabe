import Joi from "joi";

export const BeautifulEyewearCollectionSchema = Joi.object({
  name: Joi.string().max(100).required(),
  slug: Joi.string().max(100).required(),
});

