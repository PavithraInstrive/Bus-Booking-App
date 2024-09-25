const Joi = require("joi");

const ScheduleSchema = {
  body: Joi.object({
    busId: Joi.string().required(),
    routeId: Joi.string().required(),
    departureTime: Joi.date().required(),
    arrivalTime: Joi.date().greater(Joi.ref("departureTime")).required(),
    price: Joi.number().positive().required(),
  }),
};

const getSchedule = {
  query: Joi.object({
    from: Joi.string().optional(),
    to: Joi.string().optional(),
    date: Joi.date().optional(),
    page: Joi.number().required(),
    limit: Joi.number().required(),
  }),
};
const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

module.exports = {
  ScheduleSchema,
  getSchedule,
  options,
};
