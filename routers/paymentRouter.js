const webhook = require('../api/Payment/route');

const webhookRouters = (app) => {
    app.use('/api/webhook', webhook)
};

module.exports = webhookRouters;