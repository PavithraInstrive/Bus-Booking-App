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
    from: Joi.string().required(),
    to: Joi.string().required(),
    date: Joi.date().required(),
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
