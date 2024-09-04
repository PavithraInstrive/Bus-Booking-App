const Joi = require("joi");

const addRouteSchema = {
  body: Joi.object({
    startLocation: Joi.string().required(),
    endLocation: Joi.string().required(),
    distance: Joi.number().positive().required(),
    stops: Joi.array().items(Joi.string()).optional(),
  }),
};

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

module.exports = {
  addRouteSchema,
  options,
};
