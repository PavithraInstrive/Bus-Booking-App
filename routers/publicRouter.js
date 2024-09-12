const user = require('../api/User/route');
const password = require('../api/ResetPassword/route');
// const webhook = require('../api/Payment/route');

const publicRouters = (app) => {
    app.use('/api/user', user);
    app.use('/api/password',password)
    // app.use('/api/webhook', webhook)
};

module.exports = publicRouters;