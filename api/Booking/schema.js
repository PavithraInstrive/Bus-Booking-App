const Joi = require("joi");

const bookSeatsSchema = {
  body: Joi.object({
    busId: Joi.string().required(),
    routeId: Joi.string().required(),
    seatIds: Joi.array().items(Joi.number().integer()).min(1).required(),
    price: Joi.number().positive().required(),
    from: Joi.string().required(),
    to: Joi.string().required(),
    status: Joi.string().required(),
  }),
};
const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

module.exports = {
  bookSeatsSchema,
  options,
};
