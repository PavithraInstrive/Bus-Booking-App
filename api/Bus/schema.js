const { query } = require("express");
const Joi = require("joi");

const addBusSchema = {
  body: Joi.object({
    busNumber: Joi.string().required(),
    busType: Joi.string().valid("AC", "Non-AC", "Sleeper", "Seater").required(),
    capacity: Joi.number().integer().min(1).required(),
    features: Joi.array().items(Joi.string()).optional(),
  }),
};

const getBusByIdSchema = {
  query: Joi.object({
    busId: Joi.string().required(),
  }),
}

const updateStatusSchema = {
  query:Joi.object({
    busId:Joi.string().required(),
  })
}
const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

module.exports = {
  addBusSchema,
  options,
  getBusByIdSchema,
  updateStatusSchema
};
