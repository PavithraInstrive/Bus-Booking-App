const express = require("express");
const router = express.Router();
const controller = require("./controller");

router.post(
  "/payment",
  express.raw({ type: "application/json" }),
  controller.webhook
);

module.exports = router;
