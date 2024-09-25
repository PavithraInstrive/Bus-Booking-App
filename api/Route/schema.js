const Joi = require("joi");

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

const addRouteSchema = {
  body: Joi.object({
    startLocation: Joi.string().required(),
    endLocation: Joi.string().required(),
    distance: Joi.number().positive().required(),
    // stops: Joi.array().items(Joi.string()).optional(),
    boardingPoints: Joi.array().items(Joi.string()).required(),
    dropPoints: Joi.array().items(Joi.string()).required(),
    duration: Joi.string().required(),
  }),
};

module.exports = {
  addRouteSchema,
  options,
};
