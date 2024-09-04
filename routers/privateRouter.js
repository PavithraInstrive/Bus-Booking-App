
const route = require('../api/Route/route');
const auth = require("../system/middleware/auth");
const bus = require('../api/Bus/route');
const schedule = require("../api/Schedule/route");

const privateRouters = (app) => {
  app.use("/", auth.authenticate);
  app.use('/api/route', route);
  app.use('/api/bus', bus);
  app.use('/api/schedule', schedule);
  
};

module.exports = privateRouters;
