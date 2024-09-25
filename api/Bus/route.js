const express = require("express");
const router = express.Router();
const { celebrate } = require("celebrate");
const c = require("../../system/utils/controller-handler");
const controller = require("./controller");
const schema = require("./schema");
const { route } = require("../..");

router.post(
  "/addBus",
  celebrate(schema.addBusSchema, schema.options),
  c(controller.addBus, (req, res, next) => [req])
);

router.get(
  "/getBusById",
  celebrate(schema.getBusByIdSchema, schema.options),
  c(controller.getBusDetailsById, (req, res, next) => [req])
);

router.get(
  "/getAllBuses",
  c(controller.getAllBuses, (req, res, next) => [req])
);

router.get(
  "/fetchAvailableBuses",
  c(controller.fetchAvailableBuses, (req, res, next) => [req])
);



module.exports = router;
