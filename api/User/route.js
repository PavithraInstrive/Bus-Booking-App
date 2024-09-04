const express = require('express');
const router = express.Router();
const { celebrate } = require('celebrate');
const c = require('../../system/utils/controller-handler');
const controller = require('./controller');
const schema = require('./schema');
const auth = require("../../system/middleware/auth");


router.post('/signUp',
     celebrate(schema.signUp, schema.options), 
     c(controller.signUp, (req, res, next) => [req]));

router.post('/login',
     celebrate(schema.login, schema.options), 
     c(controller.login, (req, res, next) => [req]));

router.get('/viewProfile',
     auth.authenticate,
     c(controller.viewProfile, (req, res, next) => [req]))

module.exports = router;