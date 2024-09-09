const express = require("express");
const router = express.Router();
const { celebrate } = require("celebrate");
const c = require("../../system/utils/controller-handler");
const controller = require("./controller");
const schema = require("./schema");

router.post(
  "/bookSeatsPerSegment",
  celebrate(schema.bookSeatsSchema, schema.options),
  c(controller.bookSeatsByLocation, (req, res, next) => [req])
);

module.exports = router;
