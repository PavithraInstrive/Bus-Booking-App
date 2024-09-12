const { query } = require("express");
const Joi = require("joi");

const checkoutSchema = {
  body: Joi.object({
    paymentMethodTypes: Joi.string().required(),
    successUrl: Joi.string().required(),
    cancelUrl: Joi.string().required(),
  }),
};

const editCardSchema = {
  body: Joi.object({
    card: Joi.object().required(),
    customerId: Joi.string().required(),
  }),
  query: Joi.object({
    paymentMethodId: Joi.string().required(),
  }),
};

const deleteCardSchema = {
  query: Joi.object({
    paymentMethodId: Joi.string().required(),
    customerId: Joi.string().required(),
  }),
};

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

module.exports = {
  checkoutSchema,
  editCardSchema,
  deleteCardSchema,
  options,
};
