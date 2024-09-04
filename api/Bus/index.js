const { Schema } = require('mongoose');
const { dbConn } = require('../../system/db/mongo');

const busSchema = new Schema({
  busNumber: { type: String, required: true, unique: true },
  busType: { type: String, enum: ['AC', 'Non-AC', 'Sleeper', 'Seater'], required: true },
  capacity: { type: Number, required: true },
  features: [{ type: String }],
},
{
    timestamps: true
});
  

const Bus = dbConn.model('bus', busSchema);
module.exports = Bus;