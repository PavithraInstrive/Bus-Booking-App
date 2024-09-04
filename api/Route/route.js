const express = require('express');
const router = express.Router();
const { celebrate } = require('celebrate');
const c = require('../../system/utils/controller-handler');
const controller = require('./controller');
const schema = require('./schema');


router.post('/addRoute',
     celebrate(schema.addRouteSchema, schema.options), 
     c(controller.addRouteSchema, (req, res, next) => [req]));


module.exports = router;