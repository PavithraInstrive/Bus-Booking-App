/* eslint-disable no-unused-vars */
const express = require("express");

const router = express.Router();
const c = require("../../system/utils/controller-handler.js");
const controller = require("./controller.js");
const auth = require("../../system/middleware/auth");


router.post(
  "/update_password/:key",
  c(controller.updatePassword, (req, res, next) => [req])
);

router.post(
  "/send_forgot_password_link",
  c(controller.forgotPasswordLink, (req, res, next) => [req])
);

router.post(
  "/reset_password",
  auth.authenticate,
  c(controller.resetPassword, (req, res, next) => [req])
);

module.exports = router;
