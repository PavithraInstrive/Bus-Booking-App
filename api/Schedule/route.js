const express = require("express");
const router = express.Router();
const { celebrate } = require("celebrate");
const c = require("../../system/utils/controller-handler");
const controller = require("./controller");
const schema = require("./schema");

router.post(
  "/scheduleBus",
  celebrate(schema.ScheduleSchema, schema.options),
  c(controller.scheduleBus, (req, res, next) => [req])
);

router.get(
  "/getScheduleBuses",
  celebrate(schema.getSchedule, schema.options),
  c(controller.getSchedule, (req, res, next) => [req])
);

// router.get( 
//   "/getAllSchedules",
//   c(controller.getAllSchedules, (req, res, next) => [req])
// );

module.exports = router;
