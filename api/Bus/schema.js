const Joi = require("joi");

const addBusSchema = {
  body: Joi.object({
    busNumber: Joi.string().required(),
    busType: Joi.string().valid("AC", "Non-AC", "Sleeper", "Seater").required(),
    capacity: Joi.number().positive().required(),
    features: Joi.array().items(Joi.string()).optional(),
  }),
};
const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

module.exports = {
  addBusSchema,
  options,
};
