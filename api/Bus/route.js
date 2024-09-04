const express = require('express');
const router = express.Router();
const { celebrate } = require('celebrate');
const c = require('../../system/utils/controller-handler');
const controller = require('./controller');
const schema = require('./schema');


router.post('/addBus',
     celebrate(schema.addBusSchema, schema.options), 
     c(controller.addBus, (req, res, next) => [req]));


module.exports = router;