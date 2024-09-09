const user = require('../api/User/route');
const password = require('../api/ResetPassword/route');

const publicRouters = (app) => {
    app.use('/api/user', user);
    app.use('/api/password',password)

};

module.exports = publicRouters;