const express = require("express");
const router = express.Router();
const { celebrate } = require("celebrate");
const c = require("../../system/utils/controller-handler");
const controller = require("./controller");
const schema = require("./schema");
const { route } = require("../..");

router.post(
  "/storeCardDetails",
  // celebrate(schema.addRouteSchema, schema.options),
  c(controller.storeCardDetails, (req, res, next) => [req])
);

router.post(
  "/create-checkout-session",
  // celebrate(schema.addRouteSchema, schema.options),
  c(controller.createCheckoutSession, (req, res, next) => [req])
);

router.get(
  '/getCustomerCards',
  c(controller.getCustomerCards, (req, res, next) => [req])
)

router.put(
  '/editCard',
  // celebrate(schema.editCardSchema), 
  c(controller.editCardDetails, (req, res, next) => [req])
);

router.delete(
  '/deleteCard',
  c(controller.deleteCard, (req, res, next) => [req])
)



module.exports = router;
