const { Schema } = require('mongoose');
const { dbConn } = require('../../system/db/mongo');

const scheduleSchema = new Schema({
  busId: { type: Schema.Types.ObjectId, ref: 'Bus', required: true },
  routeId: { type: Schema.Types.ObjectId, ref: 'Route', required: true },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  price: { type: Number, required: true },
},
{
    timestamps: true
});
  

const schedule = dbConn.model('schedule', scheduleSchema);
module.exports = schedule;