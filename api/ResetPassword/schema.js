const joi = require("celebrate").Joi;

module.exports.options = {
  abortEarly: false,
  convert: true,
  stripUnknown: true,
};

module.exports.sendLink = {
  body: joi.object().keys({
    userId: joi.string().required(),
    secretKey: joi.string().required(),
  }),
};
