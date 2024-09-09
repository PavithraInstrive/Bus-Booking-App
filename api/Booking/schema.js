const Joi = require("joi");

const bookSeatsSchema = {

  body: Joi.object({
    busId: Joi.string().required(),
    routeId: Joi.string().required(),
    seatIds: Joi.array().items(Joi.number().integer()).min(1).required(), // Array of seat IDs
    price: Joi.number().positive().required(), // Price should be a positive number
    from: Joi.string().required(), // Starting location for the booking
    to: Joi.string().required(), // Ending location for the booking
    status: Joi.string().required()
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
