const express = require("express");
const router = express.Router();
const controller = require("./controller");

router.post(
  "/payment",express.json({ type: 'application/json' }),
  (controller.webhook, (req, res, next) => [req])
);

module.exports = router;
 